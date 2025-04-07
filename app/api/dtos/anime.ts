type GetAnimeByIdResponseCategories = {
    id:number
    name:string
}

type GetAnimeByIdResponseStudios = {
    id:string
    name:string
}

export type GetAnimeByIdResponse = {
    id: number;
    name: string;
    name_english: string
    name_thai: string
    episodes: number
    seasonal: string;
    image: string
    studios: GetAnimeByIdResponseStudios[];
    description: string
    duration: string
    year: string;
    type: number
    wallpaper: string
    trailer: string
    categories:GetAnimeByIdResponseCategories[]
}