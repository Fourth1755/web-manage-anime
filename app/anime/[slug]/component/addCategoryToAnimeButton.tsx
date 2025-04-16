"use client";
import AddCategoryToAnimeModal from "./addCategoryToAnimeModal";
import { useState } from "react";
import { Button } from "../../../component/mtailwind";

type PropAddCategoryToAnimeButton ={
    name: string
    category?:AnimeDetailCategories[]
    anime_id: number
}

type AnimeDetailCategories = {
    id:number
    name:string
}

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
