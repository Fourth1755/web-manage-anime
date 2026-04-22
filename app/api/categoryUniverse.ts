import apiClient from './apiClient';
import { GetCategoryListResponse } from './dtos/category';

export class CategoryUniverseService {
    public async getCategoryUniverse(): Promise<GetCategoryListResponse[]> {
        return apiClient.get('/category-universe') as unknown as Promise<GetCategoryListResponse[]>;
    }
}
