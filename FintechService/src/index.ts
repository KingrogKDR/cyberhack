import express from "express";
import bodyParser from "body-parser";
import registerRoutes from "./routes/register";
import verifyOtpRoutes from "./routes/verifyOtp";
import dotenv from "dotenv";

dotenv.config()
const app = express();
app.use(bodyParser.json());

app.use("/fintech/register", registerRoutes);
app.use("/fintech/verify-otp", verifyOtpRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Fintech service running on port ${PORT}`);
});