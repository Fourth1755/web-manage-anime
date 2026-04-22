import apiClient from './apiClient';
import { GetStudioResponse } from './dtos/studio';

export class StudioService {
    public async getStudio(): Promise<GetStudioResponse[]> {
        return apiClient.get('/studios') as unknown as Promise<GetStudioResponse[]>;
    }
}
