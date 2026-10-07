'use server';

import { isAxiosError } from 'axios';
import { revalidatePath } from 'next/cache';
import { AnimeService } from '@/app/api/anime';
import { TierSuggestedAnimeService } from '@/app/api/tierSuggestedAnime';
import { SuggestedAnimeSettings } from '@/app/api/dtos/tierSuggestedAnime';

function errorMessage(error: unknown): string {
    if (isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 401 || status === 403) return 'Your admin session has expired. Please sign in again.';
        if (status && status < 500 && typeof error.response?.data?.message === 'string') return error.response.data.message;
    }
    return 'Unable to connect to the anime service. Please try again.';
}

export async function searchSuggestedAnime(name: string, page: number) {
    if (typeof name !== 'string' || !Number.isInteger(page) || page < 1) return { ok: false as const, error: 'Invalid search.' };
    try {
        const response = await new AnimeService().getAnimes(page, 20, undefined, undefined, name.trim());
        return { ok: true as const, animes: response.animes ?? [], totalPages: response.total_pages ?? 0 };
    } catch (error) {
        return { ok: false as const, error: errorMessage(error) };
    }
}

export async function saveSuggestedAnime(operation: 'create' | 'update' | 'delete', animeID: string, settings: SuggestedAnimeSettings) {
    if (!['create', 'update', 'delete'].includes(operation) || typeof animeID !== 'string' ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(animeID) ||
        !settings || !Number.isSafeInteger(settings.position) || settings.position < 0 || typeof settings.is_active !== 'boolean') {
        return { ok: false as const, error: 'Choose an anime and enter a nonnegative whole number for its position.' };
    }
    try {
        const service = new TierSuggestedAnimeService();
        if (operation === 'create') await service.create(animeID, settings);
        else if (operation === 'update') await service.update(animeID, settings);
        else await service.remove(animeID);
        revalidatePath('/tier-template/suggested-animes');
        return { ok: true as const };
    } catch (error) {
        return { ok: false as const, error: errorMessage(error) };
    }
}
