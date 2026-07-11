import axios, {
  type AxiosInstance,
  type AxiosError,
} from 'axios';
import http from 'http';
import https from 'https';
import { cookies } from 'next/headers';
import { ADMIN_SESSION_COOKIE, isAdminSessionToken } from '@/lib/adminSession';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  httpAgent: new http.Agent({ keepAlive: false }),
  httpsAgent: new https.Agent({ keepAlive: false }),
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

// Return only this app's admin session. Other JWT cookies may belong to the user app.
export async function getAuthCookie(): Promise<string> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
    return isAdminSessionToken(token) ? `${ADMIN_SESSION_COOKIE}=${token}` : '';
  } catch {
    return '';
  }
}

export default apiClient;
