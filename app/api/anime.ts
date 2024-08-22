import axios from "axios";
import { headers } from "next/headers";
const animeUrl = 'http://localhost:8080/animes'

type CreateAnimeData = {
    id: number;
    name: string;
    seasonal: string;
    year: string;
    episodes: number
};

export async function getAnimes() {
    const response = await axios(animeUrl, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZvdXJ0aEBnbWFpbC5jb20iLCJleHAiOjE3MjQzODI0NjgsInJvbGUiOiJhZG1pbiJ9._bebvw7Um7F2Fi6Qzi8pHCRrU9mmmjX1xBXUh4EP5y8"
        },
    })
    return response.data
}

export async function createAnime(anime: CreateAnimeData) {
    const response = await fetch(animeUrl,{
        method:"POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZvdXJ0aEBnbWFpbC5jb20iLCJleHAiOjE3MjQzODI0NjgsInJvbGUiOiJhZG1pbiJ9._bebvw7Um7F2Fi6Qzi8pHCRrU9mmmjX1xBXUh4EP5y8"
          },
          body: JSON.stringify(anime),
    })
    if(!response.ok){
        throw new Error('cannot fetch anime')
    }

    // const response = await axios.post(animeUrl, anime, { headers: { "Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZvdXJ0aEBnbWFpbC5jb20iLCJleHAiOjE3MjQzODI0NjgsInJvbGUiOiJhZG1pbiJ9._bebvw7Um7F2Fi6Qzi8pHCRrU9mmmjX1xBXUh4EP5y8" } })
    //     .then(function (response) {
    //         // handle success
    //         console.log(response);
    //     })
    //     .catch(function (error) {
    //         // handle error
    //         console.log(error);
    //     })
    //     .finally(function () {
    //         // always executed
    //     });
    return response.json()
}