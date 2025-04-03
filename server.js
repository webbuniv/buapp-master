import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import chatRoutes from './src/routes/chatRoutes.js';
import groupRoutes from './src/routes/groupRoutes.js';
// import messageRoutes from './src/routes/messageRoutes.js';
import announcementRoutes from './src/routes/announcementRoutes.js';
// Load environment variables
dotenv.config();
connectDB();

const app = express();

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

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
