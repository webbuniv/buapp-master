import express from 'express';
import {
  markAttendance,
  getAttendanceByTimetable,
  getCourseAttendance,
  updateAttendance,
} from '../controllers/attendanceController.js';

const router = express.Router();

// Attendance routes
router.post('/', markAttendance);                           // Mark attendance for a student
router.get('/timetable/:timetableId/student/:studentId', getAttendanceByTimetable); // Get attendance for a student in a specific timetable
router.get('/course/:courseId', getCourseAttendance);      // Get attendance for a course
router.put('/:id', updateAttendance);                      // Update attendance status

export default router;
