import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    isGeneral: { type: Boolean, default: false }, // General event (visible to all) or personal
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reminderTimes: [{ type: Number }], // in minutes
  },
  { timestamps: true }
);

const Event = mongoose.model('Event', eventSchema);
export default Event;
