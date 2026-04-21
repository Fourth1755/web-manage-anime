import axios from "axios";
import { ConnectAnimapService } from "./builder";
import { CreateCharacterRequest, GetCharacterByAnimeIdResponse } from "./dtos/character";

export class CharacterService {
    private url: string;
    private connect: ConnectAnimapService;

    constructor() {
        this.connect = new ConnectAnimapService();
        this.url = this.connect.getCharacterUrl();
    }

    private async getConfigHeaders() {
        return {
            "Content-Type": "application/json",
            "Authorization": await this.connect.getAuthorization(),
        };
    }

    public async getCharacterByAnimeId(anime_id: string): Promise<GetCharacterByAnimeIdResponse> {
        const response = await axios.get(`${this.url}/${anime_id}`, {
            headers: await this.getConfigHeaders(),
        });
        return response.data;
    }

    public async createCharacter(request: CreateCharacterRequest) {
        const response = await axios.post(`${this.url}`, request, {
            headers: await this.getConfigHeaders(),
        });
        return response;
    }
}
