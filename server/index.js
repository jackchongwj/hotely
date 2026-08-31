import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import cron from 'node-cron';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import { initSocket } from './socket.js';
import { setIO } from './services/socket.service.js';
import RefreshToken from './models/RefreshToken.js';

import authRoutes from './routes/auth.routes.js';
import clientRoutes from './routes/client.routes.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(morgan('common'));
app.use(mongoSanitize()); // strip $ and . from req.body/query/params to block NoSQL injection

const ALLOWED_ORIGINS = ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'];

app.use(cors({ origin: ALLOWED_ORIGINS, credentials: true }));

// Health check — no auth required, used by load balancers and uptime monitors
app.get('/health', (_req, res) => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.json({
    status: 'ok',
    uptime:  Math.floor(process.uptime()),
    db:      states[mongoose.connection.readyState] ?? 'unknown',
    timestamp: new Date().toISOString(),
  });
});

app.use('/auth', authRoutes);
app.use('/api', clientRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.path}`);
  next();
});

const PORT = process.env.PORT || 9000;

connectDB().then(() => {
  const server = app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

  const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
      origin: ALLOWED_ORIGINS,
      credentials: true,
    },
  });

  setIO(io);
  initSocket(io);

  // Graceful shutdown — drain in-flight requests, then close DB
  const shutdown = (signal) => {
    console.log(`[${signal}] Graceful shutdown…`);
    server.close(async () => {
      await mongoose.connection.close();
      console.log('DB connection closed. Exiting.');
      process.exit(0);
    });
    // Force exit if shutdown takes > 10s
    setTimeout(() => { console.error('Forced exit after timeout'); process.exit(1); }, 10000);
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));

  // Midnight session sweep — force all users to re-authenticate each day
  cron.schedule('0 0 * * *', async () => {
    try {
      const result = await RefreshToken.deleteMany({});
      console.log(`[cron] Midnight session sweep: ${result.deletedCount} session(s) cleared.`);
    } catch (err) {
      console.error('[cron] Session sweep failed:', err);
    }
  }, { timezone: process.env.TZ || 'Asia/Kuala_Lumpur' });

}).catch(error => {
  console.error('Failed to start the server:', error);
});
