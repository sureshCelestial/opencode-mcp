import pool from '../config/db';
import logger from '../middleware/logger';

export async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const habitRes = await client.query(`
      INSERT INTO habits (name, category, frequency, reminder_time, start_date)
      VALUES 
        ('Morning Run', 'Fitness', 'daily', '06:00:00', '2026-01-01'),
        ('Read 30 Minutes', 'Reading', 'weekdays', '21:00:00', '2026-01-01'),
        ('Meditate', 'Meditation', 'custom', '07:00:00', '2026-01-01')
      RETURNING id
    `);

    const ids = habitRes.rows.map((r) => r.id);

    await client.query(`
      INSERT INTO habit_completions (habit_id, completion_date)
      VALUES ($1, CURRENT_DATE), ($2, CURRENT_DATE - INTERVAL '1 day')
    `, [ids[0], ids[0]]);

    await client.query('COMMIT');
    logger.info('Seed data inserted');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

if (require.main === module) {
  seed()
    .then(() => {
      logger.info('Seed complete');
      process.exit(0);
    })
    .catch((err) => {
      logger.error('Seed failed', err);
      process.exit(1);
    });
}
