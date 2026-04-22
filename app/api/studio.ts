import apiClient, { getAuthCookie } from './apiClient';
import { GetStudioResponse } from './dtos/studio';

export class StudioService {
    public async getStudio(): Promise<GetStudioResponse[]> {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.get('/studios', { headers }) as unknown as Promise<GetStudioResponse[]>;
    }
}
