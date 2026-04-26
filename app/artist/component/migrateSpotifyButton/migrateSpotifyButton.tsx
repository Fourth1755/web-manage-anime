'use client'

import { useState } from 'react'
import { Button } from '@/app/component/mtailwind'
import MigrateSpotifyModal from './migrateSpotifyModal'

type Props = {
    artist_id: string
    artist_name: string
}

export default function MigrateSpotifyButton({ artist_id, artist_name }: Props) {
    const [open, setOpen] = useState(false)
    return (
        <>
            <Button variant="outlined" color="green" size="sm" onClick={() => setOpen(true)}>
                Migrate Spotify
            </Button>
            <MigrateSpotifyModal
                open={open}
                handler={() => setOpen(false)}
                artist_id={artist_id}
                artist_name={artist_name}
            />
        </>
    )
}
