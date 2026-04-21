import axios from "axios";
import { ConnectAnimapService } from "./builder";
import { CreateCategoryRequest, GetCategoryListResponse } from "./dtos/category";

export class CategoryService {
    private url: string;
    private connect: ConnectAnimapService;

    constructor() {
        this.connect = new ConnectAnimapService();
        this.url = this.connect.getCategoriesUrl();
    }

    private async getConfigHeaders() {
        return {
            "Content-Type": "application/json",
            "Authorization": await this.connect.getAuthorization(),
        };
    }

    public async getCategories(): Promise<GetCategoryListResponse[]> {
        const response = await axios.get(this.url, {
            headers: await this.getConfigHeaders(),
        });
        return response.data;
    }

    public async createCategory(category: CreateCategoryRequest) {
        const response = await axios.post(this.url, category, {
            headers: await this.getConfigHeaders(),
        });
        return response.data;
    }
}
