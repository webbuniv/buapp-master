import Group from '../models/Groups.js';
import Message from '../models/Messages.js';

// Create a Group
export const createGroup = async (req, res) => {
  const { name, description, type, adminId } = req.body;

  try {
    const group = new Group({ name, description, type, admins: [adminId], members: [adminId] });
    await group.save();

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

// Join Group Request
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
