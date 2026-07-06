import * as repository from '../repositories/habitRepository';
import { CreateHabitInput, UpdateHabitInput, Habit } from '../types/habit';

export async function createHabit(input: CreateHabitInput): Promise<Habit> {
  return repository.createHabit(input);
}

export interface ListHabitsQuery {
  search?: string;
  category?: string;
  frequency?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export async function listHabits(query: ListHabitsQuery = {}): Promise<{ habits: Habit[]; total: number }> {
  let habits = await repository.getAllHabits();

  if (query.search) {
    const term = query.search.toLowerCase();
    habits = habits.filter((h) => h.name.toLowerCase().includes(term));
  }
  if (query.category) {
    habits = habits.filter((h) => h.category === query.category);
  }
  if (query.frequency) {
    habits = habits.filter((h) => h.frequency === query.frequency);
  }

  const sortBy = query.sortBy || 'createdAt';
  const order = query.order === 'asc' ? 1 : -1;
  habits.sort((a, b) => {
    let av: any = (a as any)[sortBy];
    let bv: any = (b as any)[sortBy];
    if (typeof av === 'string') av = av.toLowerCase();
    if (typeof bv === 'string') bv = bv.toLowerCase();
    if (av < bv) return -1 * order;
    if (av > bv) return 1 * order;
    return 0;
  });

  const total = habits.length;
  const page = Math.max(1, query.page || 1);
  const limit = Math.max(1, Math.min(100, query.limit || 25));
  const start = (page - 1) * limit;
  habits = habits.slice(start, start + limit);

  return { habits, total };
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
