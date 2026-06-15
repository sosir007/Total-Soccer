import axios from 'axios';

export interface ApiResponse<T> {
  success: true;
  data: T;
  timestamp: string;
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:9249',
  timeout: 30000
});
