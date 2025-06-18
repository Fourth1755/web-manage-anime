'use server'

import { revalidatePath } from 'next/cache'
import { SongService } from "@/app/api/songs";
import { CreateAnimeSongRequest } from '@/app/api/dtos/song';
import { ArtistSerivce } from '@/app/api/artist';

export async function createSong(song: CreateAnimeSongRequest) {
    const songSerivce = new SongService()
    try{
        const res = await songSerivce.createSong(song)
        revalidatePath('/anime')
        return res.data.message
    } catch(error:any) {
        return error.response.data.message
    }
}

export async function getAllArtist() {
    const artistSerivce = new ArtistSerivce()
    try{
        const res = await artistSerivce.getArtists()
        return res
    } catch(error:any) {
        return error.response.data.message
    }
}