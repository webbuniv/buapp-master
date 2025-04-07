import Course from '../models/Course.js';
import User from '../models/User.js';

// Create a new course
export const createCourse = async (req, res) => {
  try {
    const { name, code, description, department, lecturer, students } = req.body;
    const course = new Course({
      name,
      code,
      description,
      department,
      lecturer,
      students,
    });
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error creating course', error });
  }
};

// Get all courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('lecturer students');
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error });
  }
};

// Get a single course
export const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('lecturer students');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course', error });
  }
};

// Update a course
export const updateCourse = async (req, res) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: 'Error updating course', error });
  }
};

// Delete a course
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json({ message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course', error });
  }
};
