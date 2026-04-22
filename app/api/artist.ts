import apiClient, { getAuthCookie } from './apiClient';
import { CreateArtistRequest, GetArtistListResponse, GetArtistResponse } from './dtos/artist';

export class ArtistSerivce {
    public async getArtist(id: string): Promise<GetArtistResponse> {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.get(`/artists/${id}`, { headers }) as unknown as Promise<GetArtistResponse>;
    }

    public async getArtists(): Promise<GetArtistListResponse> {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.get('/artists', { headers }) as unknown as Promise<GetArtistListResponse>;
    }

    public async createArtist(request: CreateArtistRequest) {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.post('/artists', request, { headers });
    }
}
