'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { SongSerivce } from "@/app/api/songs";

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

export async function createSong(song: CreateAnimeSongData) {
    //   try {
    //     // Call database
    //   } catch (error) {
    //     // Handle errors
    //   }
    const songSerivce = new SongSerivce()
    await songSerivce.createSongAPI(song)
    revalidatePath('/song') // Update cached posts
    redirect(`/song`) // Navigate to the new post page
}


// export async function updateAnime(anime: AnimeData) {
//       try {
//         // Call database
//         await updateAnimeAPI(anime)
//       } catch (error) {
//         // Handle errors
//         console.error(error)
//       }
    
//     revalidatePath('/song') // Update cached posts
//     redirect(`/song`) // Navigate to the new post page
// }