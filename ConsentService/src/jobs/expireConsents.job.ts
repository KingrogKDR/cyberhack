import cron from "node-cron";
import { prisma } from "../prisma/client";
// @ts-ignore
import logger from "../utils/logger.js";

export const startConsentExpirationJob = () => {
  // Runs every hour at minute 0 → "0 * * * *"
  cron.schedule("*/10 * * * *", async () => {
    logger.info("⏳ Consent expiration job started");

    try {
      const now = new Date();

      // Find expired, non-revoked consents
      const expiredConsents = await prisma.consent.updateMany({
        where: {
          expiresAt: {
            lt: now,
          },
          revoked: false,
        },
        data: {
          revoked: true,
        },
      });

      logger.info(
        `✅ Expired ${expiredConsents.count} consents at ${now.toISOString()}`
      );
    } catch (error) {
      logger.error("❌ Error expiring consents:", error);
    }
  });
};
