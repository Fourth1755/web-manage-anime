"use client";
import CreateBlogModal from "./createSongModal";
import { useState } from "react";
import { Button } from "../../../component/mtailwind";

type PropsCreateSongButton = {
    anime_id: number
    anime_name: string
}

export default function CreateSongButton(props: PropsCreateSongButton) {
    const [openModal, setOpenModal] = useState(false);
    const handleOpen = () => setOpenModal(!openModal);
    return (
        <>
            <Button variant="gradient" color="green" type="submit" onClick={handleOpen}>
                <span>Add Song</span>
            </Button>
            <CreateBlogModal
                open={openModal}
                handler={handleOpen}
                isEdit={false}
                song={undefined}
                anime_id={props.anime_id}
                anime_name={props.anime_name}
            />
        </>
    );
}