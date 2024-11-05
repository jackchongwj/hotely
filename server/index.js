import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import Reservation from './models/Reservation.js';
import Room from './models/Room.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import clientRoutes from './routes/client.routes.js';

// Load environment variables
dotenv.config();

// Set up Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(morgan('common'));

// Define CORS options
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

// Use CORS with the options
app.use(cors(corsOptions));

// Set up routes
app.use('/auth', authRoutes);
app.use('/api', clientRoutes);

// Example of logging middleware
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.path}`);
  next();
});

// Set up MongoDB database connection and start server
const PORT = process.env.PORT || 9000;

// Connect to MongoDB and start the server
connectDB().then(() => {
  const server = app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  const io = new Server(server, {
    pingTimeout: 60000,
    cors: { origin: "http://localhost:3000" },
  });
  
  io.on('connection', (socket) => {
    console.log("Connected to socket.io");
  });
}).catch(error => {
  console.error('Failed to start the server:', error);
});