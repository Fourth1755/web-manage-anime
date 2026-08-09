export type User = {
    id?: string;
    uuid?: string;
    email: string;
    name?: string | null;
    username?: string | null;
    role?: string | null;
    created_at?: string | null;
};

export type GetUserListResponse = {
    users: User[];
    page?: number;
    limit?: number;
    total_pages?: number;
    total_items?: number;
};
