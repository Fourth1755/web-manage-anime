import apiClient, { getAuthCookie } from './apiClient';
import { CreateArtistSongRequest, CreateArtistSongResponse, ConfirmSpotifySongRequest, CreateAnimeSongForAnimeRequest, CreateAnimeSongForAnimeResponse, CreateSongChannelRequest, CreateSongChannelResponse, GetAllSongResponse, GetSongByAnimeIdResponse, GetSongsByArtistResponse, MigrateAnimeSongsRequest, MigrateSpotifySongRequest, MigrateSpotifySongResponse, UpdateAnimeSongRequest, UpdateAnimeSongResponse } from './dtos/song';

export class SongService {
    public async createSongForArtist(artistId: string, song: CreateArtistSongRequest): Promise<CreateArtistSongResponse> {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.post(`/admin/artists/${artistId}/songs`, song, { headers }) as unknown as Promise<CreateArtistSongResponse>;
    }

    public async getSongs(): Promise<GetAllSongResponse[]> {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.get('/admin/songs', { headers }) as unknown as Promise<GetAllSongResponse[]>;
    }

    public async createSongForAnime(animeId: string, song: CreateAnimeSongForAnimeRequest): Promise<CreateAnimeSongForAnimeResponse> {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.post(`/admin/animes/${animeId}/songs`, song, { headers }) as unknown as Promise<CreateAnimeSongForAnimeResponse>;
    }

    public async updateSong(songId: string, song: UpdateAnimeSongRequest): Promise<UpdateAnimeSongResponse> {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.put(`/admin/songs/${songId}`, song, { headers }) as unknown as Promise<UpdateAnimeSongResponse>;
    }

    public async getSongByAnime(anime_id: string): Promise<GetSongByAnimeIdResponse> {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.get(`/admin/songs/anime/${anime_id}`, { headers }) as unknown as Promise<GetSongByAnimeIdResponse>;
    }

    public async getSongsByArtist(artist_id: string): Promise<GetSongsByArtistResponse> {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.get(`/admin/songs/artist/${artist_id}`, { headers }) as unknown as Promise<GetSongsByArtistResponse>;
    }

    public async createSongChannel(request: CreateSongChannelRequest): Promise<CreateSongChannelResponse> {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.post('/admin/songs/channel', request, { headers }) as unknown as Promise<CreateSongChannelResponse>;
    }

    public async migrateAnimeSongs(request: MigrateAnimeSongsRequest) {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.post('/admin/migrate/anime-songs', request, { headers });
    }

    public async revertMigrateAnimeSongs(my_anime_list_id: number) {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.delete('/admin/migrate/anime-songs', { headers, data: { my_anime_list_id } });
    }

    public async migrateSpotifySong(request: MigrateSpotifySongRequest): Promise<MigrateSpotifySongResponse> {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.post('/admin/migrate/spotify-song', request, { headers }) as unknown as Promise<MigrateSpotifySongResponse>;
    }

    public async confirmSpotifySong(request: ConfirmSpotifySongRequest) {
        const headers = { Cookie: await getAuthCookie() };
        return apiClient.post('/admin/migrate/spotify-song/confirm', request, { headers });
    }
}
