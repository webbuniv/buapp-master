import User from '../models/User.js';
// import Course from '../models/Course.js';

// Get All Users (Admins only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -verificationToken -resetPasswordToken -resetPasswordExpires');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve users' });
  }
};

// Get a Single User by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -verificationToken -resetPasswordToken -resetPasswordExpires')
      .populate('chats announcements courses');
    
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user' });
  }
};

// Update User Profile (Self or Admin)
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const user = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user' });
  }
};

// Delete User (Soft Delete - status change)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status: 'deleted' }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User deleted (soft)' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
};

// Add a Contact
export const addContact = async (req, res) => {
  const { userId, contactId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.contacts.includes(contactId)) {
      user.contacts.push(contactId);
      await user.save();
    }

    res.status(200).json({ message: 'Contact added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding contact' });
  }
};

// Mark Notification as Read
export const markNotificationAsRead = async (req, res) => {
  const { userId, notificationId } = req.body;

  try {
    const user = await User.findById(userId);
    const notification = user.notifications.id(notificationId);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });

    notification.read = true;
    await user.save();

    res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark notification as read' });
  }
};

// Get Notifications
export const getUserNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('notifications');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user.notifications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get notifications' });
  }
};
