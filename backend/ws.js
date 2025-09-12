const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const SECRET = 'streamsyncsupersecretkey';

function initWS(server) {
  const io = new Server(server, { cors: { origin: '*' } });
  module.exports.io = io;
  io.on('connection', (socket) => {
  // Log connection
  console.log('WebSocket connected:', socket.id);
    let userEmail = null;
    socket.on('auth', (token) => {
      try {
        const payload = jwt.verify(token, SECRET);
        userEmail = payload.sub;
        socket.emit('auth:success', { user: userEmail });
      } catch {
        socket.emit('auth:error', { error: 'Invalid token' });
        socket.disconnect();
      }
    });
    // ...existing socket logic...
  });
  return io;
}
module.exports = initWS;
