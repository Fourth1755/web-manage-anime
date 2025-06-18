'use server'
import { AddCharacterToEpisodeRequest } from "@/app/api/dtos/episode"
import { EpisodeService } from "@/app/api/episode"
import { revalidatePath } from 'next/cache'

export async function addCharacterToEpisode(request:AddCharacterToEpisodeRequest,animeId :string) {
    const episodeService = new EpisodeService()
    try{
        const res = await episodeService.addCharacterToEpisode(request)
        revalidatePath('/anime/'+animeId) 
        console.log(res.data.message)
        return res.data.message
    } catch(error:any) {
        return error.response.data.message
    }
    
}