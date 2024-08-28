import axios from "axios";
import { ConnectAnimapService } from "./builder";

type CreateAnimeData = {
    id: number;
    name: string;
    name_english: string
    episodes: number
    seasonal: string;
    image: string
    description: string
    duration: string
    year: string;
    type: number
};

type AnimeDetailCategories = {
    id:number
    name:string
}

type AnimeDetail = {
    id: number,
    name: string,
    name_english:string
    year: string,
    score: string,
    seasonal: string
    episodes: number
    image:string
    description:string
    type:number
    duration:string
    categories:AnimeDetailCategories[]
}
export class AnimeSerivce{
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

    public async createAnimeAPI(anime: CreateAnimeData) {
        const response = await axios.post(this.url, anime, { 
            headers: this.getConfigHeaders(),
        })
        return response.data
    }

    public async getAnimesAPI() {
        const response = await axios.get(this.url, {
            headers: this.getConfigHeaders(),
        })
        return response.data
    }

    public async getAnimeAPI(id:number):Promise<AnimeDetail>{
        const response = await axios.get(`${this.url}/${id}`, {
            headers: this.getConfigHeaders(),
        })
        return response.data
    }

    public async updateAnimeAPI(anime: CreateAnimeData){
        const response = await axios.put(`${this.url}/${anime.id}`, anime,{
            headers: this.getConfigHeaders(),
        })
        return response.data
    }
}