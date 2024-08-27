'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createAnimeAPI, updateAnimeAPI } from '@/app/api/anime';

type AnimeData = {
    id: number;
    name: string;
    name_english: string
    episodes: number
    seasonal: string;
    image: string
    description: string
    duration: string
    year: string;
    type: number
};

export async function createAnime(anime: AnimeData) {
    //   try {
    //     // Call database
    //   } catch (error) {
    //     // Handle errors
    //   }
    await createAnimeAPI(anime)
    //await updateAnimeAPI(anime)
    revalidatePath('/anime') // Update cached posts
    redirect(`/anime`) // Navigate to the new post page
}


export async function updateAnime(anime: AnimeData) {
      try {
        // Call database
        await updateAnimeAPI(anime)
      } catch (error) {
        // Handle errors
        console.error(error)
      }
    
    revalidatePath('/anime') // Update cached posts
    redirect(`/anime`) // Navigate to the new post page
}