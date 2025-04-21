export type CreateAnimeSongRequest = {
    id: string;
    name: string;
    image: string;
    description: string;
    year: string;
    type: number;
    anime_id: string;
    song_channel: {
        channel: number
        type: number
        link: string
    }[],
    artist_list: string[]
}

type SongChannel ={
    id:string
    channel: number
    type:number
    link:string
    is_main:number
}

export type GetSongByAnimeIdResponseSongDetail = {
    id:string
    name:string
    type:number
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