'use server'

import { revalidatePath } from 'next/cache'
import { ArtistSerivce } from '@/app/api/artist'

export type MigrateResult = { success: boolean; error?: string }

export async function migrateArtistSpotify(artist_id: string): Promise<MigrateResult> {
    try {
        const artistService = new ArtistSerivce()
        await artistService.migrateSpotify(artist_id)
        revalidatePath('/artist')
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error?.response?.data?.message ?? 'Migration failed' }
    }
}
