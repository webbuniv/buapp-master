import Event from '../models/Event';
import User from '../models/User';
import { validationResult } from 'express-validator';

// Create an event (Admin can create general events, Users create personal events)
export const createEvent = async (req, res) => {
  const { title, description, startTime, endTime, isGeneral, reminderTimes } = req.body;

  // Validate the input data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const eventData = {
      title,
      description,
      startTime,
      endTime,
      isGeneral,
      reminderTimes,
      creatorId: req.user.id, // User ID from JWT (assumed that you have JWT-based authentication)
    };

    // Create a new event
    const newEvent = new Event(eventData);

    // Save the event to the database
    await newEvent.save();

    // Add the event to the user's personal events (if personal)
    if (!isGeneral) {
      const user = await User.findById(req.user.id);
      user.events.push(newEvent._id);
      await user.save();
    }

    return res.status(201).json({ msg: 'Event created successfully', event: newEvent });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};

// Fetch all events (including general and personal events)
export const getAllEvents = async (req, res) => {
  try {
    // Fetch all general events (visible to all users)
    const generalEvents = await Event.find({ isGeneral: true });

    // Fetch personal events for the logged-in user
    const userEvents = await Event.find({ creatorId: req.user.id, isGeneral: false });

    return res.status(200).json({ generalEvents, userEvents });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};

// Update an event (personal or general)
export const updateEvent = async (req, res) => {
  const { eventId, title, description, startTime, endTime, isGeneral, reminderTimes } = req.body;

  try {
    const event = await Event.findById(eventId);

    // Check if event exists
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    // Check if the user is trying to update a personal event or a general event
    if (event.isGeneral === false && event.creatorId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'You are not authorized to edit this event' });
    }

    // Update event details
    event.title = title || event.title;
    event.description = description || event.description;
    event.startTime = startTime || event.startTime;
    event.endTime = endTime || event.endTime;
    event.reminderTimes = reminderTimes || event.reminderTimes;

    await event.save();
    return res.status(200).json({ msg: 'Event updated successfully', event });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};

// Delete an event (only personal events for users, both for admins)
export const deleteEvent = async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await Event.findById(eventId);

    // Check if event exists
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    // Check if it's a personal event and if the user is authorized
    if (event.isGeneral === false && event.creatorId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'You are not authorized to delete this event' });
    }

    // Delete the event from the user's personal events list (if personal)
    if (!event.isGeneral) {
      const user = await User.findById(req.user.id);
      user.events = user.events.filter((e) => e.toString() !== eventId);
      await user.save();
    }

    // Delete the event from the database
    await event.remove();

    return res.status(200).json({ msg: 'Event deleted successfully' });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};
