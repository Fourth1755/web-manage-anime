export type GetArtistResponse = {
    id: string
    name:string
    image:string
    description: string
    record_label:string
    is_music_band: boolean
    race_one: string
    race_two: string
    date_of_birth: string
}

type GetArtistListResponseArtist = {
    id: string
    name:string
    image:string
    description: string
    record_label:string
    is_music_band: boolean
}

export type GetArtistListResponse = {
    artists: GetArtistListResponseArtist[]
}

export type CreateArtistRequest = {
    name:string
    name_japan: string
    first_name: string
    last_name: string
    first_name_japan: string
    last_name_japan: string
    image:string
    description: string
    record_label:string
    is_music_band: boolean
    race_one: string
    race_two: string
    date_of_birth: string
}