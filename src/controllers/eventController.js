import Event from '../models/Event.js';
import User from '../models/User.js';
import { validationResult } from 'express-validator';

// Create a new event
export const createEvent = async (req, res) => {
  const { title, description, startTime, endTime, location, isGeneral, reminderTimes, creatorId } = req.body

  // Validate the input data
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const eventData = {
      title,
      description,
      startTime,
      endTime,
      location,
      isGeneral,
      reminderTimes: reminderTimes || [30], // Default to 30 minutes if not provided
      creatorId
    }

    const newEvent = new Event(eventData)
    await newEvent.save()

    // If it's a personal event, add it to the user's events
    if (!isGeneral) {
      const user = await User.findById(creatorId)
      user.events.push(newEvent._id)
      await user.save()
    }

    return res.status(201).json({
      msg: "Event created successfully",
      event: newEvent,
    })
  } catch (err) {
    console.error(err.message)
    return res.status(500).json({ msg: "Server error", error: err.message })
  }
}

export const getUserEvents = async (req, res) => {
  try {
    // Fetch all events created by the user
    const events = await Event.find({ creatorId: req.user.id })

    // Check if user has any events
    if (!events || events.length === 0) {
      return res.status(404).json({ msg: "No events found for this user" })
    }

    return res.status(200).json(events)
  } catch (err) {
    console.error(err.message)
    return res.status(500).json({ msg: "Server error" })
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)

    // Check if event exists
    if (!event) {
      return res.status(404).json({ msg: "Event not found" })
    }

    // Check if user has access to this event
    if (!event.isGeneral && event.creatorId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "You do not have permission to view this event" })
    }

    return res.status(200).json(event)
  } catch (err) {
    console.error(err.message)
    return res.status(500).json({ msg: "Server error" })
  }
}

// Fetch all events (including general and personal events)
export const getAllEvents = async (req, res) => {
  const { creatorId } = req.params;

  try {
    // Fetch all general events (visible to all users)
    const generalEvents = await Event.find({ isGeneral: true });

    // Fetch personal events for the specified user
    const userEvents = await Event.find({ creatorId, isGeneral: false });

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
