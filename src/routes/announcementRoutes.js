import express from 'express';
import { createAnnouncement, getAllAnnouncements, getAnnouncementById, deleteAnnouncement } from '../controllers/announcementController.js';

const router = express.Router();

// Route to create a new announcement
router.post('/create', createAnnouncement);

// Route to fetch all announcements
router.get('/', getAllAnnouncements);

// Route to fetch an announcement by ID
router.get('/:id', getAnnouncementById);

// Route to delete an announcement by ID
router.delete('/:id', deleteAnnouncement);

export default router;
