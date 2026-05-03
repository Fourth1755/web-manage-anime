'use server'

import { revalidatePath } from 'next/cache'
import { SongService } from '@/app/api/songs'
import { SpotifyTrackCandidate } from '@/app/api/dtos/song'

export type SimpleResult = { success: boolean; error?: string }

export type MigrateSpotifySongResult = {
    success: boolean
    error?: string
    status?: 'mapped' | 'candidates'
    song_id?: string
    candidates?: SpotifyTrackCandidate[]
}

export async function migrateSpotifySong(song_id: string, anime_id: string): Promise<MigrateSpotifySongResult> {
    try {
        const songService = new SongService()
        const data = await songService.migrateSpotifySong(song_id)
        if (data.status === 'mapped') {
            revalidatePath(`/anime/${anime_id}`)
        }
        return {
            success: true,
            status: data.status,
            song_id: data.song_id,
            candidates: data.candidates,
        }
    } catch (error: any) {
        return { success: false, error: error?.response?.data?.message ?? 'Migration failed' }
    }
}

export async function confirmSpotifySong(song_id: string, spotify_track_id: string, anime_id: string): Promise<SimpleResult> {
    try {
        const songService = new SongService()
        await songService.confirmSpotifySong({ song_id, spotify_track_id })
        revalidatePath(`/anime/${anime_id}`)
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error?.response?.data?.message ?? 'Confirm failed' }
    }
}
