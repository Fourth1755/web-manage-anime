import apiClient, { getAuthCookie } from './apiClient';
import { CreateCategoryRequest, GetCategoryListResponse } from './dtos/category';

export class CategoryService {
    public async getCategories(): Promise<GetCategoryListResponse[]> {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.get('/category', { headers }) as unknown as Promise<GetCategoryListResponse[]>;
    }

    public async createCategory(category: CreateCategoryRequest) {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.post('/category', category, { headers });
    }
}
