"use client";
import { useState } from "react";
import { Button } from "../../../../component/mtailwind";
import AlertModal from "@/app/component/alertModal/alertModal";
import AddCharacterToEpisodeModal from "./addCharacterToEpisodeModal";

type EpisodeData = {
    id: string
    number: number
    name: string
    name_thai: string
    name_english: string
    name_japan:string
}

type PropsAddCharacterToEpisodeButton = {
    anime_id: string
    episode: EpisodeData
}

export default function AddCharacterToEpisodeButton(props: PropsAddCharacterToEpisodeButton) {
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
            <Button 
                variant='outlined' 
                color="green" 
                type="submit"
                size='sm' 
                onClick={handleOpen}>
                <span>Edit</span>
            </Button>
            <AddCharacterToEpisodeModal
                open={openModal}
                handler={handleOpen}
                episode={props.episode}
                handlerResponseMessage={handlerResponseMessage}
                anime_id={props.anime_id}
            />        
            <AlertModal                 
                open={openModalAlert}
                handler={handleOpenAlert}
                message={message}
                />
        </>
    );
}