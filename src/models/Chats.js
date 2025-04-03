import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }], // Two users in the chat
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }], // List of messages
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' }, // Last message in the chat
    isBlocked: { type: Boolean, default: false }, // Chat blocking status
    blockedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // User who blocked the chat (if any)
  },
  { timestamps: true }
);

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;
