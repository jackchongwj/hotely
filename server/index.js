import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

import { Server } from 'socket.io';

// Import routes
import authRoutes from './routes/auth.routes.js'
import clientRoutes from './routes/client.routes.js'
import chatRoutes from './routes/chat.routes.js'
import userRoutes from './routes/user.routes.js'

// Load environment variables
dotenv.config()

// Set up Express app
const app = express()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use(morgan('common'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

// Define CORS options
const corsOptions = {
  origin: 'http://localhost:3000', // or the client's origin in production
  credentials: true,
};

// Use CORS with the options
app.use(cors(corsOptions));

// Set up routes
app.use('/auth', authRoutes)
app.use('/api', clientRoutes)

// Example of logging middleware
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.path}`);
  next();
});

// Set up MongoDB database connection and start server
const PORT = process.env.PORT || 9000
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    const server = app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    const io = new Server(server, {
      pingTimeout: 60000,
      cors: {
        origin: "http://localhost:3000", 
      },
    });
    io.on('connection', (socket) => {
      console.log("connected to socket.io")
    })
  })
  .catch((error) => console.log(`${error} did not connect`))
