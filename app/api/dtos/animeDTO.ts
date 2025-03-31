type AnimeDetailCategories = {
    id:number
    name:string
}

type AnimeDetail = {
    id: number;
    name: string;
    name_english: string
    name_thai: string
    episodes: number
    seasonal: string;
    image: string
    studio: string[];
    description: string
    duration: string
    year: string;
    type: number
    wallpaper: string
    trailer: string
    categories:AnimeDetailCategories[]
}