import axios from 'axios';
import { Platform } from 'react-native';

// Replace with your machine's local IP so physical devices can connect
const API_URL = 'http://192.168.101.14:3000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
