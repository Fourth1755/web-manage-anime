import apiClient, { getAuthCookie } from './apiClient';
import { CreateCharacterRequest, GetCharacterByAnimeIdResponse } from './dtos/character';

export class CharacterService {
    public async getCharacterByAnimeId(anime_id: string): Promise<GetCharacterByAnimeIdResponse> {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.get(`/characters/${anime_id}`, { headers }) as unknown as Promise<GetCharacterByAnimeIdResponse>;
    }

    public async createCharacter(request: CreateCharacterRequest) {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.post('/characters', request, { headers });
    }
}
