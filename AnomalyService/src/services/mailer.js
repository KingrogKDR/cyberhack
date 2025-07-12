import { transporter } from "../lib/nodemailer.js";

export async function sendEmail(to, subject, body) {
  try {
    const info = await transporter.sendMail({
      from: `"VaultGuard" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      text: body
    });

    console.log("Email sent:", info.messageId);
  } catch (err) {
    console.error("Failed to send email:", err);
  }
}
