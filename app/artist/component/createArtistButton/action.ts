'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { EditCategoryAnimeRequest, EditCategoryUniversesAnimeRequest } from '@/app/api/dtos/anime';
import { AnimeService } from '@/app/api/anime';
import { ArtistSerivce } from '@/app/api/artist';
import { CreateArtistRequest } from '@/app/api/dtos/artist';

export async function createArtist(request:CreateArtistRequest) {
    const artistSerivce = new ArtistSerivce()
    try{
        const res = await artistSerivce.createArtist(request)
        revalidatePath('/artist')
        return res.data.message
    } catch(error:any) {
        return error.response.data.message
    }
}
