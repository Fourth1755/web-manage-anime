export type GetAnimeList = {
    id: string;
    name: string;
    name_thai: string;
    year: string;
    score: string;
    seasonal: string;
    image: string;
    my_anime_list_id: number;
    aired_at: string;
    status: string;
}

type GetAnimeByIdResponseCategories = {
    id:string
    name:string
}

type GetAnimeByIdResponseStudios = {
    id:string
    name:string
}

export type GetAnimesResponse = {
    animes: GetAnimeList[]
    page: number
    limit: number
    total_pages: number
    total_items: number
}

export type GetAnimeByIdResponse = {
    id: string;
    name: string;
    name_english: string
    name_thai: string
    episodes: number
    seasonal: string;
    image: string
    studios: GetAnimeByIdResponseStudios[];
    description: string
    duration: string
    year: string;
    type: number
    wallpaper: string
    trailer: string
    categories:GetAnimeByIdResponseCategories[]
    category_universe:GetAnimeByIdResponseCategories[]
    aired_at: string
    my_anime_list_id: number
    is_migrate_anime_song: boolean
}

export type AnimeTrailerRequest = {
    name: string
    video_id?: string
    url: string
}

export type CreateAnimeTrailersRequest = {
    anime_id: string
    trailers: AnimeTrailerRequest[]
}

export type GetAnimeTrailerItem = {
    id: string
    name: string
    anime_id: string
    video_id: string
    url: string
    embed_url: string
}

export type GetAnimeTrailersResponse =
    | GetAnimeTrailerItem[]
    | {
        trailers?: GetAnimeTrailerItem[]
        data?: GetAnimeTrailerItem[]
    }

export type EditCategoryAnimeRequest = {
    anime_id: string
    category_ids: string[]
}

export type EditCategoryUniversesAnimeRequest = {
    anime_id: string
    category_universe_id: string
}

export type CreateAnimeRequest = {
    // id: string;
    name: string;
    name_english: string
    name_thai: string
    episodes: number
    seasonal: string;
    image: string
    description: string
    duration: string
    year: string;
    type: number
    aired_at: string
};

export type UpdateAnimeRequest = {
    id: string;
    name_thai?: string;
    description?: string;
    is_sub_anime?: boolean;
    is_show?: boolean;
    status?: string;
};

export type MigrateSingleAnimeRequest = {
    my_anime_list_id: number;
};

export type MigrateMultipleAnimeRequest = {
    start_anime_id: number;
    end_anime_id: number;
};

export type UpdateAnilistTrailerSettingRequest = {
    is_active: boolean;
};

export type AnilistTrailerSettingResponse = {
    key: string;
    is_active: boolean;
};
