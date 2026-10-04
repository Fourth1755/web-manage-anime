'use server'

import { isAxiosError } from 'axios'
import { revalidatePath } from 'next/cache'
import { SongService } from '@/app/api/songs'
import type { CreateArtistSongRequest } from '@/app/api/dtos/song'

export type CreateArtistSongResult =
    | { success: true; message: string }
    | { success: false; error: string }

export async function createArtistSong(artistId: string, song: CreateArtistSongRequest): Promise<CreateArtistSongResult> {
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidPattern.test(artistId) || artistId === '00000000-0000-0000-0000-000000000000') {
        return { success: false, error: 'Invalid artist.' }
    }
    if (typeof song?.name !== 'string' || !song.name.trim()) {
        return { success: false, error: 'Song name is required.' }
    }
    if (typeof song.is_anime_song !== 'boolean') {
        return { success: false, error: 'Select whether this is an anime song.' }
    }
    try {
        await new SongService().createSongForArtist(artistId, {
            name: song.name.trim(),
            is_anime_song: song.is_anime_song,
        })
        revalidatePath(`/artist/${artistId}`)
        revalidatePath('/song')
        return { success: true, message: 'Song created successfully.' }
    } catch (error: unknown) {
        return {
            success: false,
            error: isAxiosError<{ message?: string }>(error)
                ? error.response?.data?.message || 'Unable to create song. Please try again.'
                : 'Unable to create song. Please try again.',
        }
    }
}
