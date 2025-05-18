'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { SongService } from "@/app/api/songs";
import { EditCategoryAnimeRequest, EditCategoryUniversesAnimeRequest } from '@/app/api/dtos/anime';
import { AnimeService } from '@/app/api/anime';
import { CreateAnimeSongRequest } from '@/app/api/dtos/song';

export async function createSong(song: CreateAnimeSongRequest) {
    //   try {
    //     // Call database
    //   } catch (error) {
    //     // Handle errors
    //   }
    const songSerivce = new SongService()
    await songSerivce.createSong(song)
    revalidatePath('/anime') // Update cached posts
    redirect(`/anime`) // Navigate to the new post page
}

export async function editCategoryAnime(params:EditCategoryAnimeRequest) {
    const animeService = new AnimeService()
    await animeService.editCategoryAnime(params)
    revalidatePath('/anime') // Update cached posts
    redirect(`/anime`) // Navigate to the new post page
}

export async function editCategoryUniverseAnime(params:EditCategoryUniversesAnimeRequest) {
    const animeService = new AnimeService()
    await animeService.editCategoryUniverseAnime(params)
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