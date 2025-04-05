// controllers/groupController.js
import Group from '../models/Groups.js';
import Message from '../models/Messages.js';

// Create a Group
export const createGroup = async (req, res) => {
  const { name, description, type, adminId, members = [], initialMessage } = req.body;

  try {
    const group = new Group({
      name,
      description,
      type,
      admins: [adminId],
      members: [...new Set([adminId, ...members])],
    });
    await group.save();

    if (initialMessage) {
      const message = new Message({ sender: adminId, content: initialMessage, group: group._id });
      await message.save();
      group.messages.push(message._id);
      group.lastMessage = message._id;
      await group.save();
    }

    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ error: 'Error creating group' });
  }
};

// Send Group Message
export const sendGroupMessage = async (req, res) => {
  const { senderId, groupId, content, fileUrl, type } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    const message = new Message({ sender: senderId, content, group: groupId, fileUrl, type });
    await message.save();

    group.messages.push(message._id);
    group.lastMessage = message._id;
    await group.save();

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Error sending message' });
  }
};

// Get all groups for a user
export const getUserGroups = async (req, res) => {
  const { userId } = req.params;

  try {
    const groups = await Group.find({ members: userId });
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user groups' });
  }
};

// Get group details
export const getGroupDetails = async (req, res) => {
  const { groupId } = req.params;

  try {
    const group = await Group.findById(groupId).populate('members admins messages');
    if (!group) return res.status(404).json({ error: 'Group not found' });
    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching group details' });
  }
};

// Get messages for a group
export const getGroupMessages = async (req, res) => {
  const { groupId } = req.params;
  const { page = 1, limit = 50 } = req.query;

  try {
    const messages = await Message.find({ group: groupId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching messages' });
  }
};

// Add members to a group
export const addGroupMembers = async (req, res) => {
  const { groupId } = req.params;
  const { memberIds } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    group.members.push(...memberIds);
    group.members = [...new Set(group.members.map(id => id.toString()))];
    await group.save();

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ error: 'Error adding members' });
  }
};

// Remove a member from a group
export const removeGroupMember = async (req, res) => {
  const { groupId, memberId } = req.params;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    group.members = group.members.filter(id => id.toString() !== memberId);
    await group.save();

    res.status(200).json({ message: 'Member removed' });
  } catch (error) {
    res.status(500).json({ error: 'Error removing member' });
  }
};

// Request to join a group
export const requestToJoinGroup = async (req, res) => {
  const { userId, groupId } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    if (!group.joinRequests.includes(userId)) {
      group.joinRequests.push(userId);
      await group.save();
    }

    res.status(200).json({ message: 'Join request sent' });
  } catch (error) {
    res.status(500).json({ error: 'Error requesting to join group' });
  }
};

// Approve join request
export const approveJoinRequest = async (req, res) => {
  const { groupId } = req.params;
  const { userId, adminId } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });
    if (!group.admins.includes(adminId)) return res.status(403).json({ error: 'Unauthorized' });

    group.members.push(userId);
    group.joinRequests = group.joinRequests.filter(id => id.toString() !== userId);
    await group.save();

    res.status(200).json({ message: 'User approved and added' });
  } catch (error) {
    res.status(500).json({ error: 'Error approving join request' });
  }
};

// Reject join request
export const rejectJoinRequest = async (req, res) => {
  const { groupId } = req.params;
  const { userId, adminId } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });
    if (!group.admins.includes(adminId)) return res.status(403).json({ error: 'Unauthorized' });

    group.joinRequests = group.joinRequests.filter(id => id.toString() !== userId);
    await group.save();

    res.status(200).json({ message: 'Join request rejected' });
  } catch (error) {
    res.status(500).json({ error: 'Error rejecting join request' });
  }
};

// Leave group
export const leaveGroup = async (req, res) => {
  const { groupId } = req.params;
  const { userId } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    group.members = group.members.filter(id => id.toString() !== userId);
    group.admins = group.admins.filter(id => id.toString() !== userId);
    await group.save();

    res.status(200).json({ message: 'Left group successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error leaving group' });
  }
};

// Update group info
export const updateGroup = async (req, res) => {
  const { groupId } = req.params;
  const updates = req.body;

  try {
    const updatedGroup = await Group.findByIdAndUpdate(groupId, updates, { new: true });
    if (!updatedGroup) return res.status(404).json({ error: 'Group not found' });
    res.status(200).json(updatedGroup);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update group' });
  }
};

// Make user a group admin
export const makeGroupAdmin = async (req, res) => {
  const { groupId } = req.params;
  const { userId } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    if (!group.admins.includes(userId)) group.admins.push(userId);
    await group.save();

    res.status(200).json({ message: 'User made admin' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to make user admin' });
  }
};

// Remove user from group admins
export const removeGroupAdmin = async (req, res) => {
  const { groupId } = req.params;
  const { userId } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    group.admins = group.admins.filter(adminId => adminId.toString() !== userId);
    await group.save();

    res.status(200).json({ message: 'User removed from admins' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove user from admins' });
  }
};

// Pin a message
export const pinGroupMessage = async (req, res) => {
  const { groupId } = req.params;
  const { messageId } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    if (!group.pinnedMessages.includes(messageId)) group.pinnedMessages.push(messageId);
    await group.save();

    res.status(200).json({ message: 'Message pinned' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to pin message' });
  }
};

// Unpin a message
export const unpinGroupMessage = async (req, res) => {
  const { groupId } = req.params;
  const { messageId } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    group.pinnedMessages = group.pinnedMessages.filter(id => id.toString() !== messageId);
    await group.save();

    res.status(200).json({ message: 'Message unpinned' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to unpin message' });
  }
};

// Get pinned messages
export const getPinnedMessages = async (req, res) => {
  const { groupId } = req.params;

  try {
    const group = await Group.findById(groupId).populate('pinnedMessages');
    if (!group) return res.status(404).json({ error: 'Group not found' });

    res.status(200).json(group.pinnedMessages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get pinned messages' });
  }
};

export const uploadGroupFile = async (req, res) => {
  // You'll likely need multer or similar here if handling file uploads
  res.status(200).json({ message: 'File upload endpoint hit (implement logic)' });
};

export const getGroupJoinRequests = async (req, res) => {
  const { groupId } = req.params;

  try {
    const group = await Group.findById(groupId).populate('joinRequests', 'name email'); // adjust fields as needed
    if (!group) return res.status(404).json({ error: 'Group not found' });

    res.status(200).json(group.joinRequests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get join requests' });
  }
};
