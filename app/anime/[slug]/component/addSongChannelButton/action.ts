'use server'

import { revalidatePath } from 'next/cache'
import { SongService } from '@/app/api/songs'
import { CreateSongChannelRequest } from '@/app/api/dtos/song'

export async function createSongChannel(request: CreateSongChannelRequest, anime_id: string) {
    const songService = new SongService()
    try {
        const res = await songService.createSongChannel(request)
        revalidatePath(`/anime/${anime_id}`)
        return res.data.message
    } catch (error: any) {
        return error?.response?.data?.message ?? error?.message ?? 'Something went wrong'
    }
}
