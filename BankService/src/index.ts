import express from "express";
import bodyParser from "body-parser";
import initiateRegistration from "./routes/initiateRegistration";
import verifyOtp from "./routes/verifyOtp";
import data from "./routes/data"
import dotenv from "dotenv"

dotenv.config()
const app = express();
app.use(bodyParser.json());

app.use("/bank/initiate-registration", initiateRegistration);
app.use("/bank/verify-otp", verifyOtp);
app.use("/bank/data",data)

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Bank service running on port ${PORT}`);
});
