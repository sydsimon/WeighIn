import axios from 'axios';

export interface User {
  userid?: number;
  username: string;
  password: string;
}

export interface Poll {
  id?: number;
  authorId: number;
  question: string;
  description?: string;
  startTime: string;
  response1: string;
  response2: string;
  response3: string;
  response4: string;
}

export interface PollResponse {
  userid: number;
  questionid: number;
  response: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  userid: number;
  username: string;
}

const api = axios.create({
  baseURL: 'http://localhost:5001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for CORS
api.interceptors.request.use((config) => {
  config.headers['Access-Control-Allow-Origin'] = '*';
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error || error.message || 'An error occurred';
    throw new Error(message);
  }
);

// User Authentication
export const createAccount = async (userData: User): Promise<any> => {
  return api.post('/add-user', userData);
};

export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  return api.post('/login', credentials);
};

// Polls
export const getPolls = async (): Promise<Poll[]> => {
  return api.get('/get-polls');
};

export const createPoll = async (pollData: Poll): Promise<any> => {
  const backendPollData = {
    authorid: pollData.authorId,
    question: pollData.question,
    description: pollData.description || '',
    start_time: pollData.startTime,
    response1: pollData.response1,
    response2: pollData.response2,
    response3: pollData.response3,
    response4: pollData.response4
  };

  return api.post('/add-poll', backendPollData);
};

export const submitPollResponse = async (responseData: PollResponse): Promise<any> => {
  return api.post('/add-response', responseData);
};

export const getPollResults = async (questionId: number): Promise<any> => {
  return api.get(`/get-poll-results/${questionId}`);
};

export const getPoll = async (pollId: number): Promise<Poll> => {
  return api.get(`/get-poll/${pollId}`);
};