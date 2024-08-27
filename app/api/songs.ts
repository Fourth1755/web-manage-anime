import axios from "axios";

const animeUrl = 'http://localhost:8080/songs'
const authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZvdXJ0aEBnbWFpbC5jb20iLCJleHAiOjE3MjQzODI0NjgsInJvbGUiOiJhZG1pbiJ9._bebvw7Um7F2Fi6Qzi8pHCRrU9mmmjX1xBXUh4EP5y8'

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
    opening:SongDetail[]
    ending:SongDetail[]
    soundtrack:SongDetail[]
}

export async function getSongs() {
    const response = await axios.get(animeUrl, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": authorization
        },
    })
    return response.data
}

export async function createSong(song: CreateAnimeSongData) {
    const response = await axios.post(animeUrl, song, { 
        headers: { 
            "Content-Type": "application/json", 
            "Authorization": authorization
        },
    })
    return response.data
}

export async function getSongByAnime(anime_id:number):Promise<AnimeSongsDetail> {
    const response = await axios.get(`${animeUrl}/anime/${anime_id}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": authorization
        },
    })
    return response.data
}