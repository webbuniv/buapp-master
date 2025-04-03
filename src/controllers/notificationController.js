// src/controllers/notificationController.js
import Notification from '../models/Notification.js';
import { sendEmail } from '../utils/emailUtils.js';
import { sendSMS } from '../utils/smsUtils.js';
import { sendPushNotification } from '../utils/pushNotificationUtils.js';

// Send Notification (Email, SMS, Push)
export const sendNotification = async (req, res) => {
  const { userId, message, type, eventId, deviceToken } = req.body;

  try {
    // Create notification entry in the database
    const notification = new Notification({
      user: userId,
      message,
      type,
      event: eventId || null,  // If it's event-related
    });

    await notification.save();

    // Send notification based on type
    switch (type) {
      case 'email':
        const user = await User.findById(userId);
        await sendEmail(user.email, 'University Notification', './templates/notification.html', { message });
        break;
      case 'sms':
        const userSMS = await User.findById(userId);
        await sendSMS(userSMS.phoneNumber, message);
        break;
      case 'push':
        if (deviceToken) {
          await sendPushNotification(deviceToken, 'University Notification', message);
        } else {
          return res.status(400).json({ error: 'Device token required for push notifications' });
        }
        break;
      case 'system':
        // System notifications might be just stored, no action needed
        break;
      default:
        return res.status(400).json({ error: 'Invalid notification type' });
    }

    res.status(201).json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error sending notification' });
  }
};

// Get all notifications for a user
export const getNotifications = async (req, res) => {
  const { userId } = req.params;

  try {
    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching notifications' });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  const { notificationId } = req.params;

  try {
    const notification = await Notification.findById(notificationId);
    if (!notification) return res.status(404).json({ error: 'Notification not found' });

    notification.status = 'sent';  // Mark as read
    await notification.save();

    res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error marking notification as read' });
  }
};
