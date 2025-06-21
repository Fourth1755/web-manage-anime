import axios from "axios"
import { ConnectAnimapService } from "./builder"
import { CreateArtistRequest, GetArtistListResponse, GetArtistResponse } from "./dtos/artist"


export class ArtistSerivce{
    private url:string
    private authorization: string
    
    constructor(){
        const connectAnimap = new ConnectAnimapService()
        this.url = connectAnimap.getUrl();
        this.authorization = connectAnimap.getAuthorization()
    }

    private getConfigHeaders(){
        return{
            "Content-Type": "application/json",
            "Authorization": this.authorization
        }
    }

    public async getArtist(id:string) :Promise<GetArtistResponse>{
        const response = await axios.get(`${this.url}/artists/${id}`, {
            headers: this.getConfigHeaders(),
        })
        return response.data
    }

    public async getArtists() :Promise<GetArtistListResponse>{
        const response = await axios.get(`${this.url}/artists`, {
            headers: this.getConfigHeaders(),
        })
        return response.data
    }

    public async createArtist(request:CreateArtistRequest) {
        const response = await axios.post(`${this.url}/artists`,request, {
            headers: this.getConfigHeaders(),
        })
        return response
    }
}