'use server'

import { isAxiosError } from 'axios'
import { revalidatePath } from 'next/cache'
import { ArtistSerivce } from '@/app/api/artist'
import type { GetArtistListResponse, MergeArtistsResponse } from '@/app/api/dtos/artist'

type Result<T> = { success: true; data: T } | { success: false; error: string }

function errorMessage(error: unknown, fallback: string): string {
    if (isAxiosError<{ message?: string }>(error)) {
        return error.response?.data?.message || fallback
    }
    return fallback
}

export async function searchMergeArtists(name: string, page = 1): Promise<Result<GetArtistListResponse>> {
    if (!name.trim()) return { success: false, error: 'Enter an artist name to search.' }
    try {
        const data = await new ArtistSerivce().getArtists(Math.max(1, page), 10, name)
        return { success: true, data }
    } catch (error: unknown) {
        return { success: false, error: errorMessage(error, 'Could not search artists. Please try again.') }
    }
}

export async function mergeArtists(sourceId: string, targetId: string): Promise<Result<MergeArtistsResponse>> {
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    const zeroId = '00000000-0000-0000-0000-000000000000'
    if (!uuidPattern.test(sourceId) || !uuidPattern.test(targetId) || sourceId === zeroId || targetId === zeroId || sourceId.toLowerCase() === targetId.toLowerCase()) {
        return { success: false, error: 'Select two different artists to merge.' }
    }
    try {
        const data = await new ArtistSerivce().mergeArtists({ source_artist_id: sourceId, target_artist_id: targetId })
        revalidatePath('/artist')
        revalidatePath(`/artist/${sourceId}`)
        revalidatePath(`/artist/${targetId}`)
        revalidatePath('/song')
        return { success: true, data }
    } catch (error: unknown) {
        return { success: false, error: errorMessage(error, 'Could not merge artists. Check the artist list before retrying.') }
    }
}
