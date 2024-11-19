import axios from 'axios';

export interface User {
  id: number;
  username: string;
  password: string;
}

export interface Poll {
  id: number;
  authorId: number;
  question: string;
  description: string;
  startTime: string;
  response1: string;
  response2: string;
  response3: string;
  response4: string;
}

export interface Response {
  userId: number;
  pollId: number;
  response: number;
}

const api = axios.create({
  baseURL: 'http://localhost:5001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to bypass potential CORS issues temporary
api.interceptors.request.use((config) => {
  config.headers['Access-Control-Allow-Origin'] = '*'; // Ensure proper CORS handling
  return config;
});

export const getPolls = async (): Promise<Poll[]> => {
  try {
    const response = await api.get<Poll[]>('/get-polls');
    return response.data;
  } catch (error) {
    console.error('Error fetching polls:', error);
    throw error;
  }
};

export default api;
