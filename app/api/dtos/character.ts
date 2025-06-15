export type GetCharacterByAnimeIdResponseCharacter = { 
    id: string
    name: string
    full_name: string
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