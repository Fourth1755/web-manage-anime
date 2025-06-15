export type GetCharacterByAnimeIdResponseCharacter = { 
    id: string
    name: string
    full_name: string
    name_thai: string
    full_name_thai: string
    full_name_japan: string
    image: string
    image_style_x: number
    image_style_y: number
    is_main_character: boolean
    description: string
}

export type GetCharacterByAnimeIdResponse = {
    character: GetCharacterByAnimeIdResponseCharacter[]
}

export type CreateCharacterRequest = {
    anime_id: string
    name: string
    first_name: string
    last_name: string
    name_thai: string
    first_name_thai: string
    last_name_thai: string
    first_name_japan: string
    last_name_japan: string
    image: string
    is_main_character: boolean
    description: string
}