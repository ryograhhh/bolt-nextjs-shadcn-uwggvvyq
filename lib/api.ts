import axios from 'axios';

const API_BASE_URL = 'https://spamsharev1api-lkmr.onrender.com';

export interface ShareRequest {
  cookie: string;
  url: string;
  amount: number;
  interval: number;
}

export interface Session {
  session: number;
  url: string;
  count: number;
  id: string;
  target: number;
  timestamp: number;
}

export const api = {
  submitShare: async (data: ShareRequest) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/submit`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.detail || 'API request failed');
      }
      throw new Error('Network error occurred');
    }
  },

  getSessions: async (): Promise<Session[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/total`, {
        timeout: 5000,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
      return [];
    }
  }
};