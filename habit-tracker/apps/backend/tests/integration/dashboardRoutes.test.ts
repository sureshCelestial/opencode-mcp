import request from 'supertest';
import app from '../../src/app';
import pool from '../../src/config/db';

jest.mock('../../src/config/db', () => ({
  __esModule: true,
  default: {
    query: jest.fn(),
  },
}));

describe('Dashboard API', () => {
  beforeEach(() => jest.clearAllMocks());

  it('GET /api/v1/dashboard returns metrics', async () => {
    const today = new Date().toISOString().split('T')[0];
    (pool.query as jest.Mock)
      .mockResolvedValueOnce({
        rows: [
          {
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
          },
        ],
      }) // habits list
      .mockResolvedValueOnce({
        rows: [{ completionDate: today }],
      }); // completions for habit

    const res = await request(app).get('/api/v1/dashboard');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('totalHabits', 1);
    expect(res.body).toHaveProperty('completedToday', 1);
    expect(res.body).toHaveProperty('currentHighestStreak');
    expect(res.body).toHaveProperty('longestLifetimeStreak');
  });
});
