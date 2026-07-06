import pool from '../config/db';
import { Habit, CreateHabitInput, UpdateHabitInput } from '../types/habit';

export async function createHabit(input: CreateHabitInput): Promise<Habit> {
  const { rows } = await pool.query(
    `INSERT INTO habits (name, description, category, frequency, custom_days, reminder_time, start_date)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [input.name, input.description ?? null, input.category, input.frequency, input.customDays ?? null, input.reminderTime, input.startDate]
  );
  return mapRow(rows[0]);
}

export async function getAllHabits(): Promise<Habit[]> {
  const { rows } = await pool.query('SELECT * FROM habits ORDER BY created_at DESC');
  return rows.map(mapRow);
}

export async function getHabitById(id: string): Promise<Habit | null> {
  const { rows } = await pool.query('SELECT * FROM habits WHERE id = $1', [id]);
  return rows.length ? mapRow(rows[0]) : null;
}

export async function updateHabit(id: string, input: UpdateHabitInput): Promise<Habit | null> {
  const existing = await getHabitById(id);
  if (!existing) return null;

  const { rows } = await pool.query(
    `UPDATE habits SET
      name = $1,
      description = $2,
      category = $3,
      frequency = $4,
      custom_days = $5,
      reminder_time = $6,
      start_date = $7,
      updated_at = NOW()
     WHERE id = $8
     RETURNING *`,
    [
      input.name ?? existing.name,
      input.description !== undefined ? input.description : existing.description,
      input.category ?? existing.category,
      input.frequency ?? existing.frequency,
      input.customDays !== undefined ? input.customDays : existing.customDays,
      input.reminderTime ?? existing.reminderTime,
      input.startDate ?? existing.startDate,
      id,
    ]
  );
  return mapRow(rows[0]);
}

export async function deleteHabit(id: string): Promise<boolean> {
  const { rowCount } = await pool.query('DELETE FROM habits WHERE id = $1', [id]);
  return (rowCount ?? 0) > 0;
}

function mapRow(row: any): Habit {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.category,
    frequency: row.frequency,
    customDays: row.custom_days,
    reminderTime: row.reminder_time,
    startDate: row.start_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
