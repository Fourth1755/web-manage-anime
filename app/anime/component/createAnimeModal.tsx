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
    Typography,
    Chip
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { createAnime, updateAnime } from "./action";
import { GetStudioResponse } from "@/app/api/dtos/studio";
import { StudioService } from "@/app/api/studio";
import { GetAnimeByIdResponse } from "@/app/api/dtos/anime";

type AnimeData = {
    id: string;
    name: string;
    name_english: string
    name_thai: string
    episodes: number
    seasonal: string;
    image: string
    studio: string[]
    description: string
    duration: string
    year: string;
    type: number
    wallpaper: string
    trailer: string
};

type PropsCreateAnimeModal = {
    open: boolean;
    handler: () => void;
    isEdit: boolean;
    anime?: GetAnimeByIdResponse
};

type FormData = {
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
    type: string
    wallpaper: string
    trailer: string
}

const seasonalList = [
    "spring", "summer", "winter", "fall"
];
const animeTypeList = [
    { id: "1", name: "TV" },
    { id: "2", name: "Movie" }
]
let studioMap = new Map();

export default function createAnimeModal(prop: PropsCreateAnimeModal) {
    const open = prop.open;
    const handleOpen = prop.handler;
    const isEdit = prop.isEdit
    const animeData = prop.anime
    const [formData, setFormData] = useState<FormData>({
        name: "",
        name_english: "",
        name_thai: "",
        episodes: 0,
        seasonal: "",
        image: "",
        studio:[],
        description: "",
        duration: "",
        year: "",
        type: "",
        wallpaper: "",
        trailer: ""
    });
    const [studioList, setStduioList] = useState<GetStudioResponse[]>();
    const [chipOpen, setChipOpen] = useState(true);

    //fetch list of studio
    const initArtist = async () => {
        const studioService = new StudioService()
        const studios = await studioService.getStudio();
        if (studios != null) {
            setStduioList(studios);
            studios.map((item)=>{
                studioMap.set(item.id,item.name)
            })
        }
    };
    useEffect(() => {
        initArtist();
    }, [prop]);
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
    const changeStudio = (val = "") => {
        let stuidoVal: string[] = [];
        if(formData.studio.length != 0) {
            stuidoVal = formData.studio
        } 
        stuidoVal.push(val)
        console.log(studioMap)
        setFormData({ ...formData, "studio": stuidoVal });
        
    }
    const handleSubmit = async () => {
        //event.preventDefault();
        const anime: AnimeData = {
            id: 0,
            name: formData.name,
            name_english: formData.name_english,
            name_thai:formData.name_thai,
            episodes: +formData.episodes,
            seasonal: formData.seasonal,
            image: formData.image,
            studio: formData.studio,
            description: formData.description,
            duration: formData.duration,
            year: formData.year,
            type: +formData.type,
            wallpaper: formData.wallpaper,
            trailer: formData.trailer
        }
        if (isEdit && animeData) {
            anime.id = animeData.id
            await updateAnime(anime)
        } else {
            await createAnime(anime)
        }
        handleOpen()
    }
    const onCloseChipStudio = (id:String) => {
        const stuidoVal = formData.studio.filter((item)=>item!=id)
        console.log(stuidoVal)
        setFormData({ ...formData, "studio": stuidoVal });
    }
    useEffect(() => {
        console.log(isEdit, animeData)
        if (isEdit && animeData) {
            setFormData({
                name: animeData.name,
                name_english: animeData.name_english,
                name_thai:animeData.name_thai,
                episodes: +animeData.episodes,
                seasonal: animeData.seasonal,
                image: animeData.image,
                studio: animeData.studios.map(item=>item.id),
                description: animeData.description,
                duration: animeData.duration,
                year: animeData.year,
                type: animeData.type.toString(),
                wallpaper: animeData.wallpaper,
                trailer: animeData.trailer
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
                    <DialogBody className="space-y-4 pb-6 overflow-scroll h-96">
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
                            label="anime thai name"
                            crossOrigin={undefined}
                            value={formData.name_thai}
                            name="name_thai"
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
                        {formData?.studio?.length?<div>
                            {formData.studio.map((item,index)=>(
                                <div 
                                    key={index}
                                    className="py-1">
                                    <Chip
                                        open={chipOpen}
                                        onClose={() => onCloseChipStudio(item)}

                                        value={studioMap.get(item)}/>
                                </div>

                            ))}
                        </div>:<></>}
                        <div className="w-full">
                            <Select
                                variant="outlined"
                                label="Choose a Studio"
                                color="green"
                                value={formData.type}
                                name="type"
                                onChange={changeStudio}
                            >
                                {studioList?.map((item) => (
                                    <Option key={item.id} value={item.id}>
                                        {item.name}
                                    </Option>
                                ))}
                            </Select>
                        </div>
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
                        <Input
                            label="anime wallpaper"
                            type="text"
                            crossOrigin={undefined}
                            value={formData.wallpaper}
                            name="wallpaper"
                            onChange={handleInputChange}
                        />
                        <Input
                            label="trailer"
                            type="text"
                            crossOrigin={undefined}
                            value={formData.trailer}
                            name="trailer"
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
                        <Button variant="gradient" color="green" onClick={handleSubmit}>
                            <span>{isEdit ? "Save" : "Create"}</span>
                        </Button>
                    </DialogFooter>
            </Dialog>
        </>
    );
}