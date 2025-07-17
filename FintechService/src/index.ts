import dotenv from "dotenv";
import express from "express";
import registerRoutes from "./routes/register";
import verifyOtpRoutes from "./routes/verifyOtp";
import dataRoute from "./routes/data"
import cors from 'cors';

dotenv.config();
const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, // if you're using cookies or authorization headers
}));
app.use(express.json());
app.use("/fintech/register", registerRoutes);
app.use("/fintech/verify-otp", verifyOtpRoutes);
app.use("/fintech/data",dataRoute);

const PORT = process.env.BANK_SERVICE_PORT || 3001;
app.listen(PORT, () => {
  console.log(`Fintech service running on port ${PORT}`);
});
