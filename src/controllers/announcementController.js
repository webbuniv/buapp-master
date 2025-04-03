import Announcement from '../models/Announcement.js';

// Create a new announcement
export const createAnnouncement = async (req, res) => {
  const { title, content, fileUrl, fileType, postedBy } = req.body;

  try {
    // Create the new announcement with file URL and type
    const newAnnouncement = new Announcement({
      title,
      content,
      fileUrl, // File URL from frontend (could be any file type)
      fileType, // File type (e.g., 'image', 'pdf', 'audio', etc.)
      postedBy,
    });

    // Save the announcement in the database
    await newAnnouncement.save();

    res.status(201).json(newAnnouncement);
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ error: 'Error creating announcement' });
  }
};

// Fetch all announcements
export const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find();
    res.status(200).json(announcements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ error: 'Error fetching announcements' });
  }
};

// Get an announcement by ID
export const getAnnouncementById = async (req, res) => {
  const { id } = req.params;
  try {
    const announcement = await Announcement.findById(id);
    if (!announcement) return res.status(404).json({ error: 'Announcement not found' });
    res.status(200).json(announcement);
  } catch (error) {
    console.error('Error fetching announcement:', error);
    res.status(500).json({ error: 'Error fetching announcement' });
  }
};

// Delete an announcement by ID
export const deleteAnnouncement = async (req, res) => {
  const { id } = req.params;
  try {
    const announcement = await Announcement.findById(id);
    if (!announcement) return res.status(404).json({ error: 'Announcement not found' });
    await announcement.remove();
    res.status(200).json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({ error: 'Error deleting announcement' });
  }
};
