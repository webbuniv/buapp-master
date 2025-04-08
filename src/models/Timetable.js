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

// // Post-save hook to create recurring events when a timetable is created
// timetableSchema.post('save', async function () {
//   try {
//     let currentDate = new Date(this.startTime);
//     let endDate = this.endDate || new Date();  // Default to today if no endDate is provided

//     // Loop to create recurring events until the end date
//     while (currentDate <= endDate) {
//       const event = new Event({
//         title: `${this.course.name} - ${this.classType === 'online' ? 'Online Class' : 'Class'}`,
//         description: `Lecture on ${this.course.name}`,
//         startTime: currentDate,
//         endTime: new Date(currentDate.getTime() + (this.endTime - this.startTime)),
//         location: this.classType === 'offline' ? this.location : 'Online',
//         creatorId: this.lecturer,
//         timetable: this._id,
//         reminderTimes: [15, 30], // Example reminders (15 min, 30 min before)
//         reminderFor: [
//           ...this.students,  // Send reminders to all students
//           this.lecturer,     // Send reminder to the lecturer
//         ],
//         type: 'class',  // Ensure this is a class event, not a general event
//       });

//       // Save the event for the current week
//       await event.save();

//       // Move to the next week
//       currentDate.setDate(currentDate.getDate() + 7); // Add 7 days for the next class
//     }
//   } catch (error) {
//     console.error('Error creating recurring events from timetable:', error);
//   }
// });

const Timetable = mongoose.model('Timetable', timetableSchema);
export default Timetable;
