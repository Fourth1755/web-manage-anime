import axios from "axios";
const animeUrl = 'http://localhost:8080/animes'
const authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZvdXJ0aEBnbWFpbC5jb20iLCJleHAiOjE3MjQzODI0NjgsInJvbGUiOiJhZG1pbiJ9._bebvw7Um7F2Fi6Qzi8pHCRrU9mmmjX1xBXUh4EP5y8'

type CreateAnimeData = {
    id: number;
    name: string;
    seasonal: string;
    year: string;
    episodes: number
};

export async function getAnimes() {
    const response = await axios.get(animeUrl, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": authorization
        },
    })
    return response.data
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
