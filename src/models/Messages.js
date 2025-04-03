import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Message sender (User)
    content: { type: String, required: true }, // Message text content
    type: { 
      type: String, 
      enum: ['text', 'image', 'file', 'system'], 
      default: 'text' 
    }, // Message type
    fileUrl: { type: String }, // URL for images or files
    chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }, // Private chat reference (if applicable)
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' }, // Group reference (if applicable)
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who read the message
    isEdited: { type: Boolean, default: false }, // Flag for edited messages
    deletedFor: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who deleted this message
    timestamp: { type: Date, default: Date.now } // Message timestamp
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);
export default Message;
