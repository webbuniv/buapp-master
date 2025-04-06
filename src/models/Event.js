import mongoose from "mongoose"

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
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
    isGeneral: {
      type: Boolean,
      default: false,
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reminderTimes: [
      {
        type: Number,
      },
    ], // in minutes before event
    type: {
      type: String,
      enum: ["general", "meeting", "class", "exam", "deadline"],
      default: "general",
    },
  },
  { timestamps: true },
)

const Event = mongoose.model("Event", eventSchema)
export default Event

