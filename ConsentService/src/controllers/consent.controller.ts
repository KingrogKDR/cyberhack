import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import {
  checkConsent,
  createConsent,
  getUserConsents,
  revokeConsent,
} from "../services/consent.service";
import { logger } from "../utils/logger";
import { CreateConsentInput } from "../utils/validator";

// POST /consent
export const createConsentHandler = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const body = req.body as CreateConsentInput;
    const consent = await createConsent(body);
    logger.info(`Consent created for user ${body.userId}`);
    res.status(201).json({ consent });
  } catch (error) {
    logger.error("Error creating consent: " + error);
    res.status(500).json({ message: "Failed to create consent" });
  }
};

// GET /consent/:userId
export const getUserConsentsHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    const consents = await getUserConsents(userId);
    res.status(200).json({ consents });
  } catch (error) {
    logger.error("Error fetching user consents: " + error);
    res.status(500).json({ message: "Failed to fetch consents" });
  }
};

// DELETE /consent/:id
export const revokeConsentHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const consent = await revokeConsent(id);
    logger.info(`Consent ${id} revoked`);
    res.status(200).json({ consent });
  } catch (error) {
    logger.error("Error revoking consent: " + error);
    res.status(500).json({ message: "Failed to revoke consent" });
  }
};

// GET /consent/check?userId=&appId=&field=
export const checkConsentHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("Calling controller");
    const { userId, appId, field } = req.query;

    if (!userId || !appId || !field) {
      res.status(400).json({ message: "Missing query parameters" });
      return;
    }

    const allowed = await checkConsent(
      userId as string,
      appId as string,
      field as string
    );

    res.status(200).json({ allowed });
  } catch (error) {
    logger.error("Error checking consent: " + error);
    res.status(500).json({ message: "Failed to check consent" });
  }
};
