import apiClient, { getAuthCookie } from './apiClient';
import { CreateCategoryUniverseRequest, GetCategoryListResponse } from './dtos/category';

export class CategoryUniverseService {
    public async getCategoryUniverse(): Promise<GetCategoryListResponse[]> {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.get('/category-universe', { headers }) as unknown as Promise<GetCategoryListResponse[]>;
    }

    public async createCategoryUniverse(categoryUniverse: CreateCategoryUniverseRequest) {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.post('/category-universe', categoryUniverse, { headers });
    }
}
