"use client";
import { createAnime } from "@/app/api/anime";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Textarea,
    Select,
    Option,
} from "@material-tailwind/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type AnimeData = {
    id: number;
    name: string;
    seasonal: string;
    year: string;
    episodes: number
};

type PropsCreateAnimeModal = {
    open: boolean;
    handler: () => void;
    isEdit: boolean;
    anime?: AnimeData
};

type FormData = {
    name: string;
    seasonal: string;
    year: string;
    episodes: number
    //detail: string;
}

// async function createAnime(anime: AnimeData) {
//     const response = await axios.post(`http://localhost:8080/animes`, anime)
//     console.log(response)
//     return Response.json(response)
// }

async function updateBlog(anime: AnimeData, id: number) {
    const response = axios.patch(`http://localhost:8080/animes/${id}`, anime)
    return Response.json(response)
}

export default function createAnimeModal(prop: PropsCreateAnimeModal) {
    const router = useRouter()
    const open = prop.open;
    const handleOpen = prop.handler;
    const isEdit = prop.isEdit
    const animeData = prop.anime
    const seasonalList = [
        "spring", "summer", "winter", "fall"
    ];
    const user = {
        id: 1,
        name: "Alisa Mikhailovna",
        image: "https://cdn.myanimelist.net/images/characters/5/536830.jpg",
    }
    const [formData, setFormData] = useState<FormData>({ name: "", seasonal: "", year: "", episodes: 0 });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement> | any) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }
    const changeSeasonal = (val = "") => {
        setFormData({ ...formData, "seasonal": val });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const anime: AnimeData = {
            id: 0,
            name: formData.name,
            seasonal: formData.seasonal,
            year: formData.year,
            episodes: +formData.episodes
        }
        console.log(typeof +formData.episodes)
        if (isEdit && animeData) {
            //PATCH:/blogs
            anime.id = animeData.id
            await updateBlog(anime, animeData.id)
        } else {
            //POST:/blogs
            await createAnime(anime)
            //await createAnime(blog)
        }
        handleOpen()
        router.push('/')
    }
    useEffect(() => {
        if (isEdit && animeData) {
            setFormData({ name: animeData.name, seasonal: animeData.seasonal, year: animeData.year, episodes: animeData.episodes })
        }
    }, [])
    return (
        <>
            <Dialog
                open={open}
                handler={handleOpen}
                animate={{
                    mount: { scale: 1, y: 0 },
                    unmount: { scale: 0.9, y: -100 },
                }}
            >
                <DialogHeader>{isEdit ? "Edit Anime" : "Create Anime"}</DialogHeader>
                <form onSubmit={handleSubmit}>
                    <DialogBody>
                        <div className="grid gap-6">
                            <Input
                                label="anime name"
                                crossOrigin={undefined}
                                value={formData.name}
                                name="name"
                                onChange={handleInputChange}
                            />
                            <div className="md:w-48 flex gap-6">
                                <Select
                                    variant="outlined"
                                    label="Choose a Seasonal"
                                    color="green"
                                    value={formData.seasonal}
                                    name="seasonal"
                                    onChange={changeSeasonal}
                                >
                                    {seasonalList.map((item) => (
                                        <Option key={item} value={item}>
                                            {item}
                                        </Option>
                                    ))}
                                </Select>
                                <Input
                                    label="year"
                                    crossOrigin={undefined}
                                    value={formData.year}
                                    name="year"
                                    onChange={handleInputChange}
                                />
                            </div>
                            <Input
                                label="episodes"
                                type="number"
                                crossOrigin={undefined}
                                value={formData.episodes}
                                name="episodes"
                                onChange={handleInputChange}
                            />
                        </div>
                    </DialogBody>
                    <DialogFooter>
                        <Button
                            variant="text"
                            color="green"
                            onClick={handleOpen}
                            className="mr-1"
                        >
                            <span>Cancel</span>
                        </Button>
                        <Button variant="gradient" color="green" type="submit">
                            <span>Create</span>
                        </Button>
                    </DialogFooter>
                </form>
            </Dialog>
        </>
    );
}