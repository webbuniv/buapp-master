import Message from '../models/Messages.js';
import Group from '../models/Groups.js';
import Chat from '../models/Chats.js';

// Send a group message
export const sendGroupMessage = async (req, res) => {
  const { senderId, groupId, content, type, fileUrl } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    const message = new Message({ sender: senderId, content, type, fileUrl, group: groupId });
    await message.save();

    group.messages.push(message._id);
    group.lastMessage = message._id;
    await group.save();

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Error sending message' });
  }
};

// Edit a message
export const editMessage = async (req, res) => {
  const { messageId } = req.params;
  const { newContent } = req.body;

  try {
    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ error: 'Message not found' });

    message.content = newContent;
    message.isEdited = true;
    await message.save();

    res.status(200).json({ message: 'Message edited successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error editing message' });
  }
};

// Delete a message
export const deleteMessage = async (req, res) => {
  const { messageId } = req.params;

  try {
    await Message.findByIdAndDelete(messageId);
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting message' });
  }
};
