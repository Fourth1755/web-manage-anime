"use client";

import { useState } from "react";
import { Button } from "../../../../component/mtailwind";
import AlertModal from "@/app/component/alertModal/alertModal";
import CreateTrailerModal from "./createTrailerModal";

type PropsCreateTrailerButton = {
    anime_id: string
    anime_name: string
}

export default function CreateTrailerButton(props: PropsCreateTrailerButton) {
    const [openModal, setOpenModal] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [message, setMessage] = useState("");

    const handleOpen = () => setOpenModal(!openModal);
    const handleOpenAlert = () => setOpenAlert(!openAlert);
    const handleResponseMessage = (responseMessage: string) => {
        setMessage(responseMessage);
        handleOpenAlert();
    };

    return (
        <>
            <Button variant="gradient" color="green" type="button" onClick={handleOpen}>
                <span>Add Trailer</span>
            </Button>
            <CreateTrailerModal
                open={openModal}
                handler={handleOpen}
                anime_id={props.anime_id}
                anime_name={props.anime_name}
                handlerResponseMessage={handleResponseMessage}
            />
            <AlertModal
                open={openAlert}
                handler={handleOpenAlert}
                message={message}
            />
        </>
    );
}
