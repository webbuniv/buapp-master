import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    fileUrl: { type: String }, // URL to any file (image, pdf, doc, audio, etc.)
    fileType: { type: String }, // Optional: Could be 'image', 'pdf', 'audio', etc.
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Announcement = mongoose.model('Announcement', announcementSchema);
export default Announcement;
