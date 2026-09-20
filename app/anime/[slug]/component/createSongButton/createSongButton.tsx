"use client"

import { useState } from "react"
import { Button } from "../../../../component/mtailwind"
import AlertModal from "@/app/component/alertModal/alertModal"
import CreateSongModal from "./createSongModal"

type PropsCreateSongButton = {
    anime_id: string
    anime_name: string
}

export default function CreateSongButton(props: PropsCreateSongButton) {
    const [openModal, setOpenModal] = useState(false)
    const [openAlert, setOpenAlert] = useState(false)
    const [message, setMessage] = useState("")

    const handleCreated = (message: string) => {
        setMessage(message)
        setOpenModal(false)
        setOpenAlert(true)
    }

    return (
        <>
            <Button variant="gradient" color="green" onClick={() => setOpenModal(true)}>
                <span>Create Song</span>
            </Button>
            <CreateSongModal
                open={openModal}
                handler={() => setOpenModal(false)}
                anime_id={props.anime_id}
                anime_name={props.anime_name}
                onCreated={handleCreated}
            />
            <AlertModal
                open={openAlert}
                handler={() => setOpenAlert(false)}
                message={message}
            />
        </>
    )
}
