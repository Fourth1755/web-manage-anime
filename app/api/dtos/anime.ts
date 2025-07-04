export type GetAnimeList = {
    id: string;
    name: string;
    year: string;
    score: string;
    seasonal: string;
    image: string;
}

type GetAnimeByIdResponseCategories = {
    id:string
    name:string
}

type GetAnimeByIdResponseStudios = {
    id:string
    name:string
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
    categoryUniverse:GetAnimeByIdResponseCategories[]
    aired_at: string
}

export type EditCategoryAnimeRequest = {
    anime_id: string
    category_ids: string[]
}

export type EditCategoryUniversesAnimeRequest = {
    anime_id: string
    category_universe_ids: string[]
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