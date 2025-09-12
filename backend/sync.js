const express = require('express');
const router = express.Router();
const db = require('./index.js').db;

// POST /sync
router.post('/', (req, res) => {
  // Simulate sync logic
  const io = require('./ws').io;
  if (io) {
    io.emit('sync', { ts: Date.now() });
    console.log('Sync event broadcasted');
  }
  res.json({ msg: 'Playback synced for all users' });
});

module.exports = router;
