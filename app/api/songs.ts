import axios from "axios";
import { ConnectAnimapService } from "./builder";
import { CreateAnimeSongRequest, CreateSongChannelRequest, GetAllSongResponse, GetSongByAnimeIdResponse, GetSongsByArtistResponse } from "./dtos/song";

export class SongService{
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

    public async getSongs():Promise<GetAllSongResponse[]> {
        const response = await axios.get(`${this.url}/songs`, {
            headers: this.getConfigHeaders()
        })
        return response.data
    }

    public async createSong(song: CreateAnimeSongRequest) {
        const response = await axios.post(`${this.url}/songs`, song, { 
            headers: this.getConfigHeaders(),
        })
        return response
    }

    public async getSongByAnime(anime_id:string):Promise<GetSongByAnimeIdResponse> {
        const response = await axios.get(`${this.url}/songs/anime/${anime_id}`, {
            headers: this.getConfigHeaders(),
        })
        return response.data
    }

    public async getSongsByArtist(artist_id:string):Promise<GetSongsByArtistResponse> {
        const response = await axios.get(`${this.url}/songs/artist/${artist_id}`, {
            headers: this.getConfigHeaders(),
        })
        return response.data
    }

    public async createSongChannel(request:CreateSongChannelRequest) {
        const response = await axios.post(`${this.url}/songs/channel`,request, {
            headers: this.getConfigHeaders(),
        })
        return response
    }
}
