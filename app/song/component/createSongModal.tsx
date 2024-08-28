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
} from "../../component/mtailwind";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArtistSerivce } from "@/app/api/artist";
import { createSong } from "./action";

type AnimeSongData = {
    id: number;
    name: string;
    image: string;
    description: string;
    year: string;
    type: number;
    anime_id: number;
    song_channel: {
        channel: number;
        type: number;
        link: string;
    }[];
    artist_list: number[]
};

type PropsCreateSongeModal = {
    open: boolean;
    handler: () => void;
    isEdit: boolean;
    song?: AnimeSongData;
};

type FormSongArtistData = {
    id: number;
    name: string;
    image: string;
};

type FormSongChannelData = {
    channel: number;
    type: number;
    link: string;
};

type FormSongData = {
    name: string;
    image: string;
    description: string;
    year: string;
    type: string;
    anime_id: string;
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

const songType: SongType[] = [
    { id: "1", name: "opening" },
    { id: "2", name: "ending" },
    { id: "3", name: "soundtrack" },
];

export default function createSongModal(prop: PropsCreateSongeModal) {
    const router = useRouter();
    const open = prop.open;
    const handleOpen = prop.handler;
    const isEdit = prop.isEdit;
    const songData = prop.song;
    const [artistList, setArtistList] = useState<ArtistList[]>();
    const [formSongChannelData, setFormSongChannelData] =
        useState<FormSongChannelData>({
            channel: 0,
            type: 0,
            link: "",
        });
    const [formData, setFormData] = useState<FormSongData>({
        name: "",
        image: "",
        description: "",
        year: "",
        type: "",
        anime_id: "",
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

    const handleChannelInputChange = (
        event: React.ChangeEvent<HTMLInputElement> | any
    ) => {
        const { name, value } = event.target;
        if (name == "channel") {
            setFormSongChannelData({ ...formSongChannelData, channel: +value });
        } else if (name == "type") {
            setFormSongChannelData({ ...formSongChannelData, type: +value });
        } else if (name == "link") {
            setFormSongChannelData({ ...formSongChannelData, link: value });
        }
    };
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
            song_channel: [formSongChannelData],
            artist_list: [+formData.artists],
        };
        if (isEdit && songData) {
            //PATCH:/blogs
            song.id = songData.id;
            //await updateBlog(song, songData.id)
        } else {
            //POST:/blogs
            await createSong(song);
        }
        handleOpen();
        router.push("/");
    };
    useEffect(() => {
        if (isEdit && songData) {
            setFormData({
                name: songData.name,
                image: songData.image,
                description: songData.description,
                year: songData.year,
                type: songData.type.toString(),
                anime_id: songData.anime_id.toString(),
                song_channel: songData.song_channel,
                artists: songData.artist_list[0].toString()
            });
        }
    }, []);

    //fetch list of artist
    const initArtist = async () => {
        const artistSerivce = new ArtistSerivce()
        const artist = await artistSerivce.getArtists();
        console.log(artist)
        if (artist != null) {
            setArtistList(artist);
        }
    };
    useEffect(() => {
        initArtist();
    }, []);
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
                            <Typography variant="h6">Song</Typography>
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
                                    >
                                        {artistList?.map((item) => (
                                            <Option key={item.id} value={item.id.toString()}>
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
                                    <Input
                                        label="channel"
                                        crossOrigin={undefined}
                                        value={formSongChannelData.channel}
                                        name="channel"
                                        onChange={handleChannelInputChange}
                                    />
                                </div>
                                <div className="w-full">
                                    <Input
                                        label="type"
                                        crossOrigin={undefined}
                                        value={formSongChannelData.type}
                                        name="type"
                                        onChange={handleChannelInputChange}
                                    />
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
