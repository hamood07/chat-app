// routes/messages.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Message = require('../models/Message');
const User = require('../models/User');

// =========================
// Direct messages
// =========================

// Send a direct message
router.post('/direct', auth, async (req, res) => {
  try {
    const { to, text } = req.body;
    const from = req.user.id;

    if (!to || !text) {
      return res.status(400).json({ message: 'Missing "to" or "text"' });
    }

    const msg = new Message({ from, to, text });
    await msg.save();

    const populated = await msg.populate('from', 'username avatar');
    res.json(populated);
  } catch (err) {
    console.error('Send direct message error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get recent direct messages between current user and another user
router.get('/direct/:userId', auth, async (req, res) => {
  try {
    const otherId = req.params.userId;
    const userId = req.user.id;

    const messages = await Message.find({
      $or: [
        { from: userId, to: otherId },
        { from: otherId, to: userId }
      ]
    })
      .sort('createdAt')
      .limit(100)
      .populate('from', 'username avatar');

    res.json(messages);
  } catch (err) {
    console.error('Get direct messages error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// =========================
// Room messages
// =========================

// Send a message to a room
router.post('/room', auth, async (req, res) => {
  try {
    const { room, text } = req.body;
    const from = req.user.id;

    if (!room || !text) {
      return res.status(400).json({ message: 'Missing "room" or "text"' });
    }

    const msg = new Message({ from, room, text });
    await msg.save();

    const populated = await msg.populate('from', 'username avatar');
    res.json(populated);
  } catch (err) {
    console.error('Send room message error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get recent messages for a room
router.get('/room/:room', auth, async (req, res) => {
  try {
    const room = req.params.room;

    const messages = await Message.find({ room })
      .sort('createdAt')
      .limit(200)
      .populate('from', 'username avatar');

    res.json(messages);
  } catch (err) {
    console.error('Get room messages error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

