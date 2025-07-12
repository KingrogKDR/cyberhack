import express from 'express';
import { getMyProfile, getAllUsers } from '../controllers/user.controller';
import { authenticateToken,requireBankRole } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/me', authenticateToken, getMyProfile);

router.get('/users', authenticateToken, requireBankRole, getAllUsers);

export default router;
