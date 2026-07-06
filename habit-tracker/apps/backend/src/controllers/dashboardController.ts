import { Request, Response, NextFunction } from 'express';
import * as service from '../services/dashboardService';

export async function getDashboard(_req: Request, res: Response, next: NextFunction) {
  try {
    const metrics = await service.getDashboardMetrics();
    res.json(metrics);
  } catch (err) {
    next(err);
  }
}
