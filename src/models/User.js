import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
      type: String, 
      enum: ['Admin', 'Student', 'Lecturer', 'Staff'], 
      default: 'Student' 
    },
    avatar: { type: String, default: '' },

    // Authentication & Security
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    verificationToken: {
        type: String, // Stores the OTP for verification
      },

    // Student-specific Fields
    registrationNumber: {
        type: String,
        unique: true,
        required: function() {
          return this.role === 'Student'; // Only required if the user is a Student
        },
        match: /^[A-Za-z0-9\/]+$/,  // Updated regex to allow slashes
        trim: true,
    },
    // Messaging
    contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // User contacts
    chats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }], // Connected chats

    // Announcements & Notifications
    announcements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Announcement' }],
    notifications: [
      {
        message: { type: String },
        read: { type: Boolean, default: false },
        timestamp: { type: Date, default: Date.now },
      }
    ],

    // Course & University Data (for students & lecturers)
    department: { type: String },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],

    // Status & Metadata
    status: { type: String, default: 'active' }, // active, suspended, deleted
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
