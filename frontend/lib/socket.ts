import { io } from 'socket.io-client';

export const socket = io('https://api.streamsync.dev', {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export const emitPlaybackTime = (time: number) => {
  socket.emit('playback:time', { time });
};

export const emitReaction = (reaction: string) => {
  socket.emit('reaction', { reaction });
};

export const emitChatMessage = (message: string) => {
  socket.emit('chat:message', { message });
};