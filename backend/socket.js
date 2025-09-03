import { getCDNMetrics } from "./utils/cdnMetrics.js";

export default function initSocket(io) {
  io.on("connection", (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    // Join room
    socket.on("join:room", (roomId) => {
      socket.join(roomId);
      io.to(roomId).emit("system:message", `User ${socket.id} joined room ${roomId}`);
    });

    // Chat message
    socket.on("chat:message", ({ roomId, message }) => {
      io.to(roomId).emit("chat:message", { user: socket.id, message });
    });

    // Reactions
    socket.on("reaction", ({ roomId, emoji }) => {
      io.to(roomId).emit("reaction", { user: socket.id, emoji });
    });

    // Playback sync
    socket.on("playback:time", ({ roomId, time }) => {
      io.to(roomId).emit("playback:time", { user: socket.id, time });
    });

    // CDN Metrics update (simulated)
    socket.on("cdn:request", async (roomId) => {
      const metrics = await getCDNMetrics();
      io.to(roomId).emit("cdn:metrics", metrics);
    });

    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });
}
