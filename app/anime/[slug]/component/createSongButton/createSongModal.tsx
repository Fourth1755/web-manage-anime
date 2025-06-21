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
} from "../../../../component/mtailwind";
import { useEffect, useState } from "react";
import { createSong, getAllArtist } from "./action";
import React from "react";
import { CreateAnimeSongRequest, CreateAnimeSongRequestSongChannel } from "@/app/api/dtos/song";

type AnimeSongChannel = {
    channel: number;
    type: number;
    link: string;
}
type AnimeSongData = {
    id: string;
    name: string;
    image: string;
    description: string;
    year: string;
    type: number;
    anime_id: string;
    song_channel: AnimeSongChannel[];
    artist_list: number[]
};

type PropsCreateSongeModal = {
    open: boolean;
    handler: () => void;
    isEdit: boolean;
    song?: AnimeSongData;
    anime_id: string;
    anime_name: string
    handlerResponseMessage: (message:string) => void;
};

type FormSongChannelData = {
    channel: string;
    type: string;
    link: string;
};

type FormSongData = {
    name: string;
    image: string;
    description: string;
    year: string;
    type: string;
    song_channel: FormSongChannelData[];
    artists: string
};

type SongType = {
    id: string;
    name: string;
};

type ArtistList = {
    id: number;
    name: string;
    image: string;
    description?: string;
    record_label?: string;
    is_music_band?: boolean;
};

type ChannelSelect= {
    id: string;
    name: string;
    image: string;
}

//OPENING, ENDING, SOUNDTRACK
const songType: SongType[] = [
    { id: "OPENING", name: "opening" },
    { id: "ENDING", name: "ending" },
    { id: "SOUNDTRACK", name: "soundtrack" },
];

// YOUTUBE,SPOTIFY
const channelSelect:ChannelSelect[] = [
    { id: "YOUTUBE", name: "Youtube", image: "https://www.youtube.com/img/desktop/yt_1200.png"},
    { id: "SPOTIFY", name: "Spotify", image: "https://m.media-amazon.com/images/I/51rttY7a+9L._h1_.png"},
] 

//TV_SIZE, FULL_SIZE_OFFICIAL, FULL_SIZE_UNOFFICIAL, FIRST_TAKE
const channelTypeSelect=[
    { id: "TV_SIZE", name: "TV size" },
    { id: "FULL_SIZE_OFFICIAL", name: "Full size Official" },
    { id: "FULL_SIZE_UNOFFICIAL", name: "Full size Unofficial" },
    { id: "FIRST_TAKE", name: "Fitst Take" },
]

export default function createSongModal(prop: PropsCreateSongeModal) {
    const open = prop.open;
    const handleOpen = prop.handler;
    const isEdit = prop.isEdit;
    const songData = prop.song;
    const handlerResponseMessage = prop.handlerResponseMessage;

    const [artistList, setArtistList] = useState<ArtistList[]>();
    const [formSongChannelData, setFormSongChannelData] =
        useState<FormSongChannelData>({
            channel: "",
            type: "",
            link: "",
        });

    const [formData, setFormData] = useState<FormSongData>({
        name: "",
        image: "",
        description: "",
        year: "",
        type: "",
        song_channel: [formSongChannelData],
        artists: ""
    });

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement> | any
    ) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const changeType = (val = "") => {
        setFormData({ ...formData, type: val });
    };

    const handleChangeArtists = (val = "") => {
        setFormData({ ...formData, artists: val });
    };

    const handleChangeChannel = (value = "") => {
        setFormSongChannelData({ ...formSongChannelData, channel: value });
    };

    const handleChangeTypeChannel = (value = "") => {
        setFormSongChannelData({ ...formSongChannelData, type: value });
    };

    const handleChannelInputChange = (
        event: React.ChangeEvent<HTMLInputElement> | any
    ) => {
        const { name, value } = event.target;
        setFormSongChannelData({ ...formSongChannelData, [name]: value });
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const songChannel:CreateAnimeSongRequestSongChannel = {
            channel:formSongChannelData.channel,
            type:formSongChannelData.type,
            link:formSongChannelData.link
        }
        const song: CreateAnimeSongRequest = {
            id: "",
            name: formData.name,
            image: formData.image,
            description: formData.description,
            year: formData.year,
            type: formData.type,
            anime_id: prop.anime_id,
            song_channel: [songChannel],
            artist_list: [formData.artists],
        };
        
        if (isEdit && songData) {
            //PATCH:/blogs
            song.id = songData.id;
            //await updateBlog(song, songData.id)
            handleOpen();
        } else {
            const res = createSong(song);
            res.then((data)=>handlerResponseMessage(data))
            handleOpen();
        }
        
    };
    useEffect(() => {
        if (isEdit && songData) {
            const songChannel:FormSongChannelData = {
                channel:songData.song_channel[0].channel.toString(),
                type:songData.song_channel[0].type.toString(),
                link:songData.song_channel[0].link
            }
            setFormData({
                name: songData.name,
                image: songData.image,
                description: songData.description,
                year: songData.year,
                type: songData.type.toString(),
                song_channel: [songChannel],
                artists: songData.artist_list[0].toString()
            });
        }
    }, []);

    //fetch list of artist
    const initArtist = () => {
        const response = getAllArtist()
        response.then((data)=>setArtistList(data.artists));
    };

    useEffect(() => {
        initArtist();
    }, [prop]);
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
                            <Typography variant="h6">{prop.anime_name}</Typography>
                            <Input
                                label="Anime song name"
                                crossOrigin={undefined}
                                value={formData.name}
                                name="name"
                                onChange={handleInputChange}
                            />
                            <Input
                                label="Image of anime song"
                                crossOrigin={undefined}
                                value={formData.image}
                                name="image"
                                onChange={handleInputChange}
                            />
                            <div className="flex gap-4">
                                <div className="w-full">
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
                            <div className="flex flex-col gap-4">
                                <div className="w-full">
                                    <Select
                                        variant="outlined"
                                        label="Choose a Artist"
                                        color="green"
                                        value={formData.artists}
                                        name="artists"
                                        onChange={handleChangeArtists}
                                        selected={(element) =>
                                            element &&
                                            React.cloneElement(element, {
                                              disabled: true,
                                              className:
                                                "flex items-center opacity-100 px-0 gap-2 pointer-events-none",
                                            })
                                          }
                                    >
                                        {artistList?.map((item) => (
                                            <Option key={item.id} value={item.id.toString()} className="flex items-center gap-2">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="h-7 w-7 rounded-full object-cover"
                                                />
                                                {item.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </div>
                            </div>
                            <Textarea
                                label="Description"
                                value={formData.description}
                                name="description"
                                onChange={handleInputChange}
                            />
                            <Typography className="-mb-2" variant="h6">
                                Song Channel
                            </Typography>
                            <div className="flex gap-4">
                                <div className="w-full">
                                    <Select
                                        variant="outlined"
                                        label="Choose a Channel"
                                        color="green"
                                        value={formSongChannelData.channel}
                                        name="channel"
                                        onChange={handleChangeChannel}
                                        selected={(element) =>
                                            element &&
                                            React.cloneElement(element, {
                                              disabled: true,
                                              className:
                                                "flex items-center opacity-100 px-0 gap-2 pointer-events-none",
                                            })
                                          }
                                    >
                                        {channelSelect.map((item) => (
                                            <Option key={item.id} value={item.id} className="flex items-center gap-2">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="h-5 w-5 rounded-full object-cover"
                                                />
                                                {item.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </div>
                                <div className="w-full">
                                    <Select
                                        variant="outlined"
                                        label="Choose a Channel type"
                                        color="green"
                                        value={formSongChannelData.type}
                                        name="type"
                                        onChange={handleChangeTypeChannel}
                                    >
                                        {channelTypeSelect.map((item) => (
                                            <Option key={item.id} value={item.id} className="flex items-center gap-2">
                                                {item.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </div>
                            </div>
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
