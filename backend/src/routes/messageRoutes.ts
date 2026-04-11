import express from 'express';
import ContactMessage from '../models/ContactMessage';
import { verifyToken, requireAdmin } from '../middleware/authMiddleware';

const router = express.Router();

// Public: Submit a new contact message
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newMessage = new ContactMessage({ name, email, message });
    await newMessage.save();

    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending message' });
  }
});

// Admin: Get all messages
router.get('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

// Admin: Mark message as read/unread
router.put('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { isRead } = req.body;
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { isRead },
      { new: true }
    );
    if (!message) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: 'Status updated', data: message });
  } catch (error) {
    res.status(500).json({ message: 'Error updating message' });
  }
});

// Admin: Delete a message
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting message' });
  }
});

export default router;
