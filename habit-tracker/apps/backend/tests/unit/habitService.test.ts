import * as service from '../../src/services/habitService';
import * as repo from '../../src/repositories/habitRepository';

jest.mock('../../src/repositories/habitRepository');

describe('habitService', () => {
  it('delegates create to repository', async () => {
    const mockHabit = { id: '1', name: 'Read' } as any;
    (repo.createHabit as jest.Mock).mockResolvedValue(mockHabit);
    const result = await service.createHabit({ name: 'Read', category: 'Reading', frequency: 'daily', reminderTime: '20:00', startDate: '2026-01-01' });
    expect(result).toEqual(mockHabit);
  });

  it('delegates list to repository', async () => {
    (repo.getAllHabits as jest.Mock).mockResolvedValue([]);
    const result = await service.listHabits();
    expect(result).toEqual({ habits: [], total: 0 });
  });

  it('delegates get to repository', async () => {
    (repo.getHabitById as jest.Mock).mockResolvedValue(null);
    const result = await service.getHabit('1');
    expect(result).toBeNull();
  });
});
