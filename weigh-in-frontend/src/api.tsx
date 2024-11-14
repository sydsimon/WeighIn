import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = 'http://localhost:5000';

interface User {
  id: number;
  username: string;
  password: string;
}

interface Poll {
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

interface Response {
  userId: number;
  pollId: number;
  response: number;
}

export async function createUser(userData: User): Promise<AxiosResponse<any>> {
  return await axios.post(`${API_BASE_URL}/add-user`, userData);
}

export async function createPoll(pollData: Poll): Promise<AxiosResponse<any>> {
  return await axios.post(`${API_BASE_URL}/add-poll`, pollData);
}

export async function addResponse(responseData: Response): Promise<AxiosResponse<any>> {
  return await axios.post(`${API_BASE_URL}/add-response`, responseData);
}

export async function getMaxResponsePerQuestion(): Promise<AxiosResponse<any>> {
  return await axios.get(`${API_BASE_URL}/max-response-per-question`);
}

export async function getPollResults(pollId: number): Promise<AxiosResponse<any>> {
  return await axios.get(`${API_BASE_URL}/get-poll-results/${pollId}`);
}

export async function getRandomQualityControlPoll(): Promise<AxiosResponse<any>> {
  return await axios.get(`${API_BASE_URL}/quality-control/get-random-quality-control-poll`);
}
  
export async function checkQualityControlResponse(userId: number, pollId: number, response: number): Promise<AxiosResponse<any>> {
  return await axios.post(`${API_BASE_URL}/quality-control/check-quality-control-response`, {
    userId,
    pollId,
    response,
  });
}
  