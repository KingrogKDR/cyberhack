import axios from "axios";
import express from "express";
import ms, { StringValue } from "ms";
import { consentTemplates } from "../data/consentTemplates";
import { otpStore } from "../data/otpStore";
import { prisma } from "../prisma";
import dotenv from "dotenv";

dotenv.config();

interface PolicyResponse {
  result: boolean;
}

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, otp, appId } = req.body;
  if (!email || !otp || !appId) {
    return res
      .status(400)
      .json({ status: "error", message: "Missing email, otp, or appId" });
  }

  const expectedOtp = otpStore[email];
  if (!expectedOtp || parseInt(otp) !== expectedOtp) {
    return res.status(401).json({ status: "rejected", reason: "Invalid OTP" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res
        .status(404)
        .json({ status: "rejected", reason: "User not found in bank" });
    }

    const template = consentTemplates[appId];
    if (!template) {
      return res
        .status(400)
        .json({ status: "rejected", reason: "Unknown app" });
    }

    const allowedFields: string[] = [];

    // policy check
    for (const field of template.dataFields) {
      const policyRes = await axios.post<PolicyResponse>(
        `http://policy-service:8181/v1/data/data_access/allow`,
        {
          input: { appId, field, purpose: template.purpose },
        }
      );

      if (policyRes.data.result === true) {
        allowedFields.push(field);
      }
    }

    if (allowedFields.length === 0) {
      return res
        .status(403)
        .json({ status: "rejected", reason: "Policy denied all fields" });
    }

    await axios.post(`http://consent-service:4000/api/consent`, {
      userId: user.id,
      appId,
      dataFields: allowedFields,
      purpose: template.purpose,
      expiresAt: new Date(Date.now() + ms(template.duration as StringValue)),
    });

    delete otpStore[email];
    return res.json({ status: "success", allowedFields });
  } catch (err: any) {
    console.error("Consent creation failed:", err);
    return res.status(500).json({
      status: "error",
      reason: "Consent creation failed",
      error: err?.response?.data || err.message,
    });
  }
});

export default router;
