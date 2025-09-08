const express = require('express');
const router = express.Router();
const db = require('./index.js').db;

// GET /stream/:user_id
router.get('/:user_id', (req, res) => {
  // Simulate stream chunk fetch
  res.json({ chunk: 'video_chunk_data', user: req.params.user_id });
});

module.exports = router;
