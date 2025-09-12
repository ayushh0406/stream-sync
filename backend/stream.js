const express = require('express');
const router = express.Router();
const db = require('./index.js').db;

// GET /stream/:user_id
router.get('/:user_id', (req, res) => {
  const userId = req.params.user_id;
  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ detail: 'Invalid user id' });
  }
  // Simulate video chunk
  res.json({ chunk: 'video_chunk_data', user: userId, ts: Date.now() });
});

module.exports = router;
