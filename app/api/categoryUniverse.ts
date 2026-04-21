import axios from "axios";
import { ConnectAnimapService } from "./builder";
import { GetCategoryListResponse } from "./dtos/category";

export class CategoryUniverseService {
    private url: string;
    private connect: ConnectAnimapService;

    constructor() {
        this.connect = new ConnectAnimapService();
        this.url = this.connect.getCategoryUniverseUrl();
    }

    private async getConfigHeaders() {
        return {
            "Content-Type": "application/json",
            "Authorization": await this.connect.getAuthorization(),
        };
    }

    public async getCategoryUniverse(): Promise<GetCategoryListResponse[]> {
        const response = await axios.get(this.url, {
            headers: await this.getConfigHeaders(),
        });
        return response.data;
    }
}
