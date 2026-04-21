import axios from "axios";
import { ConnectAnimapService } from "./builder";
import { AddCharacterToEpisodeRequest, CreateEpisodeRequest, GetEpisodeByAnimeResponse, UpdateEpisodeRequest } from "./dtos/episode";

export class EpisodeService {
    private url: string;
    private connect: ConnectAnimapService;

    constructor() {
        this.connect = new ConnectAnimapService();
        this.url = this.connect.getEpisodeUrl();
    }

    private async getConfigHeaders() {
        return {
            "Content-Type": "application/json",
            "Authorization": await this.connect.getAuthorization(),
        };
    }

    public async getEpisode(anime_id: string, filter: string): Promise<GetEpisodeByAnimeResponse> {
        const response = await axios.get(`${this.url}/${anime_id}?filter=${filter}`, {
            headers: await this.getConfigHeaders(),
        });
        return response.data;
    }

    public async createEpisode(request: CreateEpisodeRequest) {
        const response = await axios.post(`${this.url}`, request, {
            headers: await this.getConfigHeaders(),
        });
        return response;
    }

    public async updateEpisode(request: UpdateEpisodeRequest) {
        const response = await axios.put(`${this.url}`, request, {
            headers: await this.getConfigHeaders(),
        });
        return response;
    }

    public async addCharacterToEpisode(request: AddCharacterToEpisodeRequest) {
        const response = await axios.post(`${this.url}/add-character`, request, {
            headers: await this.getConfigHeaders(),
        });
        return response;
    }
}
