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

type SongChannel = {
    id: string
    channel: string
    type: string
    link_embed: string
    link: string
    is_main: boolean
}

type SongTheme = {
    type: string
    sequence: number
    episodes: string
}

type SongArtist = {
    id: string
    name: string
    image: string
}

export type GetSongByAnimeIdResponseSongDetail = {
    id: string
    name: string
    image: string
    description: string
    year: string
    themes: SongTheme[]
    anime_id: string
    song_artist: SongArtist[]
    song_channel: SongChannel[] | null
}

export type GetSongByAnimeIdResponse = {
    opening_song: GetSongByAnimeIdResponseSongDetail[]
    ending_song: GetSongByAnimeIdResponseSongDetail[]
    soundtrack_song: GetSongByAnimeIdResponseSongDetail[]
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

export type SpotifyTrackCandidate = {
    spotify_id: string
    name: string
    artists: string[]
    album: string
    duration_ms: number
    preview_url: string
}

export type MigrateSpotifySongResponse = {
    song_id: string
    song_name: string
    spotify_track_id?: string
    status: 'mapped' | 'candidates'
    candidates?: SpotifyTrackCandidate[]
}

export type ConfirmSpotifySongRequest = {
    song_id: string
    spotify_track_id: string
}