import axios from 'axios';
import { ConnectAnimapService } from './builder';

type LoginResponse = {
    token: string;
};

export class AuthService {
    private url: string;

    constructor() {
        this.url = new ConnectAnimapService().getUrl();
    }

    async login(email: string, password: string): Promise<LoginResponse> {
        const response = await axios.post<LoginResponse>(`${this.url}/login`, { email, password });
        return response.data;
    }
}
