"use client";
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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createAnime,updateAnime } from "./action";

type AnimeData = {
    id: number;
    name: string;
    name_english: string
    episodes: number
    seasonal: string;
    image: string
    description: string
    duration: string
    year: string;
    type: number
};

type PropsCreateAnimeModal = {
    open: boolean;
    handler: () => void;
    isEdit: boolean;
    anime?: AnimeData
};

type FormData = {
    name: string;
    name_english: string
    episodes: number
    seasonal: string;
    image: string
    description: string
    duration: string
    year: string;
    type: string
}

const seasonalList = [
    "spring", "summer", "winter", "fall"
];
const animeTypeList = [
    { id: "1", name: "TV" },
    { id: "2", name: "Movie" }
]
export default function createAnimeModal(prop: PropsCreateAnimeModal) {
    const router = useRouter()
    const open = prop.open;
    const handleOpen = prop.handler;
    const isEdit = prop.isEdit
    const animeData = prop.anime
    const [formData, setFormData] = useState<FormData>({
        name: "",
        name_english: "",
        episodes: 0,
        seasonal: "",
        image: "",
        description: "",
        duration: "",
        year: "",
        type: "",
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement> | any) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }
    const changeSeasonal = (val = "") => {
        setFormData({ ...formData, "seasonal": val });
    };
    const changeAnimeType = (val = "") => {
        setFormData({ ...formData, "type": val });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        //event.preventDefault();
        const anime: AnimeData = {
            id: 0,
            name: formData.name,
            name_english: formData.name_english,
            episodes: +formData.episodes,
            seasonal: formData.seasonal,
            image: formData.image,
            description: formData.description,
            duration: formData.duration,
            year: formData.year,
            type: +formData.type
        }
        if (isEdit && animeData) {
            anime.id = animeData.id
            await updateAnime(anime)
        } else {
            await createAnime(anime)
        }
        handleOpen()
    }
    useEffect(() => {
        console.log(isEdit,animeData)
        if (isEdit && animeData) {
            setFormData({
                name: animeData.name,
                name_english: animeData.name_english,
                episodes: +animeData.episodes,
                seasonal: animeData.seasonal,
                image: animeData.image,
                description: animeData.description,
                duration: animeData.duration,
                year: animeData.year,
                type: animeData.type.toString()
            })
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
                size="sm"
            >
                <DialogHeader>{isEdit ? "Edit Anime" : "Create Anime"}</DialogHeader>
                <form onSubmit={handleSubmit}>
                    <DialogBody  className="space-y-4 pb-6">
                            <Input
                                label="anime name"
                                crossOrigin={undefined}
                                value={formData.name}
                                name="name"
                                onChange={handleInputChange}
                            />
                            <Input
                                label="anime english name"
                                crossOrigin={undefined}
                                value={formData.name_english}
                                name="name_english"
                                onChange={handleInputChange}
                            />
                            <Input
                                label="image"
                                type="text"
                                crossOrigin={undefined}
                                value={formData.image}
                                name="image"
                                onChange={handleInputChange}
                            />
                            <div className="flex gap-4">
                                <div className="w-full">
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
                                </div>
                                <div className="w-full">
                                <Input
                                    label="year"
                                    crossOrigin={undefined}
                                    value={formData.year}
                                    name="year"
                                    onChange={handleInputChange}
                                />
                                </div>

                            </div>
                            <div className="flex gap-4">
                                <div className="w-full">
                                <Select
                                    variant="outlined"
                                    label="Choose a Type"
                                    color="green"
                                    value={formData.type}
                                    name="type"
                                    onChange={changeAnimeType}
                                >
                                    {animeTypeList.map((item) => (
                                        <Option key={item.id} value={item.id}>
                                            {item.name}
                                        </Option>
                                    ))}
                                </Select>
                                </div>
                                <div className="w-full">
                                <Input
                                    label="episodes"
                                    type="number"
                                    crossOrigin={undefined}
                                    value={formData.episodes}
                                    name="episodes"
                                    onChange={handleInputChange}
                                />
                                </div>
                            </div>

                            <Input
                                label="duration"
                                type="text"
                                crossOrigin={undefined}
                                value={formData.duration}
                                name="duration"
                                onChange={handleInputChange}
                            />
                            <Textarea
                                label="description"
                                value={formData.description}
                                name="description"
                                onChange={handleInputChange}
                            />
                    </DialogBody>
                    <DialogFooter>
                        <Button
                            variant="text"
                            color="red"
                            onClick={handleOpen}
                            className="mr-1"
                        >
                            <span>Cancel</span>
                        </Button>
                        <Button variant="gradient" color="green" type="submit">
                            <span>{isEdit ? "Save" : "Create"}</span>
                        </Button>
                    </DialogFooter>
                </form>
            </Dialog>
        </>
    );
}