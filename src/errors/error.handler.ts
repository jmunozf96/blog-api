import { Request, Response, NextFunction } from 'express';
import { CustomError } from './custom.error';

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);
  
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ message: err.message, details: err.details });
  }

  return res.status(500).json({ message: 'Internal Server Error' });
};
