'use client'

import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Spinner,
} from '@/app/component/mtailwind'
import { useState } from 'react'
import { migrateArtistSpotify, MigrateResult } from './action'

type Props = {
    open: boolean
    handler: () => void
    artist_id: string
    artist_name: string
}

export default function MigrateSpotifyModal({ open, handler, artist_id, artist_name }: Props) {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<MigrateResult | null>(null)

    const handleClose = () => {
        setResult(null)
        setLoading(false)
        handler()
    }

    const handleMigrate = async () => {
        setLoading(true)
        setResult(null)
        const res = await migrateArtistSpotify(artist_id)
        setLoading(false)
        setResult(res)
    }

    return (
        <Dialog
            open={open}
            handler={handleClose}
            animate={{ mount: { scale: 1, y: 0 }, unmount: { scale: 0.9, y: -100 } }}
            size="sm"
        >
            <DialogHeader>Migrate Spotify</DialogHeader>
            <DialogBody>
                <p className="text-sm text-gray-700">
                    Migrate Spotify data for <span className="font-semibold">{artist_name}</span>.
                </p>
                {result && (
                    <p className={`mt-3 text-sm font-medium ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                        {result.success ? 'Migrated successfully.' : result.error}
                    </p>
                )}
            </DialogBody>
            <DialogFooter>
                <Button variant="text" color="red" onClick={handleClose} className="mr-1" disabled={loading}>
                    Cancel
                </Button>
                <Button
                    variant="gradient"
                    color="green"
                    onClick={handleMigrate}
                    disabled={loading}
                    className="flex items-center gap-2"
                >
                    {loading ? (
                        <>
                            <Spinner className="h-4 w-4" />
                            <span>Migrating...</span>
                        </>
                    ) : (
                        <span>Start Migrate</span>
                    )}
                </Button>
            </DialogFooter>
        </Dialog>
    )
}
