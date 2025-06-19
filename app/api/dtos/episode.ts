type GetEpisodeByAnimeResponseCharacters = {
    id: string
    name: string
    full_name: string
    image: string
    first_appearance: boolean
    appearance: boolean
}

type GetEpisodeByAnimeResponseEpisode = {
    id: string
    number: number
    name: string
    name_thai: string
    name_english: string
    name_japan: string
    characters: GetEpisodeByAnimeResponseCharacters[]
}

export type GetEpisodeByAnimeResponse = {
    episodes: GetEpisodeByAnimeResponseEpisode[]
}

export type CreateEpisodeRequest = {
    anime_id: string
}

export type UpdateEpisodeRequest = {
    id: string
    name: string
    name_thai: string
    name_english: string
    name_japan: string
}

type AddCharacterToEpisodeRequestCharacter = {
    id: string
    description: string
    first_appearance: boolean
    appearance:boolean
}

export type AddCharacterToEpisodeRequest = {
    episode_id: string
    characters: AddCharacterToEpisodeRequestCharacter[]
}