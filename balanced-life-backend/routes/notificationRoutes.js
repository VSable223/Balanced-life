import express from 'express';
import Notification from '../models/Notification.js';

const router = express.Router();

// GET all notifications
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new notification (for testing)
router.post('/', async (req, res) => {
  try {
    const { title, message } = req.body;
    const notification = new Notification({ title, message });
    await notification.save();
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
