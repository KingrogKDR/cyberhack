import { Router } from 'express';
import {
  createConsentHandler,
  getUserConsentsHandler,
  revokeConsentHandler,
  checkConsentHandler,
} from '../controllers/consent.controller';

import { validateRequest } from '../middleware/validateRequest';
import { authenticateToken } from '../middleware/auth.middleware';
import { createConsentSchema } from '../utils/validator';

const router = Router();

// 🔐 Protected: Only authenticated users can create or revoke consents
router.post(
  '/consent',
  authenticateToken,
  validateRequest(createConsentSchema),
  createConsentHandler
);

router.delete(
  '/consent/:id',
  authenticateToken,
  revokeConsentHandler
);

// ✅ Public: Policy engine or 3rd-party services may call these
router.get('/consent/check', checkConsentHandler);
router.get('/consent/:userId', getUserConsentsHandler);


export default router;
