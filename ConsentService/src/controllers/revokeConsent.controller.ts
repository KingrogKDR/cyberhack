import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { revokeConsent } from "../services/consent.service";
import {
  createRevokeRequest,
  getRevokeRequestWithConsent,
  updateRevokeRequestStatus,
} from "../services/revokeConsent.service";
// @ts-ignore
import logger from "../utils/logger.js";

// POST /revoke-request/:consentId
export const requestRevokeConsentHandler = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { consentId } = req.params;
    const userId = req.user?.id!;

    const revokeRequest = await createRevokeRequest(userId, consentId);

    // Simulate sending the revoke request to bank
    logger.info(
      `Revoke request ${revokeRequest.id} created for consent ${consentId}`
    );

    res.status(202).json({
      message: "Revoke request created and sent to bank for approval",
      revokeRequest,
    });
  } catch (error) {
    logger.error("Error creating revoke request: " + error);
    res.status(500).json({ message: "Failed to create revoke request" });
  }
};

// POST /bank/revoke-status
export const handleBankRevokeStatusHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { revokeRequestId, status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      res.status(400).json({ message: "Invalid status value" });
      return;
    }

    const request = await getRevokeRequestWithConsent(revokeRequestId);
    if (!request) {
      res.status(404).json({ message: "Revoke request not found" });
      return;
    }

    if (request.status !== "pending") {
      res.status(409).json({ message: "Revoke request already processed" });
      return;
    }

    await updateRevokeRequestStatus(revokeRequestId, status);

    if (status === "approved") {
      await revokeConsent(request.consentId);
      logger.info(`Consent ${request.consentId} revoked via bank approval`);
    }

    res.status(200).json({ message: `Revoke request ${status}` });
  } catch (error) {
    logger.error("Error updating revoke request status: " + error);
    res.status(500).json({ message: "Failed to update revoke request status" });
  }
};
