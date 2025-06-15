import axios from "axios";
import { ConnectAnimapService } from "./builder";
import { CreateEpisodeRequest, GetEpisodeByAnimeResponse, UpdateEpisodeRequest } from "./dtos/episode";
import { GetCharacterByAnimeIdResponse } from "./dtos/character";

export class CharacterService {
    private url:string
    private authorization: string
    
    constructor(){
        const connectAnimap = new ConnectAnimapService()
        this.url = connectAnimap.getCharacterUrl();
        this.authorization = connectAnimap.getAuthorization()
    }

    private getConfigHeaders(){
        return{
            "Content-Type": "application/json",
            "Authorization": this.authorization
        }
    }

    public async getCharacterByAnimeId(anime_id: string) :Promise<GetCharacterByAnimeIdResponse> {
        const response = await axios.get(`${this.url}/${anime_id}`, {
            headers: this.getConfigHeaders()
        })
        return response.data
    }
}