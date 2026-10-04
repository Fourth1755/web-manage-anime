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

export type GetArtistListResponseArtist = {
    id: string
    spotify_artist_id?: string | null
    name_japan?: string
    name:string
    image:string
    description: string
    record_label:string
    is_music_band: boolean
}

export type MergeArtistsRequest = {
    source_artist_id: string
    target_artist_id: string
}

export type MergeArtistsResponse = MergeArtistsRequest & {
    moved_songs: number
    already_linked_songs: number
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
