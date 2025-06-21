"use client"
import { useState } from "react";
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
import { CreateSongChannelRequest } from "@/app/api/dtos/song";
import { createSongChannel } from "./action";

// YOUTUBE,SPOTIFY
const channelSelect = [
    { id: "YOUTUBE", name: "Youtube", image: "https://www.youtube.com/img/desktop/yt_1200.png"},
    { id: "SPOTIFY", name: "Spotify", image: "https://m.media-amazon.com/images/I/51rttY7a+9L._h1_.png"},
] 

//TV_SIZE, FULL_SIZE_OFFICIAL, FULL_SIZE_UNOFFICIAL, FIRST_TAKE
const channelTypeSelect=[
    { id: "TV_SIZE", name: "TV size" },
    { id: "FULL_SIZE_OFFICIAL", name: "Full size official" },
    { id: "FULL_SIZE_UNOFFICIAL", name: "Full size unofficial" },
    { id: "FIRST_TAKE", name: "First Take" },
]

type PropAddSongChannelModal = {
    open: boolean;
    song_id: string;
    handler: () => void;
    handlerResponseMessage: (message:string) => void;
}

type FormSongData = {
    song_id:string
    channel: string
    type:string
    link:string
    is_main:boolean
};

export default function AddSongChannelModal(prop: PropAddSongChannelModal) {
    const {open,song_id } = prop
    const handleOpen = prop.handler
    const handlerResponseMessage = prop.handlerResponseMessage

    const [formData, setFormData] = useState<FormSongData>({
        song_id: song_id,
        channel: "",
        type: "",
        link: "",
        is_main: false,
    });

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement> | any
    ) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleChangeChannel = (value = "") => {
        setFormData({ ...formData, channel: value });
    };

    const handleChangeType = (value = "") => {
        setFormData({ ...formData, type: value });
    };

    const handleSubmit = async () => {
        const request: CreateSongChannelRequest= {
            song_id: formData.song_id,
            channel: formData.channel,
            type: formData.type,
            link: formData.link,
            is_main: formData.is_main,
        }
        const res = createSongChannel(request);
        res.then((data)=>handlerResponseMessage(data))
        handleOpen();
    };
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
            <DialogHeader>Add Song Channel</DialogHeader>
            <DialogBody>
                <div className="grid gap-6">
                    <Input
                        label="Link"
                        crossOrigin={undefined}
                        value={formData.link}
                        name="link"
                        onChange={handleInputChange}
                    />
                    <div className="w-full">
                        <Select
                            variant="outlined"
                            label="Choose a Channel type"
                            color="green"
                            value={formData.channel}
                            name="channel"
                            onChange={handleChangeChannel}
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
                            value={formData.type}
                            name="type"
                            onChange={handleChangeType}
                        >
                            {channelTypeSelect.map((item) => (
                                <Option key={item.id} value={item.id} className="flex items-center gap-2">
                                    {item.name}
                                </Option>
                            ))}
                        </Select>
                    </div>
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
                <Button 
                    variant="gradient" 
                    color="green" 
                    onClick={handleSubmit}>
                    <span>Add Song Channel</span>
                </Button>
            </DialogFooter>
        </Dialog>
    </>
    )
}