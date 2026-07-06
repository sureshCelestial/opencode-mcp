import { Request, Response, NextFunction } from 'express';
import * as service from '../services/habitService';

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const habit = await service.createHabit(req.body);
    res.status(201).json(habit);
  } catch (err) {
    next(err);
  }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const { habits, total } = await service.listHabits({
      search: req.query.search as string,
      category: req.query.category as string,
      frequency: req.query.frequency as string,
      sortBy: req.query.sortBy as string,
      order: (req.query.order as 'asc' | 'desc') || 'desc',
      page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
    });
    res.json({ data: habits, total, page: req.query.page ? parseInt(req.query.page as string, 10) : 1 });
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const habit = await service.getHabit(req.params.id);
    if (!habit) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Habit not found' } });
    res.json(habit);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const habit = await service.updateHabit(req.params.id, req.body);
    if (!habit) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Habit not found' } });
    res.json(habit);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const deleted = await service.removeHabit(req.params.id);
    if (!deleted) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Habit not found' } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
