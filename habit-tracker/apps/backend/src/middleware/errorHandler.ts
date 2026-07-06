import { Request, Response, NextFunction } from 'express';
import logger from './logger';

const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(err.message, { stack: err.stack });
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Something went wrong. Please try again later.',
    },
  });
};

export default errorHandler;
