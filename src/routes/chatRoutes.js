import express from "express"
import {
  startChat,
  sendMessage,
  blockChat,
  getChatMessages,
  markMessagesAsRead,
  getUserChats,
} from "../controllers/chatController.js"

const router = express.Router()

router.post("/start", startChat)
router.post("/send", sendMessage)
router.post("/block", blockChat)
router.get("/:chatId/messages", getChatMessages)
router.post("/read", markMessagesAsRead)
router.get("/user/:userId", getUserChats)

export default router

