'use client'

import { useRef, useState, type FormEvent } from 'react'
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Input, Spinner, Typography } from '@/app/component/mtailwind'
import { createArtistSong } from './action'

type Props = {
    artistId: string
    artistName: string
    onClose: () => void
    onSaved: (message: string) => void
}

export default function CreateSongModal({ artistId, artistName, onClose, onSaved }: Props) {
    const [name, setName] = useState('')
    const [isAnimeSong, setIsAnimeSong] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const pending = useRef(false)

    const handleClose = () => {
        if (!pending.current) onClose()
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (pending.current) return
        if (!name.trim()) {
            setError('Song name is required.')
            return
        }
        pending.current = true
        setSubmitting(true)
        setError('')
        try {
            const result = await createArtistSong(artistId, { name: name.trim(), is_anime_song: isAnimeSong })
            if (!result.success) {
                setError(result.error)
                return
            }
            onSaved(result.message)
        } catch {
            setError('Unable to create song. Please try again.')
        } finally {
            pending.current = false
            setSubmitting(false)
        }
    }

    return (
        <Dialog open handler={handleClose} size="sm">
            <DialogHeader>Create Song</DialogHeader>
            <form onSubmit={handleSubmit}>
                <DialogBody className="grid gap-5">
                    <div className="rounded-lg bg-gray-50 p-3">
                        <Typography variant="small" className="text-gray-500">Artist</Typography>
                        <Typography className="font-medium text-blue-gray-900">{artistName}</Typography>
                    </div>
                    <Input
                        label="Song name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        crossOrigin={undefined}
                        required
                        autoFocus
                        disabled={submitting}
                    />
                    <label className="flex cursor-pointer items-center gap-3 text-blue-gray-800">
                        <input
                            type="checkbox"
                            checked={isAnimeSong}
                            onChange={(event) => setIsAnimeSong(event.target.checked)}
                            disabled={submitting}
                            className="h-4 w-4 accent-green-600"
                        />
                        Anime song
                    </label>
                    {error && <p role="alert" className="text-sm font-medium text-red-600">{error}</p>}
                </DialogBody>
                <DialogFooter className="gap-2">
                    <Button type="button" variant="text" color="red" onClick={handleClose} disabled={submitting}>
                        Cancel
                    </Button>
                    <Button type="submit" color="green" disabled={submitting || !name.trim()} className="flex items-center gap-2">
                        {submitting && <Spinner className="h-4 w-4" />}
                        {submitting ? 'Creating...' : 'Create Song'}
                    </Button>
                </DialogFooter>
            </form>
        </Dialog>
    )
}
