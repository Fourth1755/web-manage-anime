import axios from 'axios';
import { ConnectAnimapService } from './builder';

export class AuthService {
    private url: string;

    constructor() {
        this.url = new ConnectAnimapService().getUrl();
    }

    async login(email: string, password: string): Promise<{ setCookies: string[] }> {
        const response = await axios.post(`${this.url}/admin/login`, { email, password });
        const setCookies = (response.headers['set-cookie'] as string[] | undefined) ?? [];
        return { setCookies };
    }
}
