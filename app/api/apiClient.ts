import axios, {
  type AxiosInstance,
  type AxiosError,
} from 'axios';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError) => {
    if (error.response) {
      console.error(`[API Error] Status: ${error.response.status}`, error.response.data);
    } else if (error.request) {
      console.error('[API Error] No response:', error.request);
    } else {
      console.error('[API Error] Request setup:', error.message);
    }
    return Promise.reject(error);
  }
);

// Returns the jwt cookie string to forward to the backend.
// The Gin middleware reads the JWT from a cookie named "jwt", not from Authorization header.
export async function getAuthCookie(): Promise<string> {
  try {
    const cookieStore = await cookies();
    const jwtCookie = cookieStore.get('jwt');
    return jwtCookie ? `jwt=${jwtCookie.value}` : '';
  } catch {
    return '';
  }
}

export default apiClient;
