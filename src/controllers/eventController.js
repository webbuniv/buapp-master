// src/controllers/eventController.js
import Event from '../models/Event.js';
import { sendPushNotification } from './notificationController.js';
import { sendEmail } from '../utils/emailUtils.js';
import { sendSMS } from '../utils/smsUtils.js';

// Create Event
export const createEvent = async (req, res) => {
  const { title, description, startDate, endDate, location, type, participants, reminders } = req.body;

  try {
    const event = new Event({ title, description, startDate, endDate, location, type, participants, reminders });
    await event.save();

    // Send reminders
    sendReminders(event);

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: 'Error creating event' });
  }
};

// Get All Events
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('participants');
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching events' });
  }
};

// Send Event Reminders
const sendReminders = (event) => {
  event.reminders.forEach(async (reminder) => {
    const reminderTime = new Date(reminder.reminderTime);

    // If reminder time is now, send the reminder
    if (reminderTime <= new Date()) {
      event.participants.forEach(async (userId) => {
        const user = await User.findById(userId); // Assuming User model exists

        switch (reminder.reminderType) {
          case 'email':
            sendEmail(user.email, 'Event Reminder', './templates/eventReminder.html', { title: event.title, time: event.startDate });
            break;
          case 'push':
            sendPushNotification(user.deviceToken, 'Event Reminder', `Your event ${event.title} is starting soon.`);
            break;
          case 'sms':
            sendSMS(user.phoneNumber, `Reminder: Your event ${event.title} is starting soon at ${event.startDate}`);
            break;
          default:
            break;
        }
      });
    }
  });
};

// Update Event
export const updateEvent = async (req, res) => {
  const { eventId } = req.params;
  const { title, description, startDate, endDate, location, type, participants, reminders } = req.body;

  try {
    const event = await Event.findByIdAndUpdate(
      eventId,
      { title, description, startDate, endDate, location, type, participants, reminders },
      { new: true }
    );

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: 'Error updating event' });
  }
};

// Delete Event
export const deleteEvent = async (req, res) => {
  const { eventId } = req.params;

  try {
    await Event.findByIdAndDelete(eventId);
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting event' });
  }
};
