import express from 'express';
import { createGroup, sendGroupMessage, requestToJoinGroup } from '../controllers/groupController.js';

const router = express.Router();

router.post('/create', createGroup);
router.post('/send', sendGroupMessage);
router.post('/request-join', requestToJoinGroup);

export default router;
