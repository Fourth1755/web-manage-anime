import axios from "axios";
const animeUrl = 'http://localhost:8080/animes'
const authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZvdXJ0aEBnbWFpbC5jb20iLCJleHAiOjE3MjQ4MzI0MjAsInJvbGUiOiJhZG1pbiJ9.puBrLutqxUtoSjLhC7c3nDTKRgahyueMTPOl_gwDPkk'

type CreateAnimeData = {
    id: number;
    name: string;
    seasonal: string;
    year: string;
    episodes: number
};

type AnimeDetailCategories = {
    id:number
    name:string
}

type AnimeDetailSongs = {
    id:number
    name:string
    type:number
    sequence:number
}

type AnimeDetail = {
    id: number,
    name: string,
    name_english:string
    year: string,
    score: string,
    seasonal: string
    episodes: number
    image:string
    description:string
    type:number
    duration:string
    categories:AnimeDetailCategories[]
    opening:AnimeDetailSongs[]
    ending:AnimeDetailSongs[]
    soundtrack:AnimeDetailSongs[]
}

export async function createAnime(anime: CreateAnimeData) {
    const response = await axios.post(animeUrl, anime, { 
        headers: { 
            "Content-Type": "application/json", 
            "Authorization": authorization
        },
    })
    return response.data
}

export async function getAnimes() {
    const response = await axios.get(animeUrl, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": authorization
        },
    })
    return response.data
}

export async function getAnime(id:number):Promise<AnimeDetail>{
    const response = await axios.get(`${animeUrl}/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": authorization
        },
    })
    return response.data
}
