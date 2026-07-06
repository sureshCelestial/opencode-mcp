import * as habitRepo from '../repositories/habitRepository';
import * as completionRepo from '../repositories/completionRepository';
import { calculateStreaks, countScheduledDays } from './streakService';

export interface DashboardMetrics {
  totalHabits: number;
  activeHabits: number;
  completedToday: number;
  pendingHabits: number;
  overallCompletionRate: number;
  currentHighestStreak: number;
  longestLifetimeStreak: number;
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const habits = await habitRepo.getAllHabits();
  const today = new Date().toISOString().split('T')[0];

  let totalScheduledDays = 0;
  let totalCompletions = 0;
  let completedToday = 0;
  let currentHighestStreak = 0;
  let longestLifetimeStreak = 0;

  for (const habit of habits) {
    const completions = await completionRepo.getCompletionsByHabitId(habit.id);
    const dates = completions.map((c) => c.completionDate);
    const stats = calculateStreaks(habit, dates);

    totalCompletions += stats.totalCompletions;
    totalScheduledDays += countScheduledDays(habit);

    if (dates.includes(today)) completedToday++;
    if (stats.currentStreak > currentHighestStreak) currentHighestStreak = stats.currentStreak;
    if (stats.longestStreak > longestLifetimeStreak) longestLifetimeStreak = stats.longestStreak;
  }

  const totalHabits = habits.length;
  const activeHabits = habits.filter((h) => new Date(h.startDate) <= new Date()).length;
  const pendingHabits = activeHabits - completedToday;
  const overallCompletionRate = totalScheduledDays > 0 ? Math.round((totalCompletions / totalScheduledDays) * 100) : 0;

  return {
    totalHabits,
    activeHabits,
    completedToday,
    pendingHabits,
    overallCompletionRate,
    currentHighestStreak,
    longestLifetimeStreak,
  };
}
