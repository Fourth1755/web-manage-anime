import apiClient from './apiClient';
import { CreateAnimeSongRequest, CreateSongChannelRequest, GetAllSongResponse, GetSongByAnimeIdResponse, GetSongsByArtistResponse } from './dtos/song';

export class SongService {
    public async getSongs(): Promise<GetAllSongResponse[]> {
        return apiClient.get('/songs') as unknown as Promise<GetAllSongResponse[]>;
    }

    public async createSong(song: CreateAnimeSongRequest) {
        return apiClient.post('/songs', song);
    }

    public async getSongByAnime(anime_id: string): Promise<GetSongByAnimeIdResponse> {
        return apiClient.get(`/songs/anime/${anime_id}`) as unknown as Promise<GetSongByAnimeIdResponse>;
    }

    public async getSongsByArtist(artist_id: string): Promise<GetSongsByArtistResponse> {
        return apiClient.get(`/songs/artist/${artist_id}`) as unknown as Promise<GetSongsByArtistResponse>;
    }

    public async createSongChannel(request: CreateSongChannelRequest) {
        return apiClient.post('/songs/channel', request);
    }
}
