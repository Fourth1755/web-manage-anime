import { cookies } from 'next/headers';
import { ADMIN_SESSION_COOKIE, isAdminSessionToken } from '@/lib/adminSession';

export class ConnectAnimapService {
    private url: string;

    constructor() {
        this.url = process.env.API_BASE_URL || "http://localhost:8080";
    }

    public getUrl(): string {
        return this.url;
    }

    public async getAuthorization(): Promise<string> {
        try {
            const cookieStore = await cookies();
            const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
            return `Bearer ${isAdminSessionToken(token) ? token : ''}`;
        } catch {
            return 'Bearer ';
        }
    }

    public getArtistUrl(): string {
        return new URL("/admin/artists", this.url).toString();
    }

    public getSongsUrl(): string {
        return new URL("/admin/songs", this.url).toString();
    }

    public getAnimesUrl(): string {
        return new URL("/admin/animes", this.url).toString();
    }

    public getCategoriesUrl(): string {
        return new URL("/admin/category", this.url).toString();
    }

    public getStudioUrl(): string {
        return new URL("/admin/studios", this.url).toString();
    }

    public getCategoryUniverseUrl(): string {
        return new URL("/admin/category-universe", this.url).toString();
    }

    public getEpisodeUrl(): string {
        return new URL("/admin/episodes", this.url).toString();
    }

    public getCharacterUrl(): string {
        return new URL("/admin/characters", this.url).toString();
    }
}
