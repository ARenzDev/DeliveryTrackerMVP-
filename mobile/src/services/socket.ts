import { io } from 'socket.io-client';
import { Platform } from 'react-native';

// Replace with your machine's local IP so physical devices can connect
const SOCKET_URL = 'http://192.168.101.14:3000';

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ['websocket'],
});
