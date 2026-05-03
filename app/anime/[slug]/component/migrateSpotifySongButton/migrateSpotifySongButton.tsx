'use client'

import { useState } from 'react'
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Spinner,
} from '@/app/component/mtailwind'
import { migrateSpotifySong, confirmSpotifySong, MigrateSpotifySongResult } from './action'
import { SpotifyTrackCandidate } from '@/app/api/dtos/song'

type View = 'confirm' | 'candidates' | 'done'

type Props = {
    song_id: string
    song_name: string
    anime_id: string
}

function formatDuration(ms: number): string {
    const totalSec = Math.floor(ms / 1000)
    const min = Math.floor(totalSec / 60)
    const sec = totalSec % 60
    return `${min}:${sec.toString().padStart(2, '0')}`
}

export default function MigrateSpotifySongButton({ song_id, song_name, anime_id }: Props) {
    const [open, setOpen] = useState(false)
    const [view, setView] = useState<View>('confirm')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [candidates, setCandidates] = useState<SpotifyTrackCandidate[]>([])
    const [confirmingId, setConfirmingId] = useState<string | null>(null)
    const [resolvedSongId, setResolvedSongId] = useState<string>(song_id)

    const handleClose = () => {
        setView('confirm')
        setLoading(false)
        setError(null)
        setCandidates([])
        setConfirmingId(null)
        setOpen(false)
    }

    const handleMigrate = async () => {
        setLoading(true)
        setError(null)
        const res = await migrateSpotifySong(song_id, anime_id)
        setLoading(false)
        if (!res.success) {
            setError(res.error ?? 'Migration failed')
            return
        }
        if (res.status === 'candidates' && res.candidates?.length) {
            setCandidates(res.candidates)
            setResolvedSongId(res.song_id ?? song_id)
            setView('candidates')
        } else {
            setView('done')
        }
    }

    const handleConfirm = async (spotify_track_id: string) => {
        setConfirmingId(spotify_track_id)
        setError(null)
        const res = await confirmSpotifySong(resolvedSongId, spotify_track_id, anime_id)
        setConfirmingId(null)
        if (!res.success) {
            setError(res.error ?? 'Confirm failed')
            return
        }
        setView('done')
    }

    const dialogSize = view === 'candidates' ? 'lg' : 'sm'

    return (
        <>
            <Button size="sm" variant="outlined" color="green" onClick={() => setOpen(true)}>
                Migrate Spotify
            </Button>
            <Dialog
                open={open}
                handler={handleClose}
                animate={{ mount: { scale: 1, y: 0 }, unmount: { scale: 0.9, y: -100 } }}
                size={dialogSize}
            >
                <DialogHeader>
                    {view === 'confirm' && 'Migrate Spotify Song'}
                    {view === 'candidates' && `Select Spotify Track for "${song_name}"`}
                    {view === 'done' && 'Migrate Spotify Song'}
                </DialogHeader>

                <DialogBody className={view === 'candidates' ? 'max-h-[60vh] overflow-y-auto' : ''}>
                    {view === 'confirm' && (
                        <p className="text-sm text-gray-700">
                            Migrate Spotify data for <span className="font-semibold">{song_name}</span>.
                        </p>
                    )}

                    {view === 'candidates' && (
                        <div className="flex flex-col gap-3">
                            <p className="text-sm text-gray-600 mb-1">
                                Multiple Spotify tracks were found. Select the correct one to confirm.
                            </p>
                            {candidates.map((c) => (
                                <div
                                    key={c.spotify_id}
                                    className="flex items-center gap-4 border border-blue-gray-100 rounded-xl p-3 bg-gray-50"
                                >
                                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                                        <span className="font-semibold text-blue-gray-800 text-sm">{c.name}</span>
                                        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                                            <span>Album: {c.album}</span>
                                            <span>Duration: {formatDuration(c.duration_ms)}</span>
                                        </div>
                                        {(c.artists?.length ?? 0) > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-0.5">
                                                {(c.artists ?? []).map((a) => (
                                                    <span key={a} className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
                                                        {a}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        {c.preview_url && (
                                            <audio controls src={c.preview_url} className="mt-1 h-7 w-full max-w-xs" />
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
        </>
    )
}
