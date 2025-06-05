"use client";
import { CreateEpisodeRequest } from "@/app/api/dtos/episode";
import {
    Button,
} from "../../../../component/mtailwind";
import { createEpisode } from "./action";
import AlertModal from "@/app/component/alertModal/alertModal";
import { useState } from "react";
type Prop = {
    anime_id: string
}

export default function CreateEpisodeButton(prop:Prop){
    const { anime_id } = prop
    const [message, setMessage] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const handleOpen = () => setOpenModal(!openModal);
    const onClickButton = () => {
        handleOpen()
        const request: CreateEpisodeRequest = {
            anime_id:anime_id
        }
        const res = createEpisode(request)
        res.then((data)=>setMessage(data))
    }

    return (
        <>
        <Button variant="gradient" color="green" onClick={onClickButton}>
            <span>Create Episode</span>
        </Button>
        <AlertModal                 
            open={openModal}
            handler={handleOpen}
            message={message}/>
        </>

    );
}