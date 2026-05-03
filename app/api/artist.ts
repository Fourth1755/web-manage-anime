import apiClient, { getAuthCookie } from './apiClient';
import { ConfirmSpotifyArtistRequest, CreateArtistRequest, GetArtistListResponse, GetArtistResponse, MigrateSpotifyArtistResponse } from './dtos/artist';

export class ArtistSerivce {
    public async getArtist(id: string): Promise<GetArtistResponse> {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.get(`/admin/artists/${id}`, { headers }) as unknown as Promise<GetArtistResponse>;
    }

    public async getArtists(page = 1, limit = 10): Promise<GetArtistListResponse> {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.get('/admin/artists', { params: { page, limit }, headers }) as unknown as Promise<GetArtistListResponse>;
    }

    public async createArtist(request: CreateArtistRequest) {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.post('/admin/artists', request, { headers });
    }

    public async migrateSpotify(artist_id: string): Promise<MigrateSpotifyArtistResponse> {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.post('/admin/migrate/spotify-artist', { artist_id }, { headers }) as unknown as Promise<MigrateSpotifyArtistResponse>;
    }

    public async confirmSpotifyArtist(request: ConfirmSpotifyArtistRequest) {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.post('/admin/migrate/spotify-artist/confirm', request, { headers });
    }
}
