"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { AnimeService } from "@/app/api/anime";
import { StudioService } from "@/app/api/studio";
import { CreateAnimeRequest, UpdateAnimeRequest } from "@/app/api/dtos/anime";
import { GetStudioResponse } from "@/app/api/dtos/studio";

export type MigrateResult = { success: boolean; alreadyExists?: boolean; error?: string };

type AnimeData = {
  id: number;
  name: string;
  name_english: string;
  episodes: number;
  seasonal: string;
  image: string;
  description: string;
  duration: string;
  year: string;
  type: number;
};

export async function createAnime(anime: CreateAnimeRequest) {
  const animeSerivce = new AnimeService();
  try {
    // Call database
    await animeSerivce.createAnime(anime);
  } catch (error) {
    // Handle errors
    console.error(error);
  }
  revalidatePath("/anime"); // Update cached posts
  redirect(`/anime`); // Navigate to the new post page
}

export async function updateAnime(anime: UpdateAnimeRequest) {
  const animeSerivce = new AnimeService();
  try {
    await animeSerivce.updateAnime(anime);
  } catch (error) {
    console.error(error);
  }

  revalidatePath("/anime");
  redirect(`/anime`);
}

export async function getStudios(): Promise<GetStudioResponse[]> {
  const studioService = new StudioService();
  return studioService.getStudio();
}

export async function migrateSingleAnime(my_anime_list_id: number): Promise<MigrateResult> {
  try {
    const animeService = new AnimeService();
    const data: any = await animeService.migrateSingleAnime({ my_anime_list_id });
    if (data?.status === "already had data") {
      return { success: true, alreadyExists: true };
    }
    revalidatePath("/anime");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.response?.data?.message ?? "Migration failed" };
  }
}

export async function migrateMultipleAnime(start_anime_id: number, end_anime_id: number): Promise<MigrateResult> {
  try {
    const animeService = new AnimeService();
    await animeService.migrateMultipleAnime({ start_anime_id, end_anime_id });
    revalidatePath("/anime");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.response?.data?.message ?? "Migration failed" };
  }
}
