'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/app/component/mtailwind'
import AlertModal from '@/app/component/alertModal/alertModal'
import CreateSongModal from './createSongModal'

type Props = { artistId: string; artistName: string }

export default function CreateSongButton({ artistId, artistName }: Props) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState('')
    const [showAlert, setShowAlert] = useState(false)

    const handleSaved = (message: string) => {
        setOpen(false)
        setMessage(message)
        setShowAlert(true)
        router.refresh()
    }

    return (
        <>
            <Button variant="gradient" color="green" onClick={() => setOpen(true)}>
                Create Song
            </Button>
            {open && (
                <CreateSongModal
                    artistId={artistId}
                    artistName={artistName}
                    onClose={() => setOpen(false)}
                    onSaved={handleSaved}
                />
            )}
            <AlertModal open={showAlert} handler={() => setShowAlert(false)} message={message} />
        </>
    )
}
