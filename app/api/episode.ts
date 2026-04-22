import apiClient, { getAuthCookie } from './apiClient';
import { AddCharacterToEpisodeRequest, CreateEpisodeRequest, GetEpisodeByAnimeResponse, UpdateEpisodeRequest } from './dtos/episode';

export class EpisodeService {
    public async getEpisode(anime_id: string, filter: string): Promise<GetEpisodeByAnimeResponse> {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.get(`/episodes/${anime_id}`, { params: { filter }, headers }) as unknown as Promise<GetEpisodeByAnimeResponse>;
    }

    public async createEpisode(request: CreateEpisodeRequest) {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.post('/episodes', request, { headers });
    }

    public async updateEpisode(request: UpdateEpisodeRequest) {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.put('/episodes', request, { headers });
    }

    public async addCharacterToEpisode(request: AddCharacterToEpisodeRequest) {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.post('/episodes/add-character', request, { headers });
    }
}
