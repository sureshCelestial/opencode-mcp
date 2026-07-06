import { calculateStreaks } from '../../src/services/streakService';
import { Habit } from '../../src/types/habit';

function makeHabit(overrides: Partial<Habit> = {}): Habit {
  return {
    id: '1',
    name: 'Test',
    description: null,
    category: 'Health',
    frequency: 'daily',
    customDays: null,
    reminderTime: '08:00',
    startDate: '2026-01-01',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    ...overrides,
  };
}

describe('calculateStreaks', () => {
  it('returns zero for new habit with no completions', () => {
    const habit = makeHabit({ startDate: '2026-07-01' });
    const stats = calculateStreaks(habit, []);
    expect(stats.currentStreak).toBe(0);
    expect(stats.longestStreak).toBe(0);
    expect(stats.totalCompletions).toBe(0);
    expect(stats.completionPercentage).toBe(0);
  });

  it('calculates daily current streak', () => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const habit = makeHabit({ startDate: yesterday, frequency: 'daily' });
    const stats = calculateStreaks(habit, [yesterday, today]);
    expect(stats.currentStreak).toBe(2);
    expect(stats.longestStreak).toBe(2);
    expect(stats.totalCompletions).toBe(2);
  });

  it('resets current streak on missing day', () => {
    const today = new Date().toISOString().split('T')[0];
    const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0];
    const habit = makeHabit({ startDate: twoDaysAgo, frequency: 'daily' });
    const stats = calculateStreaks(habit, [twoDaysAgo]);
    expect(stats.currentStreak).toBe(0);
    expect(stats.longestStreak).toBe(1);
  });

  it('handles weekdays frequency', () => {
    const habit = makeHabit({ startDate: '2026-07-01', frequency: 'weekdays' });
    const stats = calculateStreaks(habit, ['2026-07-02', '2026-07-03']);
    expect(stats.totalCompletions).toBe(2);
    expect(stats.longestStreak).toBe(2);
  });

  it('handles custom days frequency', () => {
    const habit = makeHabit({ startDate: '2026-06-25', frequency: 'custom', customDays: [1, 3] }); // Mon, Wed
    const stats = calculateStreaks(habit, ['2026-06-29', '2026-07-01']); // past Mon and Wed
    expect(stats.totalCompletions).toBe(2);
    expect(stats.longestStreak).toBe(2);
  });

  it('handles weekends frequency', () => {
    const habit = makeHabit({ startDate: '2026-07-05', frequency: 'weekends' }); // Sat
    const stats = calculateStreaks(habit, ['2026-07-05', '2026-07-06']);
    expect(stats.totalCompletions).toBe(2);
  });

  it('preserves longest streak when current streak is lower', () => {
    const dates = [
      '2026-07-01',
      '2026-07-02',
      '2026-07-03',
    ];
    const habit = makeHabit({ startDate: '2026-07-01', frequency: 'daily' });
    const stats = calculateStreaks(habit, dates);
    expect(stats.longestStreak).toBe(3);
    expect(stats.currentStreak).toBe(0); // unless today is 2026-07-03 or later, which it isn't in this test data
  });
});
