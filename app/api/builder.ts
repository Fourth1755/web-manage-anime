import { cookies } from 'next/headers';

export class ConnectAnimapService {
    private url: string;

    constructor() {
        this.url = "http://localhost:8080";
    }

    public getUrl(): string {
        return this.url;
    }

    public async getAuthorization(): Promise<string> {
        try {
            const cookieStore = await cookies();
            const all = cookieStore.getAll();
            const authCookie = all.find(c => c.value.startsWith('eyJ'));
            return `Bearer ${authCookie?.value ?? ''}`;
        } catch {
            return 'Bearer ';
        }
    }

    public getArtistUrl(): string {
        return new URL("/artists", this.url).toString();
    }

    public getSongsUrl(): string {
        return new URL("/songs", this.url).toString();
    }

    public getAnimesUrl(): string {
        return new URL("/animes", this.url).toString();
    }

    public getCategoriesUrl(): string {
        return new URL("/category", this.url).toString();
    }

    public getStudioUrl(): string {
        return new URL("/studios", this.url).toString();
    }

    public getCategoryUniverseUrl(): string {
        return new URL("/category-universe", this.url).toString();
    }

    public getEpisodeUrl(): string {
        return new URL("/episodes", this.url).toString();
    }

    public getCharacterUrl(): string {
        return new URL("/characters", this.url).toString();
    }
}
