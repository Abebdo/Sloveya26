import axios from 'axios';
import { JobResponse, HealthResponse, AnomalyResult } from '../types/diagnostic';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30s timeout
});

// Interceptors for error handling or logging could go here
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Standardized error handling
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const submitJob = async (file: File): Promise<JobResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post<JobResponse>('/diagnostics', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getJobStatus = async (jobId: string): Promise<JobResponse> => {
  const response = await api.get<JobResponse>(`/diagnostics/${jobId}`);
  return response.data;
};

export const getHealth = async (): Promise<HealthResponse> => {
  const response = await api.get<HealthResponse>('/health');
  return response.data;
};

export const detectAnomalies = async (file: File): Promise<AnomalyResult[]> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post<AnomalyResult[]>('/anomalies/detect', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export default api;
