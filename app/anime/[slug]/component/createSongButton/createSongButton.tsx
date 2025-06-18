"use client";
import CreateBlogModal from "./createSongModal";
import { useState } from "react";
import { Button } from "../../../../component/mtailwind";
import AlertModal from "@/app/component/alertModal/alertModal";

type PropsCreateSongButton = {
    anime_id: string
    anime_name: string
}

export default function CreateSongButton(props: PropsCreateSongButton) {
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
                <span>Add Song</span>
            </Button>
            <CreateBlogModal
                open={openModal}
                handler={handleOpen}
                isEdit={false}
                song={undefined}
                anime_id={props.anime_id}
                anime_name={props.anime_name}
                // handlerResponseMessage={handlerResponseMessage}
            />
            {/* <AlertModal                 
                open={openModalAlert}
                handler={handleOpenAlert}
                message={message}
                /> */}
        </>
    );
}