"use client"

import { useEffect, useState } from "react"
import {
    Button,
    Dialog,
    DialogBody,
    DialogFooter,
    DialogHeader,
    Input,
    Spinner,
    Textarea,
    Typography,
} from "../../../../component/mtailwind"
import { CreateAnimeSongForAnimeRequest, CreateAnimeSongThemeRequest } from "@/app/api/dtos/song"
import { createSong, getAllArtist } from "./action"

type Props = {
    open: boolean
    handler: () => void
    anime_id: string
    anime_name: string
    onCreated: (message: string) => void
}

type ArtistOption = {
    id: string
    name: string
    image: string
}

type ThemeForm = {
    type: CreateAnimeSongThemeRequest["type"]
    sequence: string
    episodes: string
}

const emptyTheme = (): ThemeForm => ({
    type: "OPENING",
    sequence: "1",
    episodes: "",
})

const emptyForm = () => ({
    name: "",
    name_japan: "",
    description: "",
})

export default function CreateSongModal({ open, handler, anime_id, anime_name, onCreated }: Props) {
    const [form, setForm] = useState(emptyForm)
    const [themes, setThemes] = useState<ThemeForm[]>([emptyTheme()])
    const [artists, setArtists] = useState<ArtistOption[]>([])
    const [selectedArtists, setSelectedArtists] = useState<string[]>([])
    const [loadingArtists, setLoadingArtists] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        if (!open || artists.length > 0) return

        let active = true
        setLoadingArtists(true)
        getAllArtist()
            .then((response) => {
                if (active) setArtists(response.artists ?? [])
            })
            .catch(() => {
                if (active) setError("Unable to load artists")
            })
            .finally(() => {
                if (active) setLoadingArtists(false)
            })

        return () => {
            active = false
        }
    }, [open, artists.length])

    const reset = () => {
        setForm(emptyForm())
        setThemes([emptyTheme()])
        setSelectedArtists([])
        setError("")
        setSubmitting(false)
    }

    const handleClose = () => {
        if (submitting) return
        reset()
        handler()
    }

    const updateTheme = (index: number, field: keyof ThemeForm, value: string) => {
        setThemes((current) => current.map((theme, themeIndex) => (
            themeIndex === index ? { ...theme, [field]: value } : theme
        )))
    }

    const toggleArtist = (artistId: string) => {
        setSelectedArtists((current) => (
            current.includes(artistId)
                ? current.filter((id) => id !== artistId)
                : [...current, artistId]
        ))
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError("")

        if (!form.name.trim()) {
            setError("Song name is required")
            return
        }

        if (themes.some((theme) => !theme.episodes.trim() || Number(theme.sequence) < 1)) {
            setError("Every theme must have a sequence of at least 1 and an episode range")
            return
        }

        if (selectedArtists.length === 0) {
            setError("Select at least one artist")
            return
        }

        const request: CreateAnimeSongForAnimeRequest = {
            name: form.name.trim(),
            name_japan: form.name_japan.trim(),
            description: form.description.trim(),
            themes: themes.map((theme) => ({
                type: theme.type,
                sequence: Number(theme.sequence),
                episodes: theme.episodes.trim(),
            })),
            artist_list: selectedArtists,
        }

        setSubmitting(true)
        const result = await createSong(anime_id, request)
        setSubmitting(false)

        if (!result.success) {
            setError(result.error)
            return
        }

        reset()
        onCreated(result.message)
    }

    return (
        <Dialog open={open} handler={handleClose} size="lg">
            <DialogHeader className="flex flex-col items-start gap-1">
                <span>Create Song</span>
                <Typography variant="small" className="font-normal text-gray-500">
                    {anime_name}
                </Typography>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
                <DialogBody className="max-h-[70vh] overflow-y-auto">
                    <div className="grid gap-5">
                        <div className="grid gap-4 md:grid-cols-2">
                            <Input
                                label="Song name *"
                                crossOrigin={undefined}
                                value={form.name}
                                onChange={(event) => setForm({ ...form, name: event.target.value })}
                            />
                            <Input
                                label="Japanese name"
                                crossOrigin={undefined}
                                value={form.name_japan}
                                onChange={(event) => setForm({ ...form, name_japan: event.target.value })}
                            />
                        </div>

                        <Textarea
                            label="Description"
                            value={form.description}
                            onChange={(event) => setForm({ ...form, description: event.target.value })}
                        />

                        <section className="rounded-lg border border-blue-gray-100 p-4">
                            <div className="mb-4 flex items-center justify-between">
                                <Typography variant="h6">Themes</Typography>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outlined"
                                    onClick={() => setThemes((current) => [...current, emptyTheme()])}
                                >
                                    + Add Theme
                                </Button>
                            </div>
                            <div className="grid gap-3">
                                {themes.map((theme, index) => (
                                    <div key={index} className="grid items-center gap-3 rounded-lg bg-gray-50 p-3 md:grid-cols-[1fr_120px_1fr_auto]">
                                        <select
                                            aria-label={`Theme ${index + 1} type`}
                                            value={theme.type}
                                            onChange={(event) => updateTheme(index, "type", event.target.value)}
                                            className="h-10 rounded-md border border-blue-gray-200 bg-white px-3 text-sm text-blue-gray-700"
                                        >
                                            <option value="OPENING">Opening</option>
                                            <option value="ENDING">Ending</option>
                                            <option value="SOUNDTRACK">Soundtrack</option>
                                        </select>
                                        <Input
                                            label="Sequence"
                                            type="number"
                                            min={1}
                                            crossOrigin={undefined}
                                            value={theme.sequence}
                                            onChange={(event) => updateTheme(index, "sequence", event.target.value)}
                                        />
                                        <Input
                                            label="Episodes *"
                                            placeholder="1-26"
                                            crossOrigin={undefined}
                                            value={theme.episodes}
                                            onChange={(event) => updateTheme(index, "episodes", event.target.value)}
                                        />
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="text"
                                            color="red"
                                            disabled={themes.length === 1}
                                            onClick={() => setThemes((current) => current.filter((_, themeIndex) => themeIndex !== index))}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="rounded-lg border border-blue-gray-100 p-4">
                            <Typography variant="h6" className="mb-3">Artists *</Typography>
                            {loadingArtists ? (
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Spinner className="h-4 w-4" /> Loading artists...
                                </div>
                            ) : artists.length === 0 ? (
                                <Typography variant="small" className="text-gray-500">No artists found.</Typography>
                            ) : (
                                <div className="grid max-h-48 gap-2 overflow-y-auto md:grid-cols-2">
                                    {artists.map((artist) => (
                                        <label key={artist.id} className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-2 hover:bg-gray-50">
                                            <input
                                                type="checkbox"
                                                checked={selectedArtists.includes(artist.id)}
                                                onChange={() => toggleArtist(artist.id)}
                                                className="h-4 w-4 accent-green-500"
                                            />
                                            {artist.image ? (
                                                <img src={artist.image} alt={artist.name} className="h-8 w-8 rounded-full object-cover" />
                                            ) : (
                                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold">
                                                    {artist.name.charAt(0).toUpperCase()}
                                                </span>
                                            )}
                                            <span className="text-sm text-gray-800">{artist.name}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </section>

                        {error && <p className="text-sm font-medium text-red-600">{error}</p>}
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Button variant="text" color="red" onClick={handleClose} disabled={submitting} className="mr-1">
                        Cancel
                    </Button>
                    <Button type="submit" variant="gradient" color="green" disabled={submitting || loadingArtists} className="flex items-center gap-2">
                        {submitting && <Spinner className="h-4 w-4" />}
                        {submitting ? "Creating..." : "Create Song"}
                    </Button>
                </DialogFooter>
            </form>
        </Dialog>
    )
}
