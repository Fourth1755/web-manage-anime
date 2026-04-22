import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';

export class AuthService {
    async login(email: string, password: string): Promise<{ setCookies: string[] }> {
        // Uses bare axios (not apiClient) to access raw response headers for set-cookie forwarding.
        const response = await axios.post(`${API_BASE_URL}/admin/login`, { email, password });
        const setCookies = (response.headers['set-cookie'] as string[] | undefined) ?? [];
        return { setCookies };
    }
}
