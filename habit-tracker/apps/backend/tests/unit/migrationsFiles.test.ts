import fs from 'fs';
import path from 'path';

describe('Migration SQL files', () => {
  const migrationsDir = path.join(__dirname, '../../migrations');

  it('should contain migration files', () => {
    const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql'));
    expect(files.length).toBeGreaterThanOrEqual(3);
  });

  it('001_create_habits.sql should create habits table', () => {
    const sql = fs.readFileSync(path.join(migrationsDir, '001_create_habits.sql'), 'utf-8');
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS habits');
    expect(sql).toContain('id UUID PRIMARY KEY');
    expect(sql).toContain('name VARCHAR(100) NOT NULL');
  });

  it('002_create_habit_completions.sql should create completions table', () => {
    const sql = fs.readFileSync(path.join(migrationsDir, '002_create_habit_completions.sql'), 'utf-8');
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS habit_completions');
    expect(sql).toContain('UNIQUE(habit_id, completion_date)');
  });

  it('003_add_indexes.sql should create indexes', () => {
    const sql = fs.readFileSync(path.join(migrationsDir, '003_add_indexes.sql'), 'utf-8');
    expect(sql).toContain('CREATE INDEX IF NOT EXISTS idx_habits_category');
    expect(sql).toContain('CREATE INDEX IF NOT EXISTS idx_completions_habit_date');
  });
});
