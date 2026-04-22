import apiClient, { getAuthCookie } from './apiClient';
import { CreateAnimeSongRequest, CreateSongChannelRequest, GetAllSongResponse, GetSongByAnimeIdResponse, GetSongsByArtistResponse } from './dtos/song';

export class SongService {
    public async getSongs(): Promise<GetAllSongResponse[]> {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.get('/songs', { headers }) as unknown as Promise<GetAllSongResponse[]>;
    }

    public async createSong(song: CreateAnimeSongRequest) {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.post('/songs', song, { headers });
    }

    public async getSongByAnime(anime_id: string): Promise<GetSongByAnimeIdResponse> {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.get(`/songs/anime/${anime_id}`, { headers }) as unknown as Promise<GetSongByAnimeIdResponse>;
    }

    public async getSongsByArtist(artist_id: string): Promise<GetSongsByArtistResponse> {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.get(`/songs/artist/${artist_id}`, { headers }) as unknown as Promise<GetSongsByArtistResponse>;
    }

    public async createSongChannel(request: CreateSongChannelRequest) {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.post('/songs/channel', request, { headers });
    }
}
