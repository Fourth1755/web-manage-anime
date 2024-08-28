import axios from "axios";
import { ConnectAnimapService } from "./builder";

type CreateAnimeSongData = {
    id: number;
    name: string;
    image: string;
    description: string;
    year: string;
    type: number;
    anime_id: number;
    song_channel: {
        channel: number
        type: number
        link: string
    }[],
}

type SongChannel ={
    id:number
    channel: number
    type:number
    link:string
    is_main:number
}

type SongDetail = {
    id:number
    name:string
    type:number
    sequence:number
    song_channel:SongChannel[]
}

type AnimeSongsDetail= {
    opening_song:SongDetail[]
    ending_song:SongDetail[]
    soundtrack_song:SongDetail[]
}
export class SongSerivce{
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

    public async getSongs() {
        const response = await axios.get(this.url, {
            headers: this.getConfigHeaders()
        })
        return response.data
    }

    public async createSongAPI(song: CreateAnimeSongData) {
        const response = await axios.post(this.url, song, { 
            headers: this.getConfigHeaders(),
        })
        return response.data
    }

    public async getSongByAnime(anime_id:number):Promise<AnimeSongsDetail> {
        const response = await axios.get(`${this.url}/anime/${anime_id}`, {
            headers: this.getConfigHeaders(),
        })
        return response.data
    }
}
