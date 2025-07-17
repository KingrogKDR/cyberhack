import express from "express";
import { otpStore } from "../data/otpStore";
import { prisma } from "../prisma";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return res.status(404).json({ message: "User not found in bank" });

    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[email] = otp;

    console.log(`Generated OTP for ${email}: ${otp}`);
    return res.json({message: `Generated OTP for ${email}`});
    // return res.json({ message: "OTP generated and sent"});
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;