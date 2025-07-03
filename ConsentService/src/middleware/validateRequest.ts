// src/middlewares/validateRequest.ts

import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validateRequest = (schema: AnyZodObject) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          message: 'Validation Error',
          errors: error.errors,
        });
        return; 
      }

      res.status(500).json({ message: 'Internal Server Error' });
      return; 
    }
  };
};
