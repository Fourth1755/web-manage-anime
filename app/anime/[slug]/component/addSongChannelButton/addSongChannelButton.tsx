'use client'

import { useState } from 'react'
import { Button } from '../../../../component/mtailwind'
import AlertModal from '@/app/component/alertModal/alertModal'
import AddSongChannelModal from './addSongChannelModal'

type Props = {
    song_id: string
    song_name: string
    anime_id: string
}

export default function AddSongChannelButton({ song_id, song_name, anime_id }: Props) {
    const [openModal, setOpenModal] = useState(false)
    const [openAlert, setOpenAlert] = useState(false)
    const [message, setMessage] = useState('')

    const handleResponseMessage = (msg: string) => {
        setMessage(msg)
        setOpenAlert(true)
    }

    return (
        <>
            <Button size="sm" variant="outlined" color="green" onClick={() => setOpenModal(true)}>
                + Channel
            </Button>
            <AddSongChannelModal
                open={openModal}
                handler={() => setOpenModal(false)}
                song_id={song_id}
                song_name={song_name}
                anime_id={anime_id}
                handlerResponseMessage={handleResponseMessage}
            />
            <AlertModal
                open={openAlert}
                handler={() => setOpenAlert(false)}
                message={message}
            />
        </>
    )
}
