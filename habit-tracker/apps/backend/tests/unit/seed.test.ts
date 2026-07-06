import pool from '../../src/config/db';
import { seed } from '../../src/utils/seed';

jest.mock('../../src/config/db', () => ({
  __esModule: true,
  default: {
    connect: jest.fn(),
  },
}));

describe('seed', () => {
  const mockClient = {
    query: jest.fn(),
    release: jest.fn(),
  };

  beforeEach(() => jest.clearAllMocks());

  it('should insert seed data and commit', async () => {
    (pool.connect as jest.Mock).mockResolvedValue(mockClient);
    mockClient.query.mockResolvedValue({ rows: [{ id: 'uuid-1' }] });

    await seed();

    expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
    expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
    expect(mockClient.release).toHaveBeenCalled();
  });

  it('should rollback on error', async () => {
    (pool.connect as jest.Mock).mockResolvedValue(mockClient);
    mockClient.query.mockRejectedValue(new Error('Insert failed'));

    await expect(seed()).rejects.toThrow('Insert failed');
    expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
    expect(mockClient.release).toHaveBeenCalled();
  });
});
