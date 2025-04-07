import Attendance from '../models/Attendance.js';
import Timetable from '../models/Timetable.js';

// Mark attendance for a student
export const markAttendance = async (req, res) => {
  try {
    const { timetableId, studentId, status, remarks } = req.body;

    const attendance = new Attendance({
      timetable: timetableId,
      student: studentId,
      status,
      remarks,
    });

    await attendance.save();
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Error marking attendance', error });
  }
};

// Get attendance for a student in a specific timetable
export const getAttendanceByTimetable = async (req, res) => {
  try {
    const { timetableId, studentId } = req.params;

    const attendanceRecords = await Attendance.find({
      timetable: timetableId,
      student: studentId,
    });

    if (!attendanceRecords) {
      return res.status(404).json({ message: 'No attendance records found' });
    }

    res.status(200).json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance records', error });
  }
};

// Get attendance for a specific course
export const getCourseAttendance = async (req, res) => {
  try {
    const { courseId } = req.params;

    const timetables = await Timetable.find({ course: courseId }).populate('students');
    const attendanceRecords = await Attendance.find({ timetable: { $in: timetables.map(t => t._id) } });

    res.status(200).json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course attendance', error });
  }
};

// Update attendance status (for example, if the lecturer wants to adjust it)
export const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    const updatedAttendance = await Attendance.findByIdAndUpdate(
      id,
      { status, remarks },
      { new: true }
    );

    if (!updatedAttendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    res.status(200).json(updatedAttendance);
  } catch (error) {
    res.status(500).json({ message: 'Error updating attendance record', error });
  }
};
