const express = require('express');
const http = require('http');
const redis = require('redis');
const streamRouter = require('./stream');
const syncRouter = require('./sync');
const initWS = require('./ws');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const SECRET = 'streamsyncsupersecretkey';
const db = new sqlite3.Database('streamsync.db');
const redisClient = redis.createClient();
redisClient.connect();

const app = express();
app.use(express.json());
app.use('/stream', streamRouter);
app.use('/sync', syncRouter);
app.use(cors());

// Init tables
function initDB() {
  db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT UNIQUE, hashed_password TEXT)`);
  db.run(`CREATE TABLE IF NOT EXISTS chat (id INTEGER PRIMARY KEY, user_email TEXT, message TEXT, timestamp INTEGER)`);
  db.run(`CREATE TABLE IF NOT EXISTS reactions (id INTEGER PRIMARY KEY, user_email TEXT, emoji TEXT, timestamp INTEGER)`);
}
initDB();

// Signup
app.post('/signup', (req, res) => {
  const { email, password } = req.body;
  // Email format validation
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ detail: 'Invalid email format' });
  }
  // Password strength validation
  if (!password || password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    return res.status(400).json({ detail: 'Password must be 8+ chars, include a number and uppercase.' });
  }
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
    if (row) return res.status(400).json({ detail: 'Email already registered' });
    const hashed = bcrypt.hashSync(password, 12);
    db.run('INSERT INTO users (email, hashed_password) VALUES (?, ?)', [email, hashed], err => {
      if (err) return res.status(500).json({ detail: 'Database error' });
      res.json({ msg: 'Signup successful' });
    });
  });
});

// Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (!user || !bcrypt.compareSync(password, user.hashed_password)) {
      return res.status(400).json({ detail: 'Bad creds' });
    }
    const token = jwt.sign({ sub: user.email }, SECRET, { expiresIn: '1h' });
    res.json({ access_token: token, token_type: 'bearer' });
  });
});

// Auth middleware
function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ detail: 'No token' });
  try {
    req.user = jwt.verify(token, SECRET).sub;
    next();
  } catch {
    res.status(401).json({ detail: 'Bad token' });
  }
}

// Chat
app.post('/chat', auth, (req, res) => {
  const { message, timestamp } = req.body;
  if (!message || typeof message !== 'string' || message.length > 200) {
    return res.status(400).json({ detail: 'Message required, max 200 chars.' });
  }
  if (!timestamp || typeof timestamp !== 'number') {
    return res.status(400).json({ detail: 'Valid timestamp required.' });
  }
  db.run('INSERT INTO chat (user_email, message, timestamp) VALUES (?, ?, ?)', [req.user, message, timestamp], err => {
    if (err) return res.status(500).json({ detail: 'DB error' });
    res.json({ msg: 'Chat ok' });
  });
});
app.get('/chat', (req, res) => {
  db.all('SELECT user_email, message, timestamp FROM chat ORDER BY timestamp DESC LIMIT 50', (err, rows) => {
    res.json(rows);
  });
});

// Reactions
app.post('/reaction', auth, (req, res) => {
  const { emoji, timestamp } = req.body;
  if (!emoji || typeof emoji !== 'string' || emoji.length > 20) {
    return res.status(400).json({ detail: 'Emoji required, max 20 chars.' });
  }
  if (!timestamp || typeof timestamp !== 'number') {
    return res.status(400).json({ detail: 'Valid timestamp required.' });
  }
  db.run('INSERT INTO reactions (user_email, emoji, timestamp) VALUES (?, ?, ?)', [req.user, emoji, timestamp], err => {
    if (err) return res.status(500).json({ detail: 'DB error' });
    res.json({ msg: 'React ok' });
  });
// Admin: clear chat
app.post('/chat/clear', (req, res) => {
  db.run('DELETE FROM chat', err => {
    if (err) return res.status(500).json({ detail: 'DB error' });
    res.json({ msg: 'Chat cleared' });
  });
});
// Admin: clear reactions
app.post('/reaction/clear', (req, res) => {
  db.run('DELETE FROM reactions', err => {
    if (err) return res.status(500).json({ detail: 'DB error' });
    res.json({ msg: 'Reactions cleared' });
  });
});
});
app.get('/reaction', (req, res) => {
  db.all('SELECT user_email, emoji, timestamp FROM reactions ORDER BY timestamp DESC LIMIT 50', (err, rows) => {
    res.json(rows);
  });
});

const server = http.createServer(app);
initWS(server);
server.listen(5000, () => console.log('Node backend running on 5000'));
