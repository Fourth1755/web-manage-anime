'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { EditCategoryAnimeRequest, EditCategoryUniversesAnimeRequest } from '@/app/api/dtos/anime';
import { AnimeService } from '@/app/api/anime';

export async function editCategoryAnime(params:EditCategoryAnimeRequest) {
    const animeService = new AnimeService()
    await animeService.editCategoryAnime(params)
    revalidatePath('/anime') // Update cached posts
}

export async function editCategoryUniverseAnime(params:EditCategoryUniversesAnimeRequest) {
    const animeService = new AnimeService()
    await animeService.editCategoryUniverseAnime(params)
    revalidatePath('/anime') // Update cached posts
}
