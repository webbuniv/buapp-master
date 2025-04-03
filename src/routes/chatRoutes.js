import express from 'express';
import { startChat, sendMessage, blockChat } from '../controllers/chatController.js';

const router = express.Router();

router.post('/start', startChat);
router.post('/send', sendMessage);
router.post('/block', blockChat);

export default router;
