import axios from "axios";
import { ConnectAnimapService } from "./builder";
import { AddCharacterToEpisodeRequest, CreateEpisodeRequest, GetEpisodeByAnimeResponse, UpdateEpisodeRequest } from "./dtos/episode";

export class EpisodeService {
    private url:string
    private authorization: string
    
    constructor(){
        const connectAnimap = new ConnectAnimapService()
        this.url = connectAnimap.getEpisodeUrl();
        this.authorization = connectAnimap.getAuthorization()
    }

    private getConfigHeaders(){
        return{
            "Content-Type": "application/json",
            "Authorization": this.authorization
        }
    }

    public async getEpisode(anime_id: string, filter: string) :Promise<GetEpisodeByAnimeResponse> {
        const response = await axios.get(`${this.url}/${anime_id}?filter=${filter}`, {
            headers: this.getConfigHeaders()
        })
        return response.data
    }

    public async createEpisode(request: CreateEpisodeRequest)  {
        const response = await axios.post(`${this.url}`,request, {
            headers: this.getConfigHeaders()
        })
        return response
    }

    public async updateEpisode(request: UpdateEpisodeRequest)  {
        const response = await axios.put(`${this.url}`,request, {
            headers: this.getConfigHeaders()
        })
        return response
    }

    public async addCharacterToEpisode(request: AddCharacterToEpisodeRequest)  {
        const response = await axios.post(`${this.url}/add-character`,request, {
            headers: this.getConfigHeaders()
        })
        return response
    }
}