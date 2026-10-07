import apiClient, { getAuthCookie } from './apiClient';
import { SuggestedAnimeSettings, TierSuggestedAnimeResponse } from './dtos/tierSuggestedAnime';

const path = '/admin/tier-suggested-animes';

export class TierSuggestedAnimeService {
    public async list(): Promise<TierSuggestedAnimeResponse> {
        return apiClient.get(path, { headers: { Cookie: await getAuthCookie() } }) as unknown as Promise<TierSuggestedAnimeResponse>;
    }

    public async create(animeID: string, settings: SuggestedAnimeSettings) {
        return apiClient.post(path, { anime_id: animeID, ...settings }, { headers: { Cookie: await getAuthCookie() } });
    }

    public async update(animeID: string, settings: SuggestedAnimeSettings) {
        return apiClient.put(`${path}/${encodeURIComponent(animeID)}`, settings, { headers: { Cookie: await getAuthCookie() } });
    }

    public async remove(animeID: string) {
        return apiClient.delete(`${path}/${encodeURIComponent(animeID)}`, { headers: { Cookie: await getAuthCookie() } });
    }
}
