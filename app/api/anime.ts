import apiClient, { getAuthCookie } from './apiClient';
import { CreateAnimeRequest, EditCategoryAnimeRequest, EditCategoryUniversesAnimeRequest, GetAnimeByIdResponse, GetAnimesResponse, UpdateAnimeRequest } from './dtos/anime';

export class AnimeService {
    public async createAnime(anime: CreateAnimeRequest) {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.post('/admin/animes', anime, { headers });
    }

    public async getAnimes(page = 1, limit = 10): Promise<GetAnimesResponse> {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.get('/admin/animes', { params: { page, limit }, headers }) as unknown as Promise<GetAnimesResponse>;
    }

    public async getAnimeById(id: string): Promise<GetAnimeByIdResponse> {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.get(`/admin/animes/${id}`, { headers }) as unknown as Promise<GetAnimeByIdResponse>;
    }

    public async updateAnime(anime: UpdateAnimeRequest) {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.put(`/admin/animes/${anime.id}`, anime, { headers });
    }

    public async editCategoryAnime(request: EditCategoryAnimeRequest) {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.put('/admin/animes/category/edit-category-anime', request, { headers });
    }

    public async editCategoryUniverseAnime(request: EditCategoryUniversesAnimeRequest) {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.put('/admin/animes/category-universe/edit-category-universe-anime', request, { headers });
    }
}
