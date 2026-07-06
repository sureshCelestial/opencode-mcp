import pool from '../config/db';

export async function insertCompletion(habitId: string, completionDate: string): Promise<{ id: string; habitId: string; completionDate: string; createdAt: string }> {
  const { rows } = await pool.query(
    `INSERT INTO habit_completions (habit_id, completion_date)
     VALUES ($1, $2)
     RETURNING id, habit_id AS "habitId", completion_date AS "completionDate", created_at AS "createdAt"`,
    [habitId, completionDate]
  );
  return rows[0];
}

export async function completionExists(habitId: string, completionDate: string): Promise<boolean> {
  const { rows } = await pool.query(
    'SELECT 1 FROM habit_completions WHERE habit_id = $1 AND completion_date = $2',
    [habitId, completionDate]
  );
  return rows.length > 0;
}

export async function getCompletionsByHabitId(habitId: string): Promise<{ id: string; habitId: string; completionDate: string; createdAt: string }[]> {
  const { rows } = await pool.query(
    'SELECT id, habit_id AS "habitId", completion_date AS "completionDate", created_at AS "createdAt" FROM habit_completions WHERE habit_id = $1 ORDER BY completion_date DESC',
    [habitId]
  );
  return rows;
}
