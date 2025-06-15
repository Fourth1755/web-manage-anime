'use server'
import { CharacterService } from "@/app/api/character"
import { CreateCharacterRequest } from "@/app/api/dtos/character"
import { revalidatePath } from 'next/cache'

export async function createCharacter(request:CreateCharacterRequest,animeId :string) {
    const characterService = new CharacterService()
    try{
        const res = await characterService.createCharacter(request)
        revalidatePath('/anime/'+animeId)
        console.log(res)
        return res.data.message
    } catch(error:any) {
        return error.response.data.message
    }
    
}