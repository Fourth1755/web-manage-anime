"use client";

import { useState } from "react";
import { Button } from "../../../../component/mtailwind";
import AlertModal from "@/app/component/alertModal/alertModal";
import CreateCharacterModal from "./createCharacterModal";

type PropsCreateCharacterButton = {
    anime_id: string
}

export default function CreateCharacterButton(props: PropsCreateCharacterButton) {
    const [openModal, setOpenModal] = useState(false);
    const [openModalAlert, setOpenModalAlert] = useState(false);
    const [message, setMessage] = useState("");

    const handleOpen = () => setOpenModal(!openModal);
    const handleOpenAlert = () => setOpenModalAlert(!openModalAlert);
    const handlerResponseMessage = (message:string) => {
        setMessage(message)
        handleOpenAlert()
    }
    return (
        <>
            <Button variant="gradient" color="green" type="submit" onClick={handleOpen}>
                <span>Add Character</span>
            </Button>
            <CreateCharacterModal
                open={openModal}
                handler={handleOpen}
                anime_id={props.anime_id}
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