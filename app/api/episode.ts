import apiClient from './apiClient';
import { AddCharacterToEpisodeRequest, CreateEpisodeRequest, GetEpisodeByAnimeResponse, UpdateEpisodeRequest } from './dtos/episode';

export class EpisodeService {
    public async getEpisode(anime_id: string, filter: string): Promise<GetEpisodeByAnimeResponse> {
        return apiClient.get(`/episodes/${anime_id}`, { params: { filter } }) as unknown as Promise<GetEpisodeByAnimeResponse>;
    }

    public async createEpisode(request: CreateEpisodeRequest) {
        return apiClient.post('/episodes', request);
    }

    public async updateEpisode(request: UpdateEpisodeRequest) {
        return apiClient.put('/episodes', request);
    }

    public async addCharacterToEpisode(request: AddCharacterToEpisodeRequest) {
        return apiClient.post('/episodes/add-character', request);
    }
}
