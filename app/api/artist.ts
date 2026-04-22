import apiClient from './apiClient';
import { CreateArtistRequest, GetArtistListResponse, GetArtistResponse } from './dtos/artist';

export class ArtistSerivce {
    public async getArtist(id: string): Promise<GetArtistResponse> {
        return apiClient.get(`/artists/${id}`) as unknown as Promise<GetArtistResponse>;
    }

    public async getArtists(): Promise<GetArtistListResponse> {
        return apiClient.get('/artists') as unknown as Promise<GetArtistListResponse>;
    }

    public async createArtist(request: CreateArtistRequest) {
        return apiClient.post('/artists', request);
    }
}
