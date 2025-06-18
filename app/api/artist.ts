import axios from "axios"
import { ConnectAnimapService } from "./builder"
import { GetArtistListResponse } from "./dtos/artist"


export class ArtistSerivce{
    private url:string
    private authorization: string
    
    constructor(){
        const connectAnimap = new ConnectAnimapService()
        this.url = connectAnimap.getArtistUrl();
        this.authorization = connectAnimap.getAuthorization()
    }

    private getConfigHeaders(){
        return{
            "Content-Type": "application/json",
            "Authorization": this.authorization
        }
    }

    public async getArtists() :Promise<GetArtistListResponse>{
        const response = await axios.get(this.url, {
            headers: this.getConfigHeaders(),
        })
        return response.data
    }
}