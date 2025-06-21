export type CreateAnimeSongRequestSongChannel = {
    channel: string
    type: string
    link: string
}

export type CreateAnimeSongRequest = {
    id: string;
    name: string;
    image: string;
    description: string;
    year: string;
    type: string;
    anime_id: string;
    song_channel: CreateAnimeSongRequestSongChannel[]
    artist_list: string[]
}

type SongChannel ={
    id:string
    channel: string
    type:string
    link:string
    is_main:boolean
}

export type GetSongByAnimeIdResponseSongDetail = {
    id:string
    name:string
    type:string
    sequence:number
    song_channel:SongChannel[]
}

export type GetSongByAnimeIdResponse= {
    opening_song:GetSongByAnimeIdResponseSongDetail[]
    ending_song:GetSongByAnimeIdResponseSongDetail[]
    soundtrack_song:GetSongByAnimeIdResponseSongDetail[]
}

export type GetAllSongResponse ={
    id: string
    name: string,
    image: string,
    description: string,
    year: string,
    type: string,
    sequence: number,
    anime_id: string,
    anime_name: string,
}
type GetSongsByArtistResponseSong = {
    id:string
    name:string
    image: string
    year: string
    description: string
    anime_name: string
    type:string
    sequence:number
    song_channel:SongChannel[]
}

export type GetSongsByArtistResponse = {
    songs: GetSongsByArtistResponseSong[]
}

export type CreateSongChannelRequest = {
    song_id:string
    channel: string
    type:string
    link:string
    is_main:boolean
}