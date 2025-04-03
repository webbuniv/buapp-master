import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String }, // Description of the group
    type: { 
      type: String, 
      enum: ['class', 'office', 'department', 'discussion'], 
      required: true 
    }, // Type of group
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users in the group
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Group admins
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }], // Group messages
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' }, // Last message in the group
    isPublic: { type: Boolean, default: false }, // If the group is open to anyone
    joinRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users requesting to join
    pinnedMessages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }], // Important pinned messages
  },
  { timestamps: true }
);

const Group = mongoose.model('Group', groupSchema);
export default Group;
