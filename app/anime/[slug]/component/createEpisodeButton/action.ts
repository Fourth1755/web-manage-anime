'use server'

import { CreateEpisodeRequest } from "@/app/api/dtos/episode"
import { EpisodeService } from "@/app/api/episode"

export async function createEpisode(request: CreateEpisodeRequest) :Promise<string> {
    const episodeService = new EpisodeService()
    try{
        const res = await episodeService.createEpisode(request)
        return res.data.message
    } catch(error:any) {
        return error.response.data.message
    }
}
