import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import config from './config';
import logger from './middleware/logger';

const server = app.listen(config.port, () => {
  logger.info(`Server listening on port ${config.port}`);
});

const gracefulShutdown = (signal: string) => {
  logger.info(`${signal} received. Shutting down gracefully.`);
  server.close(() => {
    logger.info('Server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
