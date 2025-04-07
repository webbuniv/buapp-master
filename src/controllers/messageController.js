import Message from '../models/Messages.js';
import Chat from '../models/Chats.js';
import Group from '../models/Groups.js';

const getUserMessages = async (req, res) => {
  try {
    const { userId } = req.params; // Get the user ID from the URL parameter

    // Get all messages from chats the user is a participant of
    const chatMessages = await Chat.find({ participants: userId })
      .populate({
        path: 'messages',
        match: { readBy: { $ne: userId } }, // Optional: filter for unread messages
        populate: { path: 'sender', select: 'name' },
      })
      .select('messages'); // Only select the messages field

    // Get all messages from groups the user is a member of
    const groupMessages = await Group.find({ members: userId })
      .populate({
        path: 'messages',
        match: { readBy: { $ne: userId } }, // Optional: filter for unread messages
        populate: { path: 'sender', select: 'name' },
      })
      .select('messages'); // Only select the messages field

    // Combine messages from both chats and groups
    const allMessages = [
      ...chatMessages.flatMap(chat => chat.messages),
      ...groupMessages.flatMap(group => group.messages),
    ];

    // Sort messages by timestamp (latest first)
    allMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.status(200).json({ messages: allMessages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching messages' });
  }
};

export default { getUserMessages };
