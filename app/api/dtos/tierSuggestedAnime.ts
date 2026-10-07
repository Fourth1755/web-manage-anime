export type TierSuggestedAnime = {
    id: string;
    name: string;
    name_thai?: string;
    name_english?: string;
    image?: string;
    my_anime_list_id: number;
    position: number;
    is_active: boolean;
};

export type TierSuggestedAnimeResponse = { animes: TierSuggestedAnime[] };
export type SuggestedAnimeSettings = { position: number; is_active: boolean };
