export const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:5000' 
  : 'https://api.streamsync.dev';

export const SOCKET_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:5000' 
  : 'https://api.streamsync.dev';

export const MAX_MESSAGE_LENGTH = 200;
export const MAX_EMOJI_LENGTH = 20;