import express from 'express';
import { check } from 'express-validator'; // For validation
import { createEvent, getAllEvents, updateEvent, deleteEvent } from '../controllers/eventController';
import authMiddleware from '../middleware/authMiddleware'; // Middleware to check if the user is authenticated

const router = express.Router();

// POST /api/events - Create an event
router.post(
  '/events',
  authMiddleware, // Ensure the user is authenticated
  [
    check('title', 'Event title is required').not().isEmpty(),
    check('startTime', 'Start time is required').isISO8601(),
    check('endTime', 'End time is required').isISO8601(),
  ],
  createEvent
);

// GET /api/events - Get all events (both general and personal)
router.get('/events', authMiddleware, getAllEvents);

// PUT /api/events - Update an event
router.put(
  '/events',
  authMiddleware, // Ensure the user is authenticated
  [
    check('eventId', 'Event ID is required').not().isEmpty(),
    check('title', 'Event title is required').not().isEmpty(),
    check('startTime', 'Start time is required').isISO8601(),
    check('endTime', 'End time is required').isISO8601(),
  ],
  updateEvent
);

// DELETE /api/events/:eventId - Delete an event
router.delete('/events/:eventId', authMiddleware, deleteEvent);

export default router;
