import axios from "axios";
import { ConnectAnimapService } from "./builder";
import { GetStudioResponse } from "./dtos/studio";

export class StudioService {
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

    public async getStudio(): Promise<GetStudioResponse[]> {
        const response = await axios.get(`${this.url}/studios`, {
            headers: await this.getConfigHeaders(),
        });
        return response.data;
    }
}
