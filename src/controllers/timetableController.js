import Timetable from '../models/Timetable.js';
import Event from '../models/Event.js';

// Create a new timetable
export const createTimetable = async (req, res) => {
  try {
    const { course, lecturer, classType, startTime, endTime, location, classRepresentatives, repeatsWeekly, endDate, students } = req.body;
    
    const timetable = new Timetable({
      course,
      lecturer,
      classType,
      startTime,
      endTime,
      location,
      classRepresentatives,
      repeatsWeekly,
      endDate,
      students,
    });

    await timetable.save();
    res.status(201).json(timetable);
  } catch (error) {
    res.status(500).json({ message: 'Error creating timetable', error });
  }
};

// Get all timetables
export const getAllTimetables = async (req, res) => {
  try {
    const timetables = await Timetable.find().populate('course lecturer students');
    res.status(200).json(timetables);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching timetables', error });
  }
};

// Get a single timetable by ID
export const getTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id).populate('course lecturer students');
    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }
    res.status(200).json(timetable);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching timetable', error });
  }
};

// Update a timetable
export const updateTimetable = async (req, res) => {
  try {
    const updatedTimetable = await Timetable.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTimetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }
    res.status(200).json(updatedTimetable);
  } catch (error) {
    res.status(500).json({ message: 'Error updating timetable', error });
  }
};

// Delete a timetable
export const deleteTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.findByIdAndDelete(req.params.id);
    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }
    res.status(200).json({ message: 'Timetable deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting timetable', error });
  }
};
