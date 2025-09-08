const express = require('express');
const router = express.Router();
const db = require('./index.js').db;

// POST /sync
router.post('/', (req, res) => {
  // Simulate sync logic
  res.json({ msg: 'Playback synced for all users' });
});

module.exports = router;
