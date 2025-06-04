type GetEpisodeByAnimeResponseEpisode = {
    id: string
    number: number
    name: string
    name_thai: string
    name_english: string
}

export type GetEpisodeByAnimeResponse = {
    episodes: GetEpisodeByAnimeResponseEpisode[]
}

export type CreateEpisodeRequest = {
    anime_id: string
}