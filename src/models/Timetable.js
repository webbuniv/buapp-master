import mongoose from 'mongoose';
import Event from './Event.js';  // Import Event model

const timetableSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  lecturer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  classType: {
    type: String,
    enum: ['online', 'offline'],
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  classRepresentatives: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  repeatsWeekly: {
    type: Boolean,
    default: false, // Whether the class repeats weekly
  },
  endDate: {
    type: Date,  // The date when the repeating classes should end
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // Reference to student users
    },
  ],
}, { timestamps: true });

const Timetable = mongoose.model('Timetable', timetableSchema);
export default Timetable;
