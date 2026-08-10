import apiClient, { getAuthCookie } from './apiClient';
import { CreateTierTemplateRequest, GetTierTemplatePaginatedResponse } from './dtos/tierTemplate';

export class TierTemplateService {
    public async getTierTemplates(): Promise<GetTierTemplatePaginatedResponse> {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.get('/admin/tier-templates', { headers }) as unknown as Promise<GetTierTemplatePaginatedResponse>;
    }

    public async createTierTemplate(request: CreateTierTemplateRequest) {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.post('/admin/tier-templates', request, { headers });
    }
}
