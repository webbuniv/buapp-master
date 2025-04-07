import express from 'express';
import {
  createCourse,
  getAllCourses,
  getCourse,
  updateCourse,
  deleteCourse,
} from '../controllers/courseController.js';

const router = express.Router();

// Course routes
router.post('/', createCourse);           // Create a new course
router.get('/', getAllCourses);          // Get all courses
router.get('/:id', getCourse);           // Get a single course by ID
router.put('/:id', updateCourse);        // Update a course by ID
router.delete('/:id', deleteCourse);     // Delete a course by ID

export default router;
