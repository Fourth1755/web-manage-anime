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
    page: number
    limit: number
    total_pages: number
    total_items: number
}

export type SpotifyArtistCandidate = {
    spotify_id: string
    name: string
    followers: number
    genres: string[]
    popularity: number
    image_url: string
}

export type MigrateSpotifyArtistResponse = {
    artist_id: string
    artist_name: string
    spotify_artist_id?: string
    status: 'mapped' | 'candidates'
    candidates?: SpotifyArtistCandidate[]
}

export type ConfirmSpotifyArtistRequest = {
    artist_id: string
    spotify_artist_id: string
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