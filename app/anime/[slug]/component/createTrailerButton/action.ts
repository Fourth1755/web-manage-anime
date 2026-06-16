'use server'

import { revalidatePath } from 'next/cache'
import { AnimeService } from '@/app/api/anime'
import { CreateAnimeTrailersRequest } from '@/app/api/dtos/anime'

export async function createAnimeTrailers(request: CreateAnimeTrailersRequest, animeId: string) {
    const animeService = new AnimeService()

    try {
        const response = await animeService.createAnimeTrailers(request)
        revalidatePath('/anime')
        revalidatePath(`/anime/${animeId}`)
        return response?.data?.message ?? 'Create trailers success'
    } catch (error: any) {
        return error?.response?.data?.message ?? 'Create trailers failed'
    }
}
