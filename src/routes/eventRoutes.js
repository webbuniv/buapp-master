// src/routes/eventRoutes.js
import express from 'express';
import {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
} from '../controllers/eventController.js';

const router = express.Router();

// Create Event
router.post('/create', createEvent);

// Get All Events
router.get('/', getEvents);

// Update Event
router.put('/:eventId', updateEvent);

// Delete Event
router.delete('/:eventId', deleteEvent);

export default router;
