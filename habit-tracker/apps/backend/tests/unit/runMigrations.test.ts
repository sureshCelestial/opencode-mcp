import fs from 'fs';
import pool from '../../src/config/db';
import { runMigrations } from '../../src/utils/runMigrations';

jest.mock('fs');
jest.mock('../../src/config/db', () => ({
  __esModule: true,
  default: {
    connect: jest.fn(),
  },
}));

describe('runMigrations', () => {
  const mockClient = {
    query: jest.fn(),
    release: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (pool.connect as jest.Mock).mockResolvedValue(mockClient);
  });

  it('should create migrations table and run new migrations', async () => {
    (fs.readdirSync as jest.Mock).mockReturnValue(['001_create_habits.sql', '002_create_completions.sql']);
    (fs.readFileSync as jest.Mock).mockReturnValue('CREATE TABLE habits (...);');

    mockClient.query
      .mockResolvedValueOnce({ rows: [] }) // CREATE TABLE migrations
      .mockResolvedValueOnce({ rows: [] }) // SELECT 1 for 001
      .mockResolvedValueOnce({ rows: [] }) // execute 001
      .mockResolvedValueOnce({ rows: [] }) // insert 001
      .mockResolvedValueOnce({ rows: [] }) // SELECT 1 for 002
      .mockResolvedValueOnce({ rows: [] }) // execute 002
      .mockResolvedValueOnce({ rows: [] }); // insert 002

    await runMigrations();

    expect(pool.connect).toHaveBeenCalled();
    expect(mockClient.query).toHaveBeenCalledWith(expect.stringContaining('CREATE TABLE IF NOT EXISTS migrations'));
    expect(mockClient.query).toHaveBeenCalledWith('CREATE TABLE habits (...);');
    expect(mockClient.release).toHaveBeenCalled();
  });

  it('should skip already executed migrations', async () => {
    (fs.readdirSync as jest.Mock).mockReturnValue(['001_create_habits.sql']);

    mockClient.query
      .mockResolvedValueOnce({ rows: [] }) // CREATE TABLE migrations
      .mockResolvedValueOnce({ rows: [{ 1: 1 }] }); // SELECT 1 returns row

    await runMigrations();

    expect(mockClient.query).not.toHaveBeenCalledWith('CREATE TABLE habits (...);');
    expect(mockClient.release).toHaveBeenCalled();
  });
});
