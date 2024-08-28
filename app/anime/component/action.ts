"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { AnimeSerivce } from "@/app/api/anime";

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

export async function createAnime(anime: AnimeData) {
  const animeSerivce = new AnimeSerivce();
  try {
    // Call database
    await animeSerivce.createAnimeAPI(anime);
  } catch (error) {
    // Handle errors
    console.error(error);
  }
  revalidatePath("/anime"); // Update cached posts
  redirect(`/anime`); // Navigate to the new post page
}

export async function updateAnime(anime: AnimeData) {
  const animeSerivce = new AnimeSerivce();
  try {
    // Call database
    await animeSerivce.updateAnimeAPI(anime);
  } catch (error) {
    // Handle errors
    console.error(error);
  }

  revalidatePath("/anime"); // Update cached posts
  redirect(`/anime`); // Navigate to the new post page
}
