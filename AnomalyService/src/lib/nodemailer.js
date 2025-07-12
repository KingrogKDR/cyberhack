import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Create transporter
export const transporter = nodemailer.createTransport({
  service: "gmail", // or use 'smtp.ethereal.email' or your provider's SMTP host
  auth: {
    user: process.env.EMAIL_USER, // my email
    pass: process.env.EMAIL_PASS  
  }
});