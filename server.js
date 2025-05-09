import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import { createServer } from "http"
import { Server } from "socket.io"
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import chatRoutes from './src/routes/chatRoutes.js';
import groupRoutes from './src/routes/groupRoutes.js';
import messageRoutes from './src/routes/messageRoutes.js';
import announcementRoutes from './src/routes/announcementRoutes.js';
import eventRoutes from './src/routes/eventRoutes.js';
import notificationRoutes from './src/routes/notificationRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import courseRoutes from './src/routes/courseRoutes.js';
import attendanceRoutes from './src/routes/attendanceRoutes.js';
import timetableRoutes from './src/routes/timetableRoutes.js';
import { setupSocketIO } from "./src/socket/socketManager.js"


// Load environment variables
dotenv.config();
connectDB();


const app = express();

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
})

// Setup Socket.IO
setupSocketIO(io)
// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(compression());

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Bugema University API is running with ES Modules...' });
});

app.use('/auth', authRoutes);
app.use('/chats', chatRoutes);
app.use('/groups', groupRoutes);
app.use('/announcements', announcementRoutes);
app.use('/events', eventRoutes);
app.use('/notifications', notificationRoutes);
app.use('/users', userRoutes);
app.use('/messages', messageRoutes);
app.use('/courses', courseRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/timetables', timetableRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
