import Announcement from '../models/Announcement.js';

export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate('authorId', 'fname lname role')
      .sort({ pinned: -1, createdAt: -1 })
      .lean();
    res.json({ announcements });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createAnnouncement = async (req, res) => {
  try {
    const { title, content, pinned } = req.body;
    const announcement = await Announcement.create({
      authorId: req.user._id,
      title,
      content,
      pinned: pinned ?? false,
    });
    const populated = await Announcement.findById(announcement._id).populate('authorId', 'fname lname role').lean();
    res.status(201).json({ message: 'Announcement created', announcement: populated });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('authorId', 'fname lname role');
    if (!announcement) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Updated', announcement });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
