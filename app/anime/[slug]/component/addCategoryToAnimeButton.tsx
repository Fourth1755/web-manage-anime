"use client";
import AddCategoryToAnimeModal from "./addCategoryToAnimeModal";
import { useState } from "react";
import { Button } from "../../../component/mtailwind";
import { GetSongByAnimeIdResponseSongDetail } from "@/app/api/dtos/song";

type PropAddCategoryToAnimeButton ={
    name: string
    category?:GetSongByAnimeIdResponseSongDetail[]
    anime_id: string
}

// type AnimeDetailCategories = {
//     id:string
//     name:string
// }

export default function AddCategoryToAnimeButton(props:PropAddCategoryToAnimeButton) {
    const [openModal, setOpenModal] = useState(false);
    const handleOpen = () => setOpenModal(!openModal);
    return (
        <>
            <Button variant="gradient" color="green" type="submit" onClick={handleOpen}>
                <span>{props.name}</span>
            </Button>
            <AddCategoryToAnimeModal
                open={openModal}
                handler={handleOpen}
                category={props.category}
                anime_id={props.anime_id}
            />
        </>
    );
}
