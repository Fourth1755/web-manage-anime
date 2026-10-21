"use server";

import { revalidatePath } from "next/cache";
import { AnimeService } from "@/app/api/anime";
import { GetAnimeList } from "@/app/api/dtos/anime";

export type MigrationResult = {
    success: boolean;
    alreadyExists?: boolean;
    animes?: GetAnimeList[];
    error?: string;
    resultsError?: string;
};

export async function setAnimeVisibility(id: string, malId: number, isShow: boolean): Promise<{ success: boolean; error?: string }> {
    if (typeof id !== "string" || !/^[a-zA-Z0-9-]+$/.test(id) || !Number.isSafeInteger(malId) || malId < 1 || typeof isShow !== "boolean") {
        return { success: false, error: "Invalid anime visibility request." };
    }
    try {
        await new AnimeService().updateAnime({ id, is_show: isShow });
        revalidatePath("/anime");
        revalidatePath(`/anime/${malId}`);
        return { success: true };
    } catch {
        return { success: false, error: "Unable to update visibility. Please try again." };
    }
}

export async function migrateAnime(mode: "single" | "multiple", start: number, end: number): Promise<MigrationResult> {
    if ((mode !== "single" && mode !== "multiple") || !Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 1 || end < start || (mode === "single" && start !== end)) {
        return { success: false, error: "Enter positive MAL IDs with End MAL ID greater than or equal to Start MAL ID." };
    }
    const service = new AnimeService();
    let alreadyExists = false;
    try {
        if (mode === "single") {
            const response = await service.migrateSingleAnime({ my_anime_list_id: start });
            alreadyExists = (response as unknown as { status?: string })?.status === "already had data";
        } else {
            await service.migrateMultipleAnime({ start_anime_id: start, end_anime_id: end });
        }
    } catch {
        return { success: false, error: "Migration failed. Please check the service and try again." };
    }
    revalidatePath("/anime");
    // Only query the range after the migration request has completed successfully.
    try {
        return { success: true, alreadyExists, animes: await fetchAnimeRange(service, start, end) };
    } catch {
        return { success: true, alreadyExists, resultsError: "Migration completed, but the results could not be loaded." };
    }
}

export async function loadMigratedAnime(start: number, end: number): Promise<MigrationResult> {
    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 1 || end < start) {
        return { success: false, error: "Enter a valid MAL ID range." };
    }
    try {
        return { success: true, animes: await fetchAnimeRange(new AnimeService(), start, end) };
    } catch {
        return { success: false, error: "Unable to load anime from the saved MAL ID range. Please reload the page to try again." };
    }
}

async function fetchAnimeRange(service: AnimeService, start: number, end: number): Promise<GetAnimeList[]> {
    const animes = new Map<string, GetAnimeList>();
    let page = 1;
    let totalPages = 1;
    do {
        const response = await service.getAnimesByMalRange(start, end, page);
        for (const anime of response.animes) animes.set(anime.id, anime);
        totalPages = response.total_pages ?? 1;
        page++;
    } while (page <= totalPages);
    const results = Array.from(animes.values());
    // Bound fallback requests when older list responses omit visibility.
    for (let offset = 0; offset < results.length; offset += 10) {
        await Promise.all(results.slice(offset, offset + 10).map(async (anime, index) => {
            if (typeof anime.is_show === "boolean") return;
            try {
                const detail = await service.getAnimeById(String(anime.my_anime_list_id));
                results[offset + index] = { ...anime, is_show: detail.is_show };
            } catch {
                // Keep the anime visible in results; its toggle remains unavailable.
            }
        }));
    }
    return results;
}
