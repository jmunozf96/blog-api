import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom.error';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new CustomError("Validation failed", 400, errors.array()));
  }
  next();
};