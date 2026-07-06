import * as repo from '../repositories/completionRepository';
import * as habitRepo from '../repositories/habitRepository';

export async function markComplete(habitId: string, completionDate: string) {
  const habit = await habitRepo.getHabitById(habitId);
  if (!habit) {
    const error = new Error('Habit not found');
    (error as any).statusCode = 404;
    throw error;
  }

  const exists = await repo.completionExists(habitId, completionDate);
  if (exists) {
    const error = new Error('Habit already completed for this date');
    (error as any).statusCode = 409;
    throw error;
  }

  return repo.insertCompletion(habitId, completionDate);
}
