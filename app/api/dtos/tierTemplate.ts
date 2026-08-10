export type TierTemplateRank = Record<string, unknown>;

export type CreateTierTemplateRank = {
    name: string;
    color: string;
};

export type CreateTierTemplateRequest = {
    name: string;
    type: string;
    created_by: string;
    image: string;
    status: string;
    visibility: string;
    ranks: CreateTierTemplateRank[];
    item_ids: string[];
    is_from_anime_category: boolean;
    category_universe_id: string;
};

export type GetTierTemplateResponse = {
    id: string;
    name: string;
    type: string;
    created_by: string;
    image: string;
    status: string;
    visibility: string;
    version: number;
    is_from_anime_category: boolean;
    category_universe_id: string;
    played_count: number;
    ranks: TierTemplateRank[];
    item_ids: string[];
    total_item: number;
    is_play: boolean;
    created_at: string;
};

export type GetTierTemplatePaginatedResponse = {
    data: GetTierTemplateResponse[];
};
