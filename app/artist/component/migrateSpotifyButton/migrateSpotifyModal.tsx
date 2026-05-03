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
import { migrateArtistSpotify, confirmSpotifyArtist, MigrateSpotifyResult, SimpleResult } from './action'
import { SpotifyArtistCandidate } from '@/app/api/dtos/artist'

type View = 'confirm' | 'candidates' | 'done'

type Props = {
    open: boolean
    handler: () => void
    artist_id: string
    artist_name: string
}

export default function MigrateSpotifyModal({ open, handler, artist_id, artist_name }: Props) {
    const [view, setView] = useState<View>('confirm')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [candidates, setCandidates] = useState<SpotifyArtistCandidate[]>([])
    const [confirmingId, setConfirmingId] = useState<string | null>(null)
    const [resolvedArtistId, setResolvedArtistId] = useState<string>(artist_id)

    const handleClose = () => {
        setView('confirm')
        setLoading(false)
        setError(null)
        setCandidates([])
        setConfirmingId(null)
        handler()
    }

    const handleMigrate = async () => {
        setLoading(true)
        setError(null)
        const res = await migrateArtistSpotify(artist_id)
        setLoading(false)
        if (!res.success) {
            setError(res.error ?? 'Migration failed')
            return
        }
        if (res.status === 'candidates' && res.candidates?.length) {
            setCandidates(res.candidates)
            setResolvedArtistId(res.artist_id ?? artist_id)
            setView('candidates')
        } else {
            setView('done')
        }
    }

    const handleConfirm = async (spotify_artist_id: string) => {
        setConfirmingId(spotify_artist_id)
        setError(null)
        const res = await confirmSpotifyArtist(resolvedArtistId, spotify_artist_id)
        setConfirmingId(null)
        if (!res.success) {
            setError(res.error ?? 'Confirm failed')
            return
        }
        setView('done')
    }

    const dialogSize = view === 'candidates' ? 'lg' : 'sm'

    return (
        <Dialog
            open={open}
            handler={handleClose}
            animate={{ mount: { scale: 1, y: 0 }, unmount: { scale: 0.9, y: -100 } }}
            size={dialogSize}
        >
            <DialogHeader>
                {view === 'confirm' && 'Migrate Spotify'}
                {view === 'candidates' && `Select Spotify Artist for "${artist_name}"`}
                {view === 'done' && 'Migrate Spotify'}
            </DialogHeader>

            <DialogBody className={view === 'candidates' ? 'max-h-[60vh] overflow-y-auto' : ''}>
                {view === 'confirm' && (
                    <p className="text-sm text-gray-700">
                        Migrate Spotify data for <span className="font-semibold">{artist_name}</span>.
                    </p>
                )}

                {view === 'candidates' && (
                    <div className="flex flex-col gap-3">
                        <p className="text-sm text-gray-600 mb-1">
                            Multiple Spotify artists were found. Select the correct one to confirm.
                        </p>
                        {candidates.map((c) => (
                            <div
                                key={c.spotify_id}
                                className="flex items-center gap-4 border border-blue-gray-100 rounded-xl p-3 bg-gray-50"
                            >
                                {c.image_url ? (
                                    <img
                                        src={c.image_url}
                                        alt={c.name}
                                        className="w-16 h-16 rounded-full object-cover flex-shrink-0 shadow"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-blue-gray-100 flex-shrink-0 flex items-center justify-center text-blue-gray-300 text-2xl">♪</div>
                                )}
                                <div className="flex flex-col gap-1 flex-1 min-w-0">
                                    <span className="font-semibold text-blue-gray-800 text-sm">{c.name}</span>
                                    <div className="flex gap-3 text-xs text-gray-500">
                                        <span>Popularity: {c.popularity}</span>
                                        <span>Followers: {c.followers.toLocaleString()}</span>
                                    </div>
                                    {(c.genres?.length ?? 0) > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-0.5">
                                            {(c.genres ?? []).map((g) => (
                                                <span key={g} className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
                                                    {g}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <Button
                                    size="sm"
                                    variant="gradient"
                                    color="green"
                                    onClick={() => handleConfirm(c.spotify_id)}
                                    disabled={confirmingId !== null}
                                    className="flex items-center gap-1 flex-shrink-0"
                                >
                                    {confirmingId === c.spotify_id ? (
                                        <>
                                            <Spinner className="h-3 w-3" />
                                            <span>Confirming...</span>
                                        </>
                                    ) : (
                                        <span>Confirm</span>
                                    )}
                                </Button>
                            </div>
                        ))}
                    </div>
                )}

                {view === 'done' && (
                    <p className="text-sm font-medium text-green-600">
                        Migrated successfully.
                    </p>
                )}

                {error && (
                    <p className="mt-3 text-sm font-medium text-red-600">{error}</p>
                )}
            </DialogBody>

            <DialogFooter>
                <Button variant="text" color="red" onClick={handleClose} className="mr-1" disabled={loading || confirmingId !== null}>
                    {view === 'done' ? 'Close' : 'Cancel'}
                </Button>
                {view === 'confirm' && (
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
                )}
            </DialogFooter>
        </Dialog>
    )
}
