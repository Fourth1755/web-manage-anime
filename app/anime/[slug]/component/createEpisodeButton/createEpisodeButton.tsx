"use client";
import { CreateEpisodeRequest } from "@/app/api/dtos/episode";
import {
    Button,
} from "../../../../component/mtailwind";
import { createEpisode } from "./action";
import AlertModal from "@/app/component/alertModal/AlertModal";
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
        const request: CreateEpisodeRequest = {
            anime_id:anime_id
        }
        const res = createEpisode(request)
        // setMessage(res.then.toString)
        console.log(res.then.toString)
        handleOpen()
    }

    return (
        <Button variant="gradient" color="green" type="submit" onClick={onClickButton}>
            <span>Create Episode</span>
            <AlertModal                 
                open={openModal}
                handler={handleOpen}
                message="success"/>
        </Button>
    );
}