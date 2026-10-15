import apiClient, { getAuthCookie } from './apiClient';
import { CreateTierTemplateRequest, GetTierTemplatePaginatedResponse, PresignTierTemplateImageRequest, PresignTierTemplateImageResponse } from './dtos/tierTemplate';

export class TierTemplateService {
    public async presignImageUpload(request: PresignTierTemplateImageRequest): Promise<PresignTierTemplateImageResponse> {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.post('/admin/tier-templates/presign-url', request, { headers }) as unknown as Promise<PresignTierTemplateImageResponse>;
    }

    public async getTierTemplates(): Promise<GetTierTemplatePaginatedResponse> {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.get('/admin/tier-templates', { headers }) as unknown as Promise<GetTierTemplatePaginatedResponse>;
    }

    public async createTierTemplate(request: CreateTierTemplateRequest) {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.post('/admin/tier-templates', request, { headers });
    }
}
