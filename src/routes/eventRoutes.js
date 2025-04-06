import express from 'express';
import { check } from 'express-validator';
import {
  createEvent,
  getAllEvents,
  updateEvent,
  deleteEvent,
  getEventById,
} from '../controllers/eventController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/events - Create an event (requires authentication)
router.post(
  '/',
  [
    check('title', 'Event title is required').not().isEmpty(),
    check('startTime', 'Start time is required').isISO8601(),
    check('endTime', 'End time is required').isISO8601(),
  ],
  createEvent
);


// PUT /api/events - Update an event (requires authentication)
router.put(
  '/',
  protect,
  [
    check('eventId', 'Event ID is required').not().isEmpty(),
    check('title', 'Event title is required').not().isEmpty(),
    check('startTime', 'Start time is required').isISO8601(),
    check('endTime', 'End time is required').isISO8601(),
  ],
  updateEvent
);

router.get('/', getAllEvents);

// DELETE /api/events/:eventId - Delete an event (requires authentication)
router.delete('/:eventId', deleteEvent);
router.get('/:id', protect, getEventById );

export default router;
