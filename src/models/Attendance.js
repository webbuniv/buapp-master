import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  timetable: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Timetable', 
    required: true 
  }, // Reference to the Timetable model, to link the attendance with a specific class
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, // Reference to the User model (Student)
  status: { 
    type: String, 
    enum: ['present', 'absent', 'late', 'excused'], 
    default: 'absent' 
  }, // Status of attendance: present, absent, late, or excused
  remarks: { 
    type: String 
  }, // Optional remarks (e.g., reason for absence)
  createdAt: { 
    type: Date, 
    default: Date.now 
  }, // When the attendance record was created
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }, // When the attendance record was last updated
}, { timestamps: true });

export default mongoose.model('Attendance', attendanceSchema);
