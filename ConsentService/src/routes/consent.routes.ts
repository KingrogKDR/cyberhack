import { Router } from 'express';
import {
  createConsentHandler,
  getUserConsentsHandler,
  checkConsentHandler,
} from '../controllers/consent.controller';

import { validateRequest } from '../middleware/validateRequest';
import { authenticateToken } from '../middleware/auth.middleware';
import { createConsentSchema } from '../utils/validator';
import { handleBankRevokeStatusHandler, requestRevokeConsentHandler } from '../controllers/revokeConsent.controller';

const router = Router();

// 🔐 Protected: Only authenticated users can create or revoke consents
router.post(
  '/consent',
  authenticateToken,
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
router.get('/consent',authenticateToken,getUserConsentsHandler);


// 🔐 User initiates revoke request (authenticated)
router.post(
  '/revoke-request/:consentId',
  authenticateToken,
  requestRevokeConsentHandler
);

// 🏦 Bank updates status (no auth here — secure via API key or signature if needed)
router.post('/bank/revoke-status', handleBankRevokeStatusHandler);


export default router;
