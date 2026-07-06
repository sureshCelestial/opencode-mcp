import pool from '../../src/config/db';
import * as repo from '../../src/repositories/habitRepository';

jest.mock('../../src/config/db', () => ({
  __esModule: true,
  default: {
    query: jest.fn(),
  },
}));

describe('habitRepository', () => {
  const mockHabitRow = {
    id: 'uuid-1',
    name: 'Run',
    description: null,
    category: 'Fitness',
    frequency: 'daily',
    custom_days: null,
    reminder_time: '06:00',
    start_date: '2026-01-01',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  };

  beforeEach(() => jest.clearAllMocks());

  it('createHabit inserts and returns mapped row', async () => {
    (pool.query as jest.Mock).mockResolvedValue({ rows: [mockHabitRow] });
    const result = await repo.createHabit({
      name: 'Run',
      category: 'Fitness',
      frequency: 'daily',
      reminderTime: '06:00',
      startDate: '2026-01-01',
    });
    expect(result.id).toBe('uuid-1');
    expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO habits'), expect.any(Array));
  });

  it('getAllHabits returns list', async () => {
    (pool.query as jest.Mock).mockResolvedValue({ rows: [mockHabitRow] });
    const results = await repo.getAllHabits();
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('Run');
  });

  it('getHabitById returns null if not found', async () => {
    (pool.query as jest.Mock).mockResolvedValue({ rows: [] });
    const result = await repo.getHabitById('missing');
    expect(result).toBeNull();
  });

  it('updateHabit returns updated habit', async () => {
    (pool.query as jest.Mock)
      .mockResolvedValueOnce({ rows: [mockHabitRow] }) // get existing
      .mockResolvedValueOnce({ rows: [{ ...mockHabitRow, name: 'Updated' }] }); // update
    const result = await repo.updateHabit('uuid-1', { name: 'Updated' });
    expect(result).not.toBeNull();
    expect(result!.name).toBe('Updated');
  });

  it('updateHabit returns null if habit missing', async () => {
    (pool.query as jest.Mock).mockResolvedValue({ rows: [] });
    const result = await repo.updateHabit('missing', { name: 'X' });
    expect(result).toBeNull();
  });

  it('deleteHabit returns true if row deleted', async () => {
    (pool.query as jest.Mock).mockResolvedValue({ rowCount: 1 });
    const result = await repo.deleteHabit('uuid-1');
    expect(result).toBe(true);
  });
});
