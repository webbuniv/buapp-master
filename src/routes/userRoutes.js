import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  addContact,
  markNotificationAsRead,
  getUserNotifications,
} from '../controllers/userController.js';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

router.post('/add-contact', addContact);
router.get('/:userId/notifications', getUserNotifications);
router.post('/notifications/mark-read', markNotificationAsRead);

export default router;
