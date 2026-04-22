import apiClient, { getAuthCookie } from './apiClient';
import { GetCategoryListResponse } from './dtos/category';

export class CategoryUniverseService {
    public async getCategoryUniverse(): Promise<GetCategoryListResponse[]> {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.get('/category-universe', { headers }) as unknown as Promise<GetCategoryListResponse[]>;
    }
}
