import { Request, Response, NextFunction } from 'express';
import * as service from '../services/completionService';

export async function complete(req: Request, res: Response, next: NextFunction) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const result = await service.markComplete(req.params.id, today);
    res.status(201).json(result);
  } catch (err: any) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ error: { code: err.statusCode === 409 ? 'DUPLICATE_COMPLETION' : 'NOT_FOUND', message: err.message } });
    }
    next(err);
  }
}
