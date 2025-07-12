import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";

import { startConsentExpirationJob } from "./jobs/expireConsents.job";
import consentRoutes from "./routes/consent.routes";
import authRoutes from "./routes/auth.routes"
import userRoutes from "./routes/user.routes"
// @ts-ignore
import logger from "./utils/logger";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Global middlewares
app.use(helmet()); // Security headers
app.use(cors());
app.use(express.json());

app.use("/api", consentRoutes);
app.use("/auth", authRoutes);
app.use("/user", userRoutes)

app.get("/", (_req, res) => {
  res.send("Consent Service is running");
});

// Start background job
startConsentExpirationJob();

app.listen(PORT, () => {
  // console.log('server is running');
  console.log(`Consent Service running at http://localhost:${PORT}`);
});
