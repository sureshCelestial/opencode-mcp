import request from 'supertest';
import app from '../../src/app';
import pool from '../../src/config/db';

jest.mock('../../src/config/db', () => ({
  __esModule: true,
  default: {
    query: jest.fn(),
  },
}));

describe('Habit Completion API', () => {
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

  it('POST /api/v1/habits/:id/complete marks habit complete', async () => {
    (pool.query as jest.Mock)
      .mockResolvedValueOnce({ rows: [mockHabitRow] }) // get habit
      .mockResolvedValueOnce({ rows: [] }) // check duplicate
      .mockResolvedValueOnce({ rows: [{ id: 'comp-1', habitId: 'uuid-1', completionDate: '2026-07-06', createdAt: '2026-07-06T00:00:00Z' }] }); // insert

    const res = await request(app).post('/api/v1/habits/uuid-1/complete');
    expect(res.status).toBe(201);
    expect(res.body.habitId).toBe('uuid-1');
  });

  it('returns 409 if already completed today', async () => {
    (pool.query as jest.Mock)
      .mockResolvedValueOnce({ rows: [mockHabitRow] })
      .mockResolvedValueOnce({ rows: [{ 1: 1 }] });

    const res = await request(app).post('/api/v1/habits/uuid-1/complete');
    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('DUPLICATE_COMPLETION');
  });

  it('returns 404 if habit not found', async () => {
    (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

    const res = await request(app).post('/api/v1/habits/uuid-missing/complete');
    expect(res.status).toBe(404);
  });
});
