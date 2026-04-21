import axios from "axios";
import { ConnectAnimapService } from "./builder";
import { CreateArtistRequest, GetArtistListResponse, GetArtistResponse } from "./dtos/artist";

export class ArtistSerivce {
    private url: string;
    private connect: ConnectAnimapService;

    constructor() {
        this.connect = new ConnectAnimapService();
        this.url = this.connect.getUrl();
    }

    private async getConfigHeaders() {
        return {
            "Content-Type": "application/json",
            "Authorization": await this.connect.getAuthorization(),
        };
    }

    public async getArtist(id: string): Promise<GetArtistResponse> {
        const response = await axios.get(`${this.url}/artists/${id}`, {
            headers: await this.getConfigHeaders(),
        });
        return response.data;
    }

    public async getArtists(): Promise<GetArtistListResponse> {
        const response = await axios.get(`${this.url}/artists`, {
            headers: await this.getConfigHeaders(),
        });
        return response.data;
    }

    public async createArtist(request: CreateArtistRequest) {
        const response = await axios.post(`${this.url}/artists`, request, {
            headers: await this.getConfigHeaders(),
        });
        return response;
    }
}
