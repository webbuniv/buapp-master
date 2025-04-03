// src/models/Event.js
import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Event title (e.g., exam, deadline, seminar)
    description: { type: String }, // Event description
    startDate: { type: Date, required: true }, // Start date
    endDate: { type: Date }, // End date (if applicable)
    location: { type: String }, // Event location (e.g., room number, building)
    type: { type: String, enum: ['exam', 'deadline', 'seminar', 'meeting'], required: true }, // Type of event
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users attending the event
    reminders: [
      {
        reminderTime: { type: Date, required: true }, // When to remind (e.g., 1 hour before event)
        reminderType: { type: String, enum: ['email', 'push', 'sms'], required: true }, // Type of reminder
      },
    ], // List of reminders
  },
  { timestamps: true }
);

const Event = mongoose.model('Event', eventSchema);

export default Event;
