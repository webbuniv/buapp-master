import express from 'express';
import messageController from '../controllers/messageController.js';

const router = express.Router();

// Route to get messages for a specific user
router.get('/:userId', messageController.getUserMessages);

export default router;
