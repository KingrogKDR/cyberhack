import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import {
  checkConsent,
  createConsent,
  getUserConsents,
} from "../services/consent.service";
import { CreateConsentInput } from "../utils/validator";
// @ts-ignore
import logger from "../utils/logger.js";

// POST /consent
export const createConsentHandler = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const body = req.body as Omit<CreateConsentInput, "userId">;
    const userId = req.user?.id!;
    const consent = await createConsent(body, userId);

    logger.info(`Consent created for user ${userId}`);
    res.status(201).json({ consent });
  } catch (error) {
    logger.error("Error creating consent: " + error);
    res.status(500).json({ message: "Failed to create consent", error });
  }
};

// GET /consent (now uses userId from token, not URL param)
export const getUserConsentsHandler = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id!;
    const consents = await getUserConsents(userId);
    res.status(200).json({ consents });
  } catch (error) {
    logger.error("Error fetching user consents: " + error);
    res.status(500).json({ message: "Failed to fetch consents" });
  }
};

// DELETE /consent/:id
// export const revokeConsentHandler = async (
//   req: AuthenticatedRequest,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { id } = req.params;
//     const userId = req.user.id;

//     // Optional: validate that this consent actually belongs to the user
//     const consent = await revokeConsent(id); // You can enhance this to check ownership

//     logger.info(`Consent ${id} revoked by user ${userId}`);
//     res.status(200).json({ consent });
//   } catch (error) {
//     logger.error('Error revoking consent: ' + error);
//     res.status(500).json({ message: 'Failed to revoke consent' });
//   }
// };

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
