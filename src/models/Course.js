import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  }, // Course name
  code: { 
    type: String, 
    required: true, 
    unique: true 
  }, // Unique course code
  description: { 
    type: String 
  }, // Optional course description
  department: { 
    type: String, 
    required: true 
  }, // Department offering the course
  // lecturer: { 
  //   type: mongoose.Schema.Types.ObjectId, 
  //   ref: 'User', 
  // }, // Lecturer assigned to the course
  semester: { 
    type: String,
    enum: ['1st', '2nd', '3rd', '4th', '5th', '6th'],
  }, // Semester in which the course is offered
  students: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }], // Students enrolled in the course
  isActive: { 
    type: Boolean, 
    default: true 
  }, // Whether the course is active or not
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);
export default Course;
