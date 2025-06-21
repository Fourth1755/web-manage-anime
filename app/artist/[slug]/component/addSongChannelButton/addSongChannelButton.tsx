"use client";

import {
    Button,
} from "../../../../component/mtailwind";
import { useState } from "react";
import AlertModal from "@/app/component/alertModal/alertModal";
import AddSongChannelModal from "./addSongChannelModal";

type PropsAddSongChannelButton = {
    song_id: string
}

export default function AddSongChannelButton(props: PropsAddSongChannelButton) {
    const [openModal, setOpenModal] = useState(false);
    const [openModalAlert, setOpenModalAlert] = useState(false);
    const [message, setMessage] = useState("");

    const handleOpen = () => setOpenModal(!openModal);
    const handleOpenAlert = () => setOpenModalAlert(!openModal);
    const handlerResponseMessage = (message:string) => {
        setMessage(message)
        handleOpenAlert()
    }
    return (
        <>
            <Button variant="outlined" color="green"  onClick={handleOpen}>
                <span>Create Song Channel</span>
            </Button>
            <AddSongChannelModal
                open={openModal}
                handler={handleOpen}
                song_id={props.song_id}
                handlerResponseMessage={handlerResponseMessage}
            />
            <AlertModal                 
                open={openModalAlert}
                handler={handleOpenAlert}
                message={message}
                />
        </>
    );
}