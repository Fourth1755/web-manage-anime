"use client";
import { createSong } from "@/app/api/songs";
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
} from "../../component/mtailwind";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { channel } from "diagnostics_channel";

type AnimeSongData = {
    id: number;
    name: string;
    image: string;
    description: string;
    year: string;
    type: number;
    anime_id: number;
    song_channel: {
        channel: number
        type: number
        link: string
    }[],
}

type PropsCreateSongeModal = {
    open: boolean;
    handler: () => void;
    isEdit: boolean;
    song?: AnimeSongData
};

type FormSongChannelData ={
    channel: number
    type: number
    link: string
}

type FormSongData = {
    name: string;
    image: string;
    description: string;
    year: string;
    type: string;
    anime_id: string;
    song_channel: FormSongChannelData[],
}

type SongType = {
    id: string;
    name: string;
}

const songType: SongType[] = [
    { id: "1", name: "opening" },
    { id: "2", name: "ending" },
    { id: "3", name: "soundtrack" }
];

export default function createSongModal(prop: PropsCreateSongeModal) {
    const router = useRouter()
    const open = prop.open;
    const handleOpen = prop.handler;
    const isEdit = prop.isEdit
    const songData = prop.song


    const [formSongChannelData, setFormSongChannelData] = useState<FormSongChannelData>({
        channel: 0,
        type: 0,
        link:""
    })
    const [formData, setFormData] = useState<FormSongData>({ 
        name: "", 
        image: "", 
        description: "", 
        year: "", 
        type: "", 
        anime_id: "", 
        song_channel:[formSongChannelData] });
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement> | any) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }
    const changeType = (val = "") => {
        console.log(val)
        setFormData({ ...formData, "type": val });
    };

    const handleChannelInputChange = (event: React.ChangeEvent<HTMLInputElement> | any) => {
        const { name, value } = event.target;
        if(name == "channel"){
            setFormSongChannelData({...formSongChannelData,"channel": +value});
        }else if(name == "type"){
            setFormSongChannelData({...formSongChannelData,"type": +value});
        }else if(name == "link"){
            setFormSongChannelData({...formSongChannelData,"link": value});
        }
    }
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const song: AnimeSongData = {
            id: 0,
            name: formData.name,
            image: formData.image,
            description: formData.description,
            year: formData.year,
            type: +formData.type,
            anime_id: +formData.anime_id,
            song_channel: [formSongChannelData]
        }
        if (isEdit && songData) {
            //PATCH:/blogs
            song.id = songData.id
            //await updateBlog(song, songData.id)
        } else {
            //POST:/blogs
            console.log(song)
            await createSong(song)
        }
        handleOpen()
        router.push('/')
    }
    useEffect(() => {
        if (isEdit && songData) {
            setFormData({
                name: songData.name,
                image: songData.image,
                description: songData.description,
                year: songData.year,
                type: songData.type.toString(),
                anime_id: songData.anime_id.toString(),
                song_channel: songData.song_channel
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
            >
                <DialogHeader>{isEdit ? "Edit Song" : "Create Song"}</DialogHeader>

                <form onSubmit={handleSubmit}>
                    <DialogBody className="h-[32rem] overflow-y-scroll">
                        <div className="grid gap-6">
                            <Typography variant="h6">
                                Song
                            </Typography>
                            <Input
                                label="Anime song name"
                                crossOrigin={undefined}
                                value={formData.name}
                                name="name"
                                onChange={handleInputChange}
                            />
                            <Input
                                label="Anime"
                                crossOrigin={undefined}
                                value={formData.anime_id}
                                name="anime_id"
                                onChange={handleInputChange}
                            />
                            <Input
                                label="Image of anime song"
                                crossOrigin={undefined}
                                value={formData.image}
                                name="image"
                                onChange={handleInputChange}
                            />
                            <Input
                                label="Description"
                                crossOrigin={undefined}
                                value={formData.description}
                                name="description"
                                onChange={handleInputChange}
                            />
                            <Input
                                label="year"
                                crossOrigin={undefined}
                                value={formData.year}
                                name="year"
                                onChange={handleInputChange}
                            />
                            <div className="md:w-48 flex gap-6">
                                <Select
                                    variant="outlined"
                                    label="Choose a Type of Song"
                                    color="green"
                                    value={formData.type}
                                    name="type"
                                    onChange={changeType}
                                >
                                    {songType.map((item) => (
                                        <Option key={item.id} value={item.id}>
                                            {item.name}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                            <Typography className="-mb-2" variant="h6">
                                Song Channel
                            </Typography>
                            <Input
                                label="channel"
                                crossOrigin={undefined}
                                value={formSongChannelData.channel}
                                name="channel"
                                onChange={handleChannelInputChange}
                            />
                            <Input
                                label="type"
                                crossOrigin={undefined}
                                value={formSongChannelData.type}
                                name="type"
                                onChange={handleChannelInputChange}
                            />
                            <Input
                                label="link"
                                crossOrigin={undefined}
                                value={formSongChannelData.link}
                                name="link"
                                onChange={handleChannelInputChange}
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