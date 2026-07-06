import * as repository from '../repositories/habitRepository';
import { CreateHabitInput, UpdateHabitInput, Habit } from '../types/habit';

export async function createHabit(input: CreateHabitInput): Promise<Habit> {
  return repository.createHabit(input);
}

export async function listHabits(): Promise<Habit[]> {
  return repository.getAllHabits();
}

export async function getHabit(id: string): Promise<Habit | null> {
  return repository.getHabitById(id);
}

export async function updateHabit(id: string, input: UpdateHabitInput): Promise<Habit | null> {
  return repository.updateHabit(id, input);
}

export async function removeHabit(id: string): Promise<boolean> {
  return repository.deleteHabit(id);
}
