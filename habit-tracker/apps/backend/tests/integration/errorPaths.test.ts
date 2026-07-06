import request from 'supertest';
import app from '../../src/app';
import pool from '../../src/config/db';

jest.mock('../../src/config/db', () => ({
  __esModule: true,
  default: {
    query: jest.fn(),
  },
}));

describe('Controller error paths', () => {
  beforeEach(() => jest.clearAllMocks());

  it('GET /api/v1/habits/:id returns 500 on error', async () => {
    (pool.query as jest.Mock).mockRejectedValue(new Error('DB error'));
    const res = await request(app).get('/api/v1/habits/uuid-1');
    expect(res.status).toBe(500);
    expect(res.body.error.code).toBe('INTERNAL_ERROR');
  });

  it('PUT /api/v1/habits/:id returns 500 on error', async () => {
    (pool.query as jest.Mock).mockRejectedValue(new Error('DB error'));
    const res = await request(app)
      .put('/api/v1/habits/uuid-1')
      .send({ name: 'Updated' });
    expect(res.status).toBe(500);
  });

  it('DELETE /api/v1/habits/:id returns 500 on error', async () => {
    (pool.query as jest.Mock).mockRejectedValue(new Error('DB error'));
    const res = await request(app).delete('/api/v1/habits/uuid-1');
    expect(res.status).toBe(500);
  });

  it('POST /api/v1/habits/:id/complete returns 500 on error', async () => {
    (pool.query as jest.Mock).mockRejectedValue(new Error('DB error'));
    const res = await request(app).post('/api/v1/habits/uuid-1/complete');
    expect(res.status).toBe(500);
  });
});
