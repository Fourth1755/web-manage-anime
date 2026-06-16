"use client";

import {
    Button,
    Dialog,
    DialogBody,
    DialogFooter,
    DialogHeader,
    Input,
    Typography,
} from "../../../../component/mtailwind";
import { useState } from "react";
import { CreateAnimeTrailersRequest } from "@/app/api/dtos/anime";
import { createAnimeTrailers } from "./action";

type PropsCreateTrailerModal = {
    open: boolean;
    handler: () => void;
    anime_id: string;
    anime_name: string;
    handlerResponseMessage: (message: string) => void;
};

type TrailerFormData = {
    name: string;
    video_id: string;
    url: string;
};

const emptyTrailer = (): TrailerFormData => ({
    name: "",
    video_id: "",
    url: "",
});

export default function CreateTrailerModal(props: PropsCreateTrailerModal) {
    const [trailers, setTrailers] = useState<TrailerFormData[]>([emptyTrailer()]);

    const handleTrailerChange = (index: number, name: keyof TrailerFormData, value: string) => {
        setTrailers((currentTrailers) =>
            currentTrailers.map((item, itemIndex) =>
                itemIndex === index ? { ...item, [name]: value } : item
            )
        );
    };

    const handleAddTrailer = () => {
        setTrailers((currentTrailers) => [...currentTrailers, emptyTrailer()]);
    };

    const handleRemoveTrailer = (index: number) => {
        setTrailers((currentTrailers) => {
            if (currentTrailers.length === 1) {
                return [emptyTrailer()];
            }

            return currentTrailers.filter((_, itemIndex) => itemIndex !== index);
        });
    };

    const handleSubmit = () => {
        const filteredTrailers = trailers.filter((item) => item.url.trim() !== "");

        if (filteredTrailers.length === 0) {
            props.handlerResponseMessage("Please add at least one trailer URL");
            return;
        }

        const request: CreateAnimeTrailersRequest = {
            anime_id: props.anime_id,
            trailers: filteredTrailers.map((item) => ({
                name: item.name.trim(),
                video_id: item.video_id.trim() || undefined,
                url: item.url.trim(),
            })),
        };

        const response = createAnimeTrailers(request, props.anime_id);
        response.then((message) => props.handlerResponseMessage(message));
        props.handler();
        setTrailers([emptyTrailer()]);
    };

    return (
        <Dialog
            open={props.open}
            handler={props.handler}
            animate={{
                mount: { scale: 1, y: 0 },
                unmount: { scale: 0.9, y: -100 },
            }}
            size="md"
        >
            <DialogHeader>Create Anime Trailers</DialogHeader>
            <DialogBody className="space-y-4 pb-6 overflow-y-scroll max-h-[32rem]">
                <Typography variant="h6">{props.anime_name}</Typography>
                {trailers.map((item, index) => (
                    <div key={index} className="rounded-lg border border-blue-gray-100 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <Typography variant="small" className="font-bold">
                                Trailer {index + 1}
                            </Typography>
                            <Button
                                type="button"
                                variant="text"
                                color="red"
                                onClick={() => handleRemoveTrailer(index)}
                            >
                                Remove
                            </Button>
                        </div>
                        <Input
                            label="Name"
                            crossOrigin={undefined}
                            value={item.name}
                            onChange={(event) => handleTrailerChange(index, "name", event.target.value)}
                        />
                        <Input
                            label="Video ID"
                            crossOrigin={undefined}
                            value={item.video_id}
                            onChange={(event) => handleTrailerChange(index, "video_id", event.target.value)}
                        />
                        <Input
                            label="URL"
                            crossOrigin={undefined}
                            value={item.url}
                            onChange={(event) => handleTrailerChange(index, "url", event.target.value)}
                        />
                    </div>
                ))}
                <Button type="button" variant="outlined" color="green" onClick={handleAddTrailer}>
                    <span>Add More Trailer</span>
                </Button>
            </DialogBody>
            <DialogFooter>
                <Button
                    variant="text"
                    color="red"
                    onClick={props.handler}
                    className="mr-1"
                >
                    <span>Cancel</span>
                </Button>
                <Button variant="gradient" color="green" type="button" onClick={handleSubmit}>
                    <span>Create</span>
                </Button>
            </DialogFooter>
        </Dialog>
    );
}
