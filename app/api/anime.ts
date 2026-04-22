import apiClient from './apiClient';
import { CreateAnimeRequest, EditCategoryAnimeRequest, EditCategoryUniversesAnimeRequest, GetAnimeByIdResponse, GetAnimesResponse, UpdateAnimeRequest } from './dtos/anime';

export class AnimeService {
    public async createAnime(anime: CreateAnimeRequest) {
        return apiClient.post('/animes', anime);
    }

    public async getAnimes(page = 1, limit = 10): Promise<GetAnimesResponse> {
        return apiClient.get('/animes', { params: { page, limit } }) as unknown as Promise<GetAnimesResponse>;
    }

    public async getAnimeById(id: string): Promise<GetAnimeByIdResponse> {
        return apiClient.get(`/animes/${id}`) as unknown as Promise<GetAnimeByIdResponse>;
    }

    public async updateAnime(anime: UpdateAnimeRequest) {
        return apiClient.put(`/animes/${anime.id}`, anime);
    }

    public async editCategoryAnime(request: EditCategoryAnimeRequest) {
        return apiClient.put('/animes/category/edit-category-anime', request);
    }

    public async editCategoryUniverseAnime(request: EditCategoryUniversesAnimeRequest) {
        return apiClient.put('/animes/category-universe/edit-category-universe-anime', request);
    }
}
