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

export async function list(_req: Request, res: Response, next: NextFunction) {
  try {
    const habits = await service.listHabits();
    res.json(habits);
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
