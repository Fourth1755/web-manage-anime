import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosError,
} from 'axios';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

async function getAuthorization(): Promise<string> {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.getAll().find(c => c.value.startsWith('eyJ'));
    return `Bearer ${authCookie?.value ?? ''}`;
  } catch {
    return 'Bearer ';
  }
}

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    config.headers.set('Authorization', await getAuthorization());
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError) => {
    if (error.response) {
      console.log(`[API Error] Status: ${error.response.status}`, error.response.data);
    } else if (error.request) {
      console.error('[API Error] No response:', error.request);
    } else {
      console.error('[API Error] Request setup:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
