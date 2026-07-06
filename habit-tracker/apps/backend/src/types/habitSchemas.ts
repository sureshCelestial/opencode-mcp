import { z } from 'zod';

export const createHabitSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional().nullable(),
  category: z.string().min(1).max(50),
  frequency: z.enum(['daily', 'weekdays', 'weekends', 'weekly', 'custom']),
  customDays: z.array(z.number().min(0).max(6)).optional().nullable(),
  reminderTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format, expected HH:MM'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format, expected YYYY-MM-DD'),
});

export const updateHabitSchema = createHabitSchema.partial();
