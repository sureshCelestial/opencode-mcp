import { Habit } from '../types/habit';

export interface StreakStats {
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  completionPercentage: number;
}

function isScheduled(date: Date, habit: Habit): boolean {
  const day = date.getDay(); // 0=Sun, 6=Sat
  switch (habit.frequency) {
    case 'daily':
      return true;
    case 'weekdays':
      return day >= 1 && day <= 5;
    case 'weekends':
      return day === 0 || day === 6;
    case 'custom':
      return habit.customDays ? habit.customDays.includes(day) : false;
    case 'weekly': {
      const start = parseLocalDate(habit.startDate);
      const startDay = start.getDay();
      return day === startDay;
    }
    default:
      return false;
  }
}

function parseLocalDate(str: string): Date {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatLocalDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function countScheduledDays(habit: Habit): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = parseLocalDate(habit.startDate);
  start.setHours(0, 0, 0, 0);
  let count = 0;
  const d = new Date(start);
  while (d <= today) {
    if (isScheduled(d, habit)) count++;
    d.setDate(d.getDate() + 1);
  }
  return count;
}

export function calculateStreaks(habit: Habit, completionDates: string[]): StreakStats {
  const completionsSet = new Set(completionDates);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = parseLocalDate(habit.startDate);
  start.setHours(0, 0, 0, 0);

  const scheduledDays: string[] = [];
  const d = new Date(start);
  while (d <= today) {
    if (isScheduled(d, habit)) {
      scheduledDays.push(formatLocalDate(d));
    }
    d.setDate(d.getDate() + 1);
  }

  const totalCompletions = completionDates.length;
  const completionPercentage = scheduledDays.length > 0 ? Math.round((totalCompletions / scheduledDays.length) * 100) : 0;

  // Current streak: walk backwards from today
  let currentStreak = 0;
  const rev = [...scheduledDays].reverse();
  for (const dayStr of rev) {
    if (completionsSet.has(dayStr)) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Longest streak
  let longestStreak = 0;
  let running = 0;
  for (const dayStr of scheduledDays) {
    if (completionsSet.has(dayStr)) {
      running++;
      if (running > longestStreak) longestStreak = running;
    } else {
      running = 0;
    }
  }

  return { currentStreak, longestStreak, totalCompletions, completionPercentage };
}
