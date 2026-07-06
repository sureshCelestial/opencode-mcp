import fs from 'fs';
import path from 'path';
import pool from '../config/db';
import logger from '../middleware/logger';

const migrationsDir = path.join(__dirname, '../../migrations');

export async function runMigrations() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        filename VARCHAR(255) PRIMARY KEY,
        executed_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    const files = fs.readdirSync(migrationsDir).sort();
    for (const file of files) {
      if (!file.endsWith('.sql')) continue;
      const { rows } = await client.query('SELECT 1 FROM migrations WHERE filename = $1', [file]);
      if (rows.length > 0) {
        logger.info(`Skipping already executed migration: ${file}`);
        continue;
      }
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
      await client.query(sql);
      await client.query('INSERT INTO migrations (filename) VALUES ($1)', [file]);
      logger.info(`Executed migration: ${file}`);
    }
  } finally {
    client.release();
  }
}

if (require.main === module) {
  runMigrations()
    .then(() => {
      logger.info('Migrations complete');
      process.exit(0);
    })
    .catch((err) => {
      logger.error('Migration failed', err);
      process.exit(1);
    });
}
