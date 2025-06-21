'use server'

import { revalidatePath } from 'next/cache'
import { SongService } from '@/app/api/songs';
import { CreateSongChannelRequest } from '@/app/api/dtos/song';

export async function createSongChannel(request:CreateSongChannelRequest) {
    const songService = new SongService()
    try{
        const res = await songService.createSongChannel(request)
        revalidatePath('/artist')
        return res.data.message
    } catch(error:any) {
        return error.response.data.message
    }
}
