import apiClient from './apiClient';
import { CreateCharacterRequest, GetCharacterByAnimeIdResponse } from './dtos/character';

export class CharacterService {
    public async getCharacterByAnimeId(anime_id: string): Promise<GetCharacterByAnimeIdResponse> {
        return apiClient.get(`/characters/${anime_id}`) as unknown as Promise<GetCharacterByAnimeIdResponse>;
    }

    public async createCharacter(request: CreateCharacterRequest) {
        return apiClient.post('/characters', request);
    }
}
