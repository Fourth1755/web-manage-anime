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
        const animes = new Map<string, GetAnimeList>();
        let page = 1;
        let totalPages = 1;
        do {
            const response = await service.getAnimesByMalRange(start, end, page);
            for (const anime of response.animes) animes.set(anime.id, anime);
            totalPages = response.total_pages ?? 1;
            page++;
        } while (page <= totalPages);
        return { success: true, alreadyExists, animes: Array.from(animes.values()) };
    } catch {
        return { success: true, alreadyExists, resultsError: "Migration completed, but the results could not be loaded." };
    }
}
