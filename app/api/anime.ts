import axios from "axios";
import { ConnectAnimapService } from "./builder";
import { CreateAnimeRequest, EditCategoryAnimeRequest, EditCategoryUniversesAnimeRequest, GetAnimeByIdResponse, GetAnimeList, GetAnimesResponse, UpdateAnimeRequest } from "./dtos/anime";

export class AnimeService {
    private url: string;
    private connect: ConnectAnimapService;

    constructor() {
        this.connect = new ConnectAnimapService();
        this.url = this.connect.getAnimesUrl();
    }

    private async getConfigHeaders() {
        return {
            "Content-Type": "application/json",
            "Authorization": await this.connect.getAuthorization(),
        };
    }

    public async createAnime(anime: CreateAnimeRequest) {
        const response = await axios.post(this.url, anime, {
            headers: await this.getConfigHeaders(),
        });
        return response.data;
    }

    public async getAnimes(): Promise<GetAnimesResponse> {
        const response = await axios.get(this.url, {
            headers: await this.getConfigHeaders(),
        });
        return response.data;
    }

    public async getAnimeById(id: string): Promise<GetAnimeByIdResponse> {
        const response = await axios.get(`${this.url}/${id}`, {
            headers: await this.getConfigHeaders(),
        });
        return response.data;
    }

    public async updateAnime(anime: UpdateAnimeRequest) {
        const response = await axios.put(`${this.url}/${anime.id}`, anime, {
            headers: await this.getConfigHeaders(),
        });
        return response.data;
    }

    public async editCategoryAnime(request: EditCategoryAnimeRequest) {
        const response = await axios.put(`${this.url}/category/edit-category-anime`, request, {
            headers: await this.getConfigHeaders(),
        });
        return response.data;
    }

    public async editCategoryUniverseAnime(request: EditCategoryUniversesAnimeRequest) {
        const response = await axios.put(`${this.url}/category-universe/edit-category-universe-anime`, request, {
            headers: await this.getConfigHeaders(),
        });
        return response.data;
    }
}
