import axios from "axios";
import { ConnectAnimapService } from "./builder";
import { CreateAnimeRequest, EditCategoryAnimeRequest, EditCategoryUniversesAnimeRequest, GetAnimeByIdResponse, GetAnimeList, UpdateAnimeRequest } from "./dtos/anime";


export class AnimeService{
    private url:string
    private authorization: string
    
    constructor(){
        const connectAnimap = new ConnectAnimapService()
        this.url = connectAnimap.getAnimesUrl();
        this.authorization = connectAnimap.getAuthorization()
    }

    private getConfigHeaders(){
        return{
            "Content-Type": "application/json",
            "Authorization": this.authorization
        }
    }

    public async createAnime(anime: CreateAnimeRequest) {
        const response = await axios.post(this.url, anime, { 
            headers: this.getConfigHeaders(),
        })
        return response.data
    }

    public async getAnimes():Promise<GetAnimeList[]> {
        const response = await axios.get(this.url, {
            headers: this.getConfigHeaders(),
        })
        return response.data
    }

    public async getAnimeById(id:string):Promise<GetAnimeByIdResponse>{
        const response = await axios.get(`${this.url}/${id}`, {
            headers: this.getConfigHeaders(),
        })
        return response.data
    }

    public async updateAnime(anime: UpdateAnimeRequest) {
        const response = await axios.put(`${this.url}/${anime.id}`, anime,{
            headers: this.getConfigHeaders(),
        })
        return response.data
    }

    public async editCategoryAnime(request: EditCategoryAnimeRequest) {
        const response = await axios.put(`${this.url}/category/edit-category-anime`, request,{
            headers: this.getConfigHeaders(),
        })
        return response.data
    }

    public async editCategoryUniverseAnime(request: EditCategoryUniversesAnimeRequest) {
        const response = await axios.put(`${this.url}/category-universe/edit-category-universe-anime`, request,{
            headers: this.getConfigHeaders(),
        })
        return response.data
    }
}