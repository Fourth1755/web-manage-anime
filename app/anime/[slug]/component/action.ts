'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { SongService } from "@/app/api/songs";
import { EditCategoryAnimeRequest } from '@/app/api/dtos/anime';
import { AnimeService } from '@/app/api/anime';

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
    const songSerivce = new SongService()
    await songSerivce.createSongAPI(song)
    revalidatePath('/anime') // Update cached posts
    redirect(`/anime`) // Navigate to the new post page
}

export async function editCategoryAnime(params:EditCategoryAnimeRequest) {
    const animeService = new AnimeService()
    await animeService.editCategoryAnime(params)
    revalidatePath('/anime') // Update cached posts
    redirect(`/anime`) // Navigate to the new post page
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