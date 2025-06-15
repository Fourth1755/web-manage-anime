'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { EpisodeService } from '@/app/api/episode';
import { UpdateEpisodeRequest } from '@/app/api/dtos/episode';

export async function updateEpisode(request:UpdateEpisodeRequest,animeId :string) {
    const episodeService = new EpisodeService()
    try{
        const res = await episodeService.updateEpisode(request)
        revalidatePath('/anime/'+animeId) 
        return res.data.message
    } catch(error:any) {
        return error.response.data.message
    }
    
}