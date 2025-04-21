import axios from "axios";
import { ConnectAnimapService } from "./builder";
import { CreateAnimeSongRequest, GetAllSongResponse, GetSongByAnimeIdResponse } from "./dtos/song";

export class SongService{
    private url:string
    private authorization: string
    
    constructor(){
        const connectAnimap = new ConnectAnimapService()
        this.url = connectAnimap.getSongsUrl();
        this.authorization = connectAnimap.getAuthorization()
    }

    private getConfigHeaders(){
        return{
            "Content-Type": "application/json",
            "Authorization": this.authorization
        }
    }

    public async getSongs():Promise<GetAllSongResponse[]> {
        const response = await axios.get(this.url, {
            headers: this.getConfigHeaders()
        })
        return response.data
    }

    public async createSong(song: CreateAnimeSongRequest) {
        const response = await axios.post(this.url, song, { 
            headers: this.getConfigHeaders(),
        })
        return response.data
    }

    public async getSongByAnime(anime_id:string):Promise<GetSongByAnimeIdResponse> {
        const response = await axios.get(`${this.url}/anime/${anime_id}`, {
            headers: this.getConfigHeaders(),
        })
        return response.data
    }
}
