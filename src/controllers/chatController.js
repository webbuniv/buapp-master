import Chat from '../models/Chats.js';
import Message from '../models/Messages.js';

// Start a Private Chat
export const startChat = async (req, res) => {
  const { userId1, userId2 } = req.body;

  try {
    let chat = await Chat.findOne({ participants: { $all: [userId1, userId2] } });

    if (!chat) {
      chat = new Chat({ participants: [userId1, userId2] });
      await chat.save();
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ error: 'Error starting chat' });
  }
};

// Send Private Message
export const sendMessage = async (req, res) => {
  const { senderId, chatId, content, fileUrl, type } = req.body;

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ error: 'Chat not found' });

    const message = new Message({ sender: senderId, content, chat: chatId, fileUrl, type });
    await message.save();

    chat.messages.push(message._id);
    chat.lastMessage = message._id;
    await chat.save();

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Error sending message' });
  }
};

// Block a Chat
export const blockChat = async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ error: 'Chat not found' });

    chat.isBlocked = true;
    chat.blockedBy = userId;
    await chat.save();

    res.status(200).json({ message: 'Chat blocked successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error blocking chat' });
  }
};
