import apiClient from './apiClient';
import { CreateCategoryRequest, GetCategoryListResponse } from './dtos/category';

export class CategoryService {
    public async getCategories(): Promise<GetCategoryListResponse[]> {
        return apiClient.get('/category') as unknown as Promise<GetCategoryListResponse[]>;
    }

    public async createCategory(category: CreateCategoryRequest) {
        return apiClient.post('/category', category);
    }
}
