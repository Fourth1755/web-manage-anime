'use server'

import { revalidatePath } from 'next/cache'
import { SongService } from "@/app/api/songs";
import { CreateAnimeSongForAnimeRequest } from '@/app/api/dtos/song';
import { ArtistSerivce } from '@/app/api/artist';

export type CreateSongResult =
    | { success: true; message: string }
    | { success: false; error: string }

type ApiError = {
    response?: { data?: { message?: string } }
    message?: string
}

export async function createSong(animeId: string, song: CreateAnimeSongForAnimeRequest): Promise<CreateSongResult> {
    const songService = new SongService()
    try {
        const response = await songService.createSongForAnime(animeId, song)
        revalidatePath(`/anime/${animeId}`)
        return { success: true, message: response.message ?? 'Song created successfully' }
    } catch (error: unknown) {
        const apiError = error as ApiError
        return {
            success: false,
            error: apiError.response?.data?.message ?? apiError.message ?? 'Unable to create song',
        }
    }
}

export async function getAllArtist() {
    const artistService = new ArtistSerivce()
    return artistService.getArtists(1, 100)
}
