"use client";
import CreateBlogModal from "./createAnimeModal";
import { useState } from "react";
import { Button } from "../../component/mtailwind";

type PropCreateAnimeButton ={
    name: string
    isEdit: boolean
    anime?:AnimeData
}

type AnimeData = {
    id: number;
    name: string;
    name_english: string
    name_thai: string
    episodes: number
    seasonal: string;
    image: string
    description: string
    duration: string
    year: string;
    type: number
    wallpaper: string
    trailer: string
}

export default function CreateAnimeButton(props:PropCreateAnimeButton) {
    const [openModal, setOpenModal] = useState(false);
    const handleOpen = () => setOpenModal(!openModal);
    return (
        <>
            <Button variant="gradient" color="green" type="submit" onClick={handleOpen}>
                <span>{props.name}</span>
            </Button>
            <CreateBlogModal
                open={openModal}
                handler={handleOpen}
                isEdit={props.isEdit}
                anime={props.anime}
            />
        </>
    );
}
