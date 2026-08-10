import apiClient, { getAuthCookie } from './apiClient';
import { DeleteUserRequest, GetUserListResponse } from './dtos/user';

export class UserService {
    public async getUsers(page = 1, limit = 20, search = ''): Promise<GetUserListResponse> {
        const headers = { Cookie: await getAuthCookie() };
        const params: Record<string, string | number> = { page, limit };

        if (search.trim()) {
            params.search = search.trim();
        }

        return apiClient.get('/admin/users', { params, headers }) as unknown as Promise<GetUserListResponse>;
    }

    public async deleteUser(request: DeleteUserRequest) {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.delete(`/admin/users/${encodeURIComponent(request.id)}`, { headers });
    }
}
