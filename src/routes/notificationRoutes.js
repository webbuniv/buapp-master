// src/routes/notificationRoutes.js
import express from 'express';
import { sendNotification, getNotifications, markAsRead } from '../controllers/notificationController.js';

const router = express.Router();

// Route to send notifications
router.post('/send', sendNotification);

// Route to get all notifications for a user
router.get('/:userId', getNotifications);

// Route to mark a notification as read
router.put('/read/:notificationId', markAsRead);

export default router;
