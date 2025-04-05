import Chat from "../models/Chats.js"
import Message from "../models/Messages.js"
import User from "../models/User.js"

// Start a Private Chat
export const startChat = async (req, res) => {
  const { userId1, userId2 } = req.body

  try {
    // Check if users exist
    const [user1, user2] = await Promise.all([User.findById(userId1), User.findById(userId2)])

    if (!user1 || !user2) {
      return res.status(404).json({ error: "One or both users not found" })
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [userId1, userId2], $size: 2 },
    }).populate("participants", "name avatar")

    if (!chat) {
      chat = new Chat({ participants: [userId1, userId2] })
      await chat.save()

      // Populate the participants after saving
      chat = await Chat.findById(chat._id).populate("participants", "name avatar")
    }

    res.status(200).json(chat)
  } catch (error) {
    console.error("Error starting chat:", error)
    res.status(500).json({ error: "Error starting chat" })
  }
}

// Send Private Message
export const sendMessage = async (req, res) => {
  const { senderId, chatId, content, fileUrl, type } = req.body

  try {
    const chat = await Chat.findById(chatId)
    if (!chat) return res.status(404).json({ error: "Chat not found" })

    // Get sender info for the response
    const sender = await User.findById(senderId).select("name avatar")
    if (!sender) return res.status(404).json({ error: "Sender not found" })

    const message = new Message({
      sender: senderId,
      content,
      chat: chatId,
      fileUrl,
      type,
      readBy: [senderId], // Mark as read by sender
    })

    await message.save()

    chat.messages.push(message._id)
    chat.lastMessage = message._id
    await chat.save()

    // Populate the message with sender info for the response
    const populatedMessage = await Message.findById(message._id).populate("sender", "name avatar")

    // The socket event will be emitted from the client

    res.status(201).json({
      ...populatedMessage.toObject(),
      senderName: sender.name,
      senderAvatar: sender.avatar,
    })
  } catch (error) {
    console.error("Error sending message:", error)
    res.status(500).json({ error: "Error sending message" })
  }
}

// Get Chat Messages
export const getChatMessages = async (req, res) => {
  const { chatId } = req.params

  try {
    const chat = await Chat.findById(chatId)
    if (!chat) return res.status(404).json({ error: "Chat not found" })

    const messages = await Message.find({ chat: chatId }).populate("sender", "name avatar").sort({ createdAt: 1 })

    res.status(200).json(messages)
  } catch (error) {
    console.error("Error fetching messages:", error)
    res.status(500).json({ error: "Error fetching messages" })
  }
}

// Mark Messages as Read
export const markMessagesAsRead = async (req, res) => {
  const { chatId, userId } = req.body

  try {
    const result = await Message.updateMany(
      {
        chat: chatId,
        sender: { $ne: userId },
        readBy: { $ne: userId },
      },
      { $addToSet: { readBy: userId } },
    )

    res.status(200).json({
      success: true,
      count: result.modifiedCount,
    })
  } catch (error) {
    console.error("Error marking messages as read:", error)
    res.status(500).json({ error: "Error marking messages as read" })
  }
}

// Block a Chat
export const blockChat = async (req, res) => {
  const { chatId, userId } = req.body

  try {
    const chat = await Chat.findById(chatId)
    if (!chat) return res.status(404).json({ error: "Chat not found" })

    chat.isBlocked = true
    chat.blockedBy = userId
    await chat.save()

    res.status(200).json({ message: "Chat blocked successfully" })
  } catch (error) {
    console.error("Error blocking chat:", error)
    res.status(500).json({ error: "Error blocking chat" })
  }
}

// Get User Chats
export const getUserChats = async (req, res) => {
  const { userId } = req.params

  try {
    const chats = await Chat.find({ participants: userId })
      .populate("participants", "name avatar")
      .populate("lastMessage")
      .sort({ updatedAt: -1 })

    res.status(200).json(chats)
  } catch (error) {
    console.error("Error fetching user chats:", error)
    res.status(500).json({ error: "Error fetching user chats" })
  }
}

