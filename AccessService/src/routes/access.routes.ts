import express from 'express';
import { validateAccessHandler } from '../controllers/access.controller';

const router = express.Router();

router.post('/access/validate', validateAccessHandler);

export default router;
