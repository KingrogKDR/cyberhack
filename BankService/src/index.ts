import dotenv from "dotenv";
import express from "express";
import path from "path";
import data from "./routes/data";
import initiateRegistration from "./routes/initiateRegistration";
import verifyOtp from "./routes/verifyOtp";

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});
const app = express();
app.use(express.json());

app.use("/bank/initiate-registration", initiateRegistration);
app.use("/bank/verify-otp", verifyOtp);
app.use("/bank/data", data);

const PORT = process.env.BANK_SERVICE_PORT || 3002;
app.listen(PORT, () => {
  console.log(`Bank service running on port ${PORT}`);
});
