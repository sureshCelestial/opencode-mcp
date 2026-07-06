export interface Habit {
  id: string;
  name: string;
  description: string | null;
  category: string;
  frequency: 'daily' | 'weekdays' | 'weekends' | 'weekly' | 'custom';
  customDays: number[] | null;
  reminderTime: string;
  startDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHabitInput {
  name: string;
  description?: string | null;
  category: string;
  frequency: Habit['frequency'];
  customDays?: number[] | null;
  reminderTime: string;
  startDate: string;
}

export interface UpdateHabitInput extends Partial<CreateHabitInput> {}
