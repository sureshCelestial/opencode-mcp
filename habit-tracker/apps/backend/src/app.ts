import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import logger from './middleware/logger';
import errorHandler from './middleware/errorHandler';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
  });
  next();
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

import habitRoutes from './routes/habitRoutes';
app.use('/api/v1/habits', habitRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Resource not found' } });
});

app.use(errorHandler);

export default app;
