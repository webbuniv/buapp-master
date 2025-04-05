// Map to store online users: { userId: socketId }
const onlineUsers = new Map()
// Map to store users currently typing: { chatId: [userId1, userId2, ...] }
const typingUsers = new Map()

export const setupSocketIO = (io) => {
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id)

    // User authentication and storing online status
    socket.on("authenticate", (userId) => {
      onlineUsers.set(userId, socket.id)
      console.log(`User ${userId} is now online`)

      // Broadcast user's online status to all connected clients
      io.emit("userStatus", { userId, status: "online" })

      // Send the list of online users to the newly connected user
      const onlineUsersList = Array.from(onlineUsers.keys())
      socket.emit("onlineUsers", onlineUsersList)
    })

    // Join a chat room
    socket.on("joinChat", (chatId) => {
      socket.join(chatId)
      console.log(`Socket ${socket.id} joined chat: ${chatId}`)
    })

    // Join a group chat room
    socket.on("joinGroup", (groupId) => {
      socket.join(groupId)
      console.log(`Socket ${socket.id} joined group: ${groupId}`)
    })

    // Handle new message
    socket.on("sendMessage", (message) => {
      console.log("New message received:", message)

      if (message.chatId) {
        // Private chat message
        io.to(message.chatId).emit("newMessage", message)

        // If recipient is online, send notification
        const recipientId = message.recipientId
        if (recipientId && onlineUsers.has(recipientId)) {
          const recipientSocketId = onlineUsers.get(recipientId)
          io.to(recipientSocketId).emit("messageNotification", {
            senderId: message.senderId,
            senderName: message.senderName,
            chatId: message.chatId,
            content: message.content,
          })
        }
      } else if (message.groupId) {
        // Group chat message
        io.to(message.groupId).emit("newMessage", message)
      }
    })

    // Handle typing status
    socket.on("typing", ({ userId, chatId, isTyping }) => {
      if (!typingUsers.has(chatId)) {
        typingUsers.set(chatId, new Set())
      }

      const chatTypingUsers = typingUsers.get(chatId)

      if (isTyping) {
        chatTypingUsers.add(userId)
      } else {
        chatTypingUsers.delete(userId)
      }

      // Broadcast to everyone in the chat except the sender
      socket.to(chatId).emit("userTyping", {
        chatId,
        typingUsers: Array.from(chatTypingUsers),
      })
    })

    // Handle read receipts
    socket.on("messageRead", ({ messageId, chatId, userId }) => {
      io.to(chatId).emit("messageReadUpdate", { messageId, userId })
    })

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id)

      // Find and remove the disconnected user
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId)
          console.log(`User ${userId} is now offline`)

          // Broadcast user's offline status
          io.emit("userStatus", { userId, status: "offline" })
          break
        }
      }
    })
  })
}

