type CreateAnimeSongData = {
    id: number;
    name: string;
    image: string;
    description: string;
    year: string;
    type: number;
    anime_id: number;
    song_channel: {
        channel: number
        type: number
        link: string
    }[],
}

type SongChannel ={
    id:number
    channel: number
    type:number
    link:string
    is_main:number
}

type SongDetail = {
    id:number
    name:string
    type:number
    sequence:number
    song_channel:SongChannel[]
}

type AnimeSongsDetail= {
    opening_song:SongDetail[]
    ending_song:SongDetail[]
    soundtrack_song:SongDetail[]
}