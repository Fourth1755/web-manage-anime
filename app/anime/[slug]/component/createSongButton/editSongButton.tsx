"use client"

import { useState } from "react"
import { Button } from "../../../../component/mtailwind"
import AlertModal from "@/app/component/alertModal/alertModal"
import { GetSongByAnimeIdResponseSongDetail } from "@/app/api/dtos/song"
import CreateSongModal from "./createSongModal"

type Props = {
    anime_id: string
    anime_name: string
    song: GetSongByAnimeIdResponseSongDetail
}

export default function EditSongButton({ anime_id, anime_name, song }: Props) {
    const [openModal, setOpenModal] = useState(false)
    const [openAlert, setOpenAlert] = useState(false)
    const [message, setMessage] = useState("")

    const handleSaved = (responseMessage: string) => {
        setMessage(responseMessage)
        setOpenModal(false)
        setOpenAlert(true)
    }

    return (
        <>
            <Button size="sm" variant="outlined" color="blue" onClick={() => setOpenModal(true)}>
                Edit Song
            </Button>
            <CreateSongModal
                open={openModal}
                handler={() => setOpenModal(false)}
                anime_id={anime_id}
                anime_name={anime_name}
                song={song}
                onSaved={handleSaved}
            />
            <AlertModal
                open={openAlert}
                handler={() => setOpenAlert(false)}
                message={message}
            />
        </>
    )
}
