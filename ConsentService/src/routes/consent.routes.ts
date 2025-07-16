import { Router } from 'express';
import {
  createConsentHandler,
  getUserConsentsHandler,
  checkConsentHandler,
  getUserConsentsHandlerForBank,
} from '../controllers/consent.controller';

import { validateRequest } from '../middleware/validateRequest';
import { authenticateToken, requireBankRole } from '../middleware/auth.middleware';
import { createConsentSchema } from '../utils/validator';
import { getAllPendingRevokeRequestsHandler, getPendingRevokeRequestsForUserHandler, handleBankRevokeStatusHandler, requestRevokeConsentHandler } from '../controllers/revokeConsent.controller';

const router = Router();

router.post(
  '/consent',
  // authenticateToken,
  // requireBankRole,
  validateRequest(createConsentSchema),
  createConsentHandler
);

// router.delete(
//   '/consent/:id',
//   authenticateToken,
//   revokeConsentHandler
// );

// ✅ Public: Policy engine or 3rd-party services may call these
router.get('/consent/check', checkConsentHandler);

// get consent for user dashboard
router.get('/consent/user',authenticateToken,getUserConsentsHandler);
// get consent for bank dashboard
router.get('/consent/bank/:id',authenticateToken,requireBankRole,getUserConsentsHandlerForBank);


// 🔐 User initiates revoke request (authenticated)
router.post(
  '/revoke-request/:consentId',
  authenticateToken,
  requestRevokeConsentHandler
);

// 🏦 Bank updates status 
router.post('/bank/revoke-status',authenticateToken,requireBankRole,handleBankRevokeStatusHandler);


router.get("/revoke-requests/pending/:userId", authenticateToken,requireBankRole, getPendingRevokeRequestsForUserHandler);
router.get("/revoke-requests/pending", authenticateToken,requireBankRole, getAllPendingRevokeRequestsHandler);

export default router;
