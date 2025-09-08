import { getCDNMetrics } from "./utils/cdnMetrics.js";

export default function initSocket(io) {
  const jwt = require('jsonwebtoken');
  const SECRET = 'streamsyncsupersecretkey';
  const roomUsers = {};

  io.on("connection", (socket) => {
    let userEmail = null;
    // Authenticate user via JWT
    socket.on("auth", (token) => {
      try {
        const payload = jwt.verify(token, SECRET);
        userEmail = payload.sub;
        socket.emit("auth:success", { user: userEmail });
      } catch {
        socket.emit("auth:error", { error: "Invalid token" });
        socket.disconnect();
      }
    });

    // Join room
    socket.on("join:room", (roomId) => {
      socket.join(roomId);
      roomUsers[roomId] = roomUsers[roomId] || new Set();
      roomUsers[roomId].add(socket.id);
      io.to(roomId).emit("system:message", `User ${userEmail || socket.id} joined room ${roomId}`);
      io.to(roomId).emit("viewers:update", roomUsers[roomId].size);
    });

    // Chat message
    socket.on("chat:message", ({ roomId, message }) => {
      if (!message) return;
      io.to(roomId).emit("chat:message", { user: userEmail || socket.id, message });
    });

    // Reactions
    socket.on("reaction", ({ roomId, emoji }) => {
      if (!emoji) return;
      io.to(roomId).emit("reaction", { user: userEmail || socket.id, emoji });
    });

    // Playback sync
    socket.on("playback:time", ({ roomId, time }) => {
      if (typeof time !== 'number') return;
      io.to(roomId).emit("playback:time", { user: userEmail || socket.id, time });
    });

    // CDN Metrics update (simulated)
    socket.on("cdn:request", async (roomId) => {
      const metrics = await getCDNMetrics();
      io.to(roomId).emit("cdn:metrics", metrics);
    });

    socket.on("disconnect", () => {
      Object.keys(roomUsers).forEach(roomId => {
        roomUsers[roomId].delete(socket.id);
        io.to(roomId).emit("viewers:update", roomUsers[roomId].size);
      });
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });
}
