type GetArtistListResponseArtist = {
    id: number
    name:string
    image:string
    description: string
    record_label:string
    is_music_band: boolean
}
export type GetArtistListResponse = {
    artists: GetArtistListResponseArtist[]
}
