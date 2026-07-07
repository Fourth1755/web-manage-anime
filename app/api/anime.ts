import apiClient, { getAuthCookie } from './apiClient';
import { AnilistTrailerSettingResponse, CreateAnimeRequest, CreateAnimeTrailersRequest, EditCategoryAnimeRequest, EditCategoryUniversesAnimeRequest, GetAnimeByIdResponse, GetAnimeTrailersResponse, GetAnimesResponse, MigrateMultipleAnimeRequest, MigrateSingleAnimeRequest, UpdateAnilistTrailerSettingRequest, UpdateAnimeRequest } from './dtos/anime';

export class AnimeService {
    public async createAnime(anime: CreateAnimeRequest) {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.post('/admin/animes', anime, { headers });
    }

    public async getAnimes(page = 1, limit = 10, sortBy?: string, orderBy?: string, name?: string): Promise<GetAnimesResponse> {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.get('/admin/animes', { params: { page, limit, sortBy, orderBy, name }, headers }) as unknown as Promise<GetAnimesResponse>;
    }

    public async getAnimeById(id: string): Promise<GetAnimeByIdResponse> {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.get(`/admin/animes/${id}`, { headers }) as unknown as Promise<GetAnimeByIdResponse>;
    }

    public async getAnimeTrailers(id: string): Promise<GetAnimeTrailersResponse> {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.get(`/admin/animes/trailer/${id}`, { headers }) as unknown as Promise<GetAnimeTrailersResponse>;
    }

    public async updateAnime(anime: UpdateAnimeRequest) {
        const headers = { Cookie: await getAuthCookie() };
        const { id, ...body } = anime;
        return apiClient.put(`/admin/animes/${id}`, body, { headers });
    }

    public async createAnimeTrailers(request: CreateAnimeTrailersRequest) {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.post('/admin/animes/trailers', request, { headers });
    }

    public async editCategoryAnime(request: EditCategoryAnimeRequest) {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.put('/admin/animes/category/edit-category-anime', request, { headers });
    }

    public async editCategoryUniverseAnime(request: EditCategoryUniversesAnimeRequest) {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.put('/admin/animes/category-universe/edit-category-universe-anime', request, { headers });
    }

    public async migrateSingleAnime(request: MigrateSingleAnimeRequest) {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.post('/admin/migrate/anime', request, { headers });
    }

    public async migrateMultipleAnime(request: MigrateMultipleAnimeRequest) {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.post('/admin/migrate/animes', request, { headers });
    }

    public async updateAnilistTrailerSetting(id: string, request: UpdateAnilistTrailerSettingRequest): Promise<AnilistTrailerSettingResponse> {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.put(`/admin/animes/${id}/anilist-trailer`, request, { headers }) as unknown as Promise<AnilistTrailerSettingResponse>;
    }
}
