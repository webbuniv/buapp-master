import express from 'express';
import {
  createTimetable,
  getAllTimetables,
  getTimetable,
  updateTimetable,
  deleteTimetable,
} from '../controllers/timetableController.js';

const router = express.Router();

// Timetable routes
router.post('/', createTimetable);            // Create a new timetable
router.get('/', getAllTimetables);           // Get all timetables
router.get('/:id', getTimetable);            // Get a single timetable by ID
router.put('/:id', updateTimetable);         // Update a timetable by ID
router.delete('/:id', deleteTimetable);      // Delete a timetable by ID

export default router;
