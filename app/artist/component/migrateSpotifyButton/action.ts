'use server'

import { revalidatePath } from 'next/cache'
import { ArtistSerivce } from '@/app/api/artist'
import { SpotifyArtistCandidate } from '@/app/api/dtos/artist'

export type SimpleResult = { success: boolean; error?: string }

export type MigrateSpotifyResult = {
    success: boolean
    error?: string
    status?: 'mapped' | 'candidates'
    artist_id?: string
    candidates?: SpotifyArtistCandidate[]
}

export async function migrateArtistSpotify(artist_id: string): Promise<MigrateSpotifyResult> {
    try {
        const artistService = new ArtistSerivce()
        const data = await artistService.migrateSpotify(artist_id)
        if (data.status === 'mapped') {
            revalidatePath('/artist')
        }
        return {
            success: true,
            status: data.status,
            artist_id: data.artist_id,
            candidates: data.candidates,
        }
    } catch (error: any) {
        return { success: false, error: error?.response?.data?.message ?? 'Migration failed' }
    }
}

export async function confirmSpotifyArtist(artist_id: string, spotify_artist_id: string): Promise<SimpleResult> {
    try {
        const artistService = new ArtistSerivce()
        await artistService.confirmSpotifyArtist({ artist_id, spotify_artist_id })
        revalidatePath('/artist')
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error?.response?.data?.message ?? 'Confirm failed' }
    }
}
