import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import morgan from 'morgan'

// Import routes
import authRoutes from './routes/auth.js'
import clientRoutes from './routes/client.js'

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
app.use(cors())

// Set up routes
app.use('/auth', authRoutes)
app.use('/api', clientRoutes)

// Set up MongoDB database connection and start server
const PORT = process.env.PORT || 9000
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    const server = app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    const io = require('socket.io')(server, {
      pingTimeout: 60000,
      cors:{
        origin: "https//localhost:3000"
      }
    })
    io.on('connection', (socket) => {
      console.log("connected to socket.io")
    })
  })
  .catch((error) => console.log(`${error} did not connect`))
