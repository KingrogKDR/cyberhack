import express from "express";
import axios from "axios";
import { BANK_SERVICE_URL, APP_ID } from "../config";


const router = express.Router();

/**
 * POST /fintech/data
 * {
 *   email: string,
 *   fields: string[],
 * }
 */
router.post("/", async (req, res) => {
  const { email, fields } = req.body;

  if (!email || !Array.isArray(fields)) {
    return res.status(400).json({ message: "Missing or invalid email or fields" });
  }

  try {
    // Step 1: Ask Bank for tokenized data
    const bankRes = await axios.post(`${BANK_SERVICE_URL}/bank/data`, {
      email,
      fields,
      appId:APP_ID,
    });

    const tokenizedFields = bankRes.data.tokenizedFields;
    if (!tokenizedFields || Object.keys(tokenizedFields).length === 0) {
      return res.status(403).json({ message: "No data returned by bank" });
    }

    // Step 2: Detokenize each token
    const realData: Record<string, any> = {};
    for (const field of fields) {
      const token = tokenizedFields[field];
      if (!token) continue;

      const detokenRes = await axios.post("http://localhost:8963/api/v1/detokenize", {
        token,
      });

      realData[field] = detokenRes.data.value;
    }

    return res.json({ data: realData });
  } catch (err: any) {
    console.error("❌ Fintech data fetch failed:", err.message);
    return res.status(500).json({
      message: "Failed to fetch detokenized data",
      error: err?.response?.data || err.message,
    });
  }
});

export default router;
