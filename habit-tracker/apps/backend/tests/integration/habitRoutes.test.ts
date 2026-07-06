import request from 'supertest';
import app from '../../src/app';
import pool from '../../src/config/db';

jest.mock('../../src/config/db', () => ({
  __esModule: true,
  default: {
    query: jest.fn(),
  },
}));

describe('Habit CRUD API', () => {
  const mockRow = (overrides: any = {}) => ({
    id: 'uuid-1',
    name: 'Test',
    description: null,
    category: 'Health',
    frequency: 'daily',
    custom_days: null,
    reminder_time: '08:00',
    start_date: '2026-01-01',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    ...overrides,
  });

  beforeEach(() => jest.clearAllMocks());

  it('POST /api/v1/habits creates a habit', async () => {
    (pool.query as jest.Mock).mockResolvedValue({ rows: [mockRow()] });
    const res = await request(app)
      .post('/api/v1/habits')
      .send({ name: 'Test', category: 'Health', frequency: 'daily', reminderTime: '08:00', startDate: '2026-01-01' });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Test');
  });

  it('GET /api/v1/habits returns habits', async () => {
    (pool.query as jest.Mock).mockResolvedValue({ rows: [mockRow()] });
    const res = await request(app).get('/api/v1/habits');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/v1/habits/:id returns 404 if missing', async () => {
    (pool.query as jest.Mock).mockResolvedValue({ rows: [] });
    const res = await request(app).get('/api/v1/habits/uuid-missing');
    expect(res.status).toBe(404);
  });

  it('DELETE /api/v1/habits/:id returns 204 on success', async () => {
    (pool.query as jest.Mock).mockResolvedValue({ rowCount: 1 });
    const res = await request(app).delete('/api/v1/habits/uuid-1');
    expect(res.status).toBe(204);
  });

  it('returns 400 on invalid create payload', async () => {
    const res = await request(app).post('/api/v1/habits').send({ name: '' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});
