import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'joi';
import { logger } from '../config';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(`Error occurred: ${err.message}`);

  if (err instanceof ValidationError) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation Error',
      details: err.details,
    });
  }

  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
};
