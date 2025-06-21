"use client";
import { useState } from "react";
import { Button } from "../../../component/mtailwind";
import AlertModal from "@/app/component/alertModal/alertModal";
import CreateArtistModal from "./createArtistModal";

type PropsCreateArtistButton = {
    isEdit: boolean
}

export default function CreateArtistButton(props: PropsCreateArtistButton) {
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
            <Button variant="gradient" color="green" type="submit" onClick={handleOpen}>
                <span>Create Artist</span>
            </Button>
            <CreateArtistModal
                open={openModal}
                handler={handleOpen}
                isEdit={props.isEdit}
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