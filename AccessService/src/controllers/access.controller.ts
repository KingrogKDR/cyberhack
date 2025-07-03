import { Request, Response } from 'express';
import { validateAccess } from '../services/service';

export const validateAccessHandler = async (req: Request, res: Response) => {
  const { userId, appId, field, purpose } = req.body;

  const result = await validateAccess(userId, appId, field, purpose);
  res.status(result.access ? 200 : 403).json(result);
};
