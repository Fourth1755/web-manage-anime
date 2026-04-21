'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { EditCategoryAnimeRequest, EditCategoryUniversesAnimeRequest } from '@/app/api/dtos/anime';
import { AnimeService } from '@/app/api/anime';
import { CategoryService } from '@/app/api/category';
import { CategoryUniverseService } from '@/app/api/categoryUniverse';
import { CharacterService } from '@/app/api/character';
import { GetCategoryListResponse } from '@/app/api/dtos/category';
import { GetCharacterByAnimeIdResponse } from '@/app/api/dtos/character';

export async function editCategoryAnime(params:EditCategoryAnimeRequest) {
    const animeService = new AnimeService()
    await animeService.editCategoryAnime(params)
    revalidatePath('/anime') // Update cached posts
}

export async function editCategoryUniverseAnime(params:EditCategoryUniversesAnimeRequest) {
    const animeService = new AnimeService()
    await animeService.editCategoryUniverseAnime(params)
    revalidatePath('/anime')
}

export async function getCategories(): Promise<GetCategoryListResponse[]> {
    const categoryService = new CategoryService()
    return categoryService.getCategories()
}

export async function getCategoryUniverses(): Promise<GetCategoryListResponse[]> {
    const categoryUniverseService = new CategoryUniverseService()
    return categoryUniverseService.getCategoryUniverse()
}

export async function getCharactersByAnime(anime_id: string): Promise<GetCharacterByAnimeIdResponse> {
    const characterService = new CharacterService()
    return characterService.getCharacterByAnimeId(anime_id)
}
