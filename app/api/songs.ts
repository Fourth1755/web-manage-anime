import apiClient, { getAuthCookie } from './apiClient';
import { ConfirmSpotifySongRequest, CreateAnimeSongRequest, CreateSongChannelRequest, GetAllSongResponse, GetSongByAnimeIdResponse, GetSongsByArtistResponse, MigrateSpotifySongResponse } from './dtos/song';

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
        return apiClient.get(`/admin/songs/anime/${anime_id}`, { headers }) as unknown as Promise<GetSongByAnimeIdResponse>;
    }

    public async getSongsByArtist(artist_id: string): Promise<GetSongsByArtistResponse> {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.get(`/songs/artist/${artist_id}`, { headers }) as unknown as Promise<GetSongsByArtistResponse>;
    }

    public async createSongChannel(request: CreateSongChannelRequest) {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.post('/admin/songs/channel', request, { headers });
    }

    public async migrateAnimeSongs(my_anime_list_id: number) {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.post('/admin/migrate/anime-songs', { my_anime_list_id }, { headers });
    }

    public async revertMigrateAnimeSongs(my_anime_list_id: number) {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.delete('/admin/migrate/anime-songs', { headers, data: { my_anime_list_id } });
    }

    public async migrateSpotifySong(song_id: string): Promise<MigrateSpotifySongResponse> {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.post('/admin/migrate/spotify-song', { song_id }, { headers }) as unknown as Promise<MigrateSpotifySongResponse>;
    }

    public async confirmSpotifySong(request: ConfirmSpotifySongRequest) {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.post('/admin/migrate/spotify-song/confirm', request, { headers });
    }
}
