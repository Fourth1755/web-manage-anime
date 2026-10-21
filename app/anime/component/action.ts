"use server";

import { revalidatePath } from "next/cache";
import { AnimeService } from "@/app/api/anime";
import { StudioService } from "@/app/api/studio";
import { AnilistEpisodeSettingResponse, AnilistTrailerSettingResponse, CreateAnimeRequest, UpdateAnimeAniListEpisodeRequest, UpdateAnilistTrailerSettingRequest, UpdateAnimeRequest } from "@/app/api/dtos/anime";
import { GetStudioResponse } from "@/app/api/dtos/studio";


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
}

export async function updateAnime(anime: UpdateAnimeRequest) {
  const animeSerivce = new AnimeService();
  try {
    await animeSerivce.updateAnime(anime);
  } catch (error) {
    console.error(error);
  }

  revalidatePath("/anime");
}

export async function getStudios(): Promise<GetStudioResponse[]> {
  const studioService = new StudioService();
  return studioService.getStudio();
}

export async function updateAnilistTrailerSetting(
  animeId: string,
  request: UpdateAnilistTrailerSettingRequest
): Promise<{ success: boolean; data?: AnilistTrailerSettingResponse; error?: string }> {
  try {
    const animeService = new AnimeService();
    const data = await animeService.updateAnilistTrailerSetting(animeId, request);
    revalidatePath("/anime");
    revalidatePath(`/anime/${animeId}`);
    return { success: true, data };
  } catch (error: any) {
    return {
      success: false,
      error: error?.response?.data?.message ?? "Failed to update AniList trailer setting",
    };
  }
}

export async function updateAnilistEpisodeSetting(
  animeId: string,
  request: UpdateAnimeAniListEpisodeRequest
): Promise<{ success: boolean; data?: AnilistEpisodeSettingResponse; error?: string }> {
  try {
    const animeService = new AnimeService();
    const data = await animeService.updateAnilistEpisodeSetting(animeId, request);
    revalidatePath("/anime");
    revalidatePath(`/anime/${animeId}`);
    return { success: true, data };
  } catch (error: any) {
    return {
      success: false,
      error: error?.response?.data?.message ?? "Failed to update AniList episode setting",
    };
  }
}
