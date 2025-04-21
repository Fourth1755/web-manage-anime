"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { AnimeService } from "@/app/api/anime";
import { CreateAnimeRequest, UpdateAnimeRequest } from "@/app/api/dtos/anime";

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
    // Call database
    await animeSerivce.updateAnime(anime);
  } catch (error) {
    // Handle errors
    console.error(error);
  }

  revalidatePath("/anime"); // Update cached posts
  redirect(`/anime`); // Navigate to the new post page
}
