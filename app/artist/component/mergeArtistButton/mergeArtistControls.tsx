'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter } from '@/app/component/mtailwind'
import type { GetArtistListResponseArtist, MergeArtistsResponse } from '@/app/api/dtos/artist'
import { mergeArtists, searchMergeArtists } from './action'

type Artist = GetArtistListResponseArtist

function ArtistCard({ artist }: { artist: Artist }) {
    return <div className="flex min-w-0 items-center gap-3">
        {artist.image ? <img src={artist.image} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" /> :
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 font-semibold">{artist.name.charAt(0)}</div>}
        <div className="min-w-0 text-left">
            <p className="break-words font-semibold text-gray-900">{artist.name}</p>
            {artist.name_japan && <p className="text-xs text-gray-600">{artist.name_japan}</p>}
            <p className="break-all text-xs text-gray-500">{artist.id}</p>
            {artist.spotify_artist_id && <p className="text-xs text-green-700">Spotify linked</p>}
        </div>
    </div>
}

export default function MergeArtistButton() {
    const [open, setOpen] = useState(false)
    const [source, setSource] = useState<Artist | null>(null)
    const [selected, setSelected] = useState<Artist | null>(null)
    const [query, setQuery] = useState('')
    const [searchedQuery, setSearchedQuery] = useState('')
    const [artists, setArtists] = useState<Artist[]>([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [searching, setSearching] = useState(false)
    const [merging, setMerging] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [result, setResult] = useState<MergeArtistsResponse | null>(null)
    const searchVersion = useRef(0)
    const mergePending = useRef(false)

    async function search(name: string, requestedPage: number, sourceId?: string) {
        if (mergePending.current) return
        const version = ++searchVersion.current
        setSearching(true)
        setError(null)
        setSelected(null)
        setArtists([])
        setSearchedQuery('')
        setTotalPages(0)
        try {
            const response = await searchMergeArtists(name, requestedPage)
            if (version !== searchVersion.current) return
            if (!response.success) { setError(response.error); return }
            setArtists(response.data.artists.filter(artist => artist.id !== sourceId))
            setPage(response.data.page)
            setTotalPages(response.data.total_pages)
            setSearchedQuery(name.trim())
        } catch {
            if (version === searchVersion.current) setError('Could not search artists. Please try again.')
        } finally {
            if (version === searchVersion.current) setSearching(false)
        }
    }

    function openMerge() {
        if (mergePending.current) return
        searchVersion.current++
        setOpen(true)
        setSource(null)
        setSelected(null)
        setResult(null)
        setQuery('')
        setSearchedQuery('')
        setPage(1)
        setTotalPages(0)
        setArtists([])
        setSearching(false)
        setError(null)
    }

    function selectArtist(artist: Artist) {
        setError(null)
        if (source) {
            setSelected(artist)
            return
        }
        setSource(artist)
        setQuery(artist.name)
        void search(artist.name, 1, artist.id)
    }

    function changeSource() {
        if (!source || mergePending.current) return
        const name = source.name
        setSource(null)
        setSelected(null)
        setQuery(name)
        void search(name, 1)
    }

    function close() {
        if (mergePending.current) return
        searchVersion.current++
        setOpen(false)
        setSource(null)
        setSearching(false)
        setError(null)
    }

    async function confirmMerge() {
        if (!source || !selected || mergePending.current || searching) return
        mergePending.current = true
        setMerging(true)
        setError(null)
        try {
            const response = await mergeArtists(source.id, selected.id)
            if (!response.success) { setError(response.error); return }
            setResult(response.data)
        } catch {
            setError('Could not confirm the merge result. Check the artist list before retrying.')
        } finally {
            mergePending.current = false
            setMerging(false)
        }
    }

    return <>
        <Button variant="outlined" color="orange" type="button" onClick={openMerge}>Merge Artists</Button>
        <Dialog open={open} handler={close} size="lg">
            <DialogHeader>{result ? 'Artists merged' : 'Merge artist'}</DialogHeader>
            <DialogBody className="max-h-[70vh] overflow-y-auto">
                {result ? <div className="space-y-3 text-gray-700" role="status">
                    <p><strong>{source?.name}</strong> has been merged into <strong>{selected?.name}</strong>.</p>
                    <p>{result.moved_songs} songs moved. {result.already_linked_songs} songs were already linked.</p>
                    <Link href={`/artist/${result.target_artist_id}`} onClick={close} className="inline-block font-medium text-pink-600 underline">View remaining artist</Link>
                </div> : <div className="space-y-4">
                    <p className="text-sm text-gray-700">{source ? 'Step 2 of 2: Select the artist to keep.' : 'Step 1 of 2: Select the source artist to merge and remove.'}</p>
                    {source && <div className="rounded-lg border border-orange-200 bg-orange-50 p-3">
                        <div className="mb-2 flex items-center justify-between gap-2">
                            <p className="text-sm font-medium text-orange-900">Source artist · will be removed after merging</p>
                            <Button variant="text" size="sm" disabled={merging} onClick={changeSource}>Change</Button>
                        </div>
                        <ArtistCard artist={source} />
                    </div>}
                    <form onSubmit={event => { event.preventDefault(); void search(query, 1, source?.id) }} className="flex items-end gap-2">
                        <div className="min-w-0 flex-1">
                            <label htmlFor="merge-artist-search" className="mb-1 block text-sm font-medium text-gray-700">{source ? 'Find the artist to keep' : 'Find the source artist'}</label>
                            <input id="merge-artist-search" type="search" value={query} disabled={merging} autoFocus
                                onChange={event => {
                                    searchVersion.current++
                                    setSearching(false)
                                    setQuery(event.target.value)
                                    setArtists([])
                                    setSelected(null)
                                    setSearchedQuery('')
                                    setTotalPages(0)
                                    setError(null)
                                }}
                                placeholder="Search artist name..." className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" />
                        </div>
                        <Button type="submit" color="pink" size="sm" disabled={merging || searching || !query.trim()}>{searching ? 'Searching...' : 'Search'}</Button>
                    </form>
                    {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
                    <div aria-live="polite" aria-busy={searching} className="space-y-2">
                        {searching && <p className="text-sm text-gray-500">Searching artists...</p>}
                        {!searching && !searchedQuery && !error && <p className="text-sm text-gray-500">Enter a name and search to select an artist.</p>}
                        {!searching && searchedQuery && artists.length === 0 && <p className="text-sm text-gray-500">{source ? 'No other artists found on this page.' : 'No artists found on this page.'} Try another name or page.</p>}
                        {artists.map(artist => <button key={artist.id} type="button" disabled={merging} aria-pressed={selected?.id === artist.id}
                            onClick={() => selectArtist(artist)}
                            className={`w-full rounded-lg border p-3 transition-colors disabled:opacity-60 ${selected?.id === artist.id ? 'border-pink-500 bg-pink-50 ring-1 ring-pink-500' : 'border-gray-200 hover:bg-gray-50'}`}>
                            <ArtistCard artist={artist} />
                        </button>)}
                    </div>
                    {totalPages > 1 && <div className="flex items-center justify-between gap-2 text-sm">
                        <Button variant="text" size="sm" disabled={searching || merging || page <= 1} onClick={() => void search(searchedQuery, page - 1, source?.id)}>Previous</Button>
                        <span>Page {page} of {totalPages}</span>
                        <Button variant="text" size="sm" disabled={searching || merging || page >= totalPages} onClick={() => void search(searchedQuery, page + 1, source?.id)}>Next</Button>
                    </div>}
                    {source && selected && <div className="space-y-3 rounded-lg border border-pink-200 bg-pink-50 p-3 text-sm text-gray-700">
                        <p className="font-medium text-gray-900">Merge {source.name} → {selected.name}</p>
                        <p>All songs will be linked to the selected artist. Existing song links will be kept once. The source artist will be removed from the list.</p>
                        <p>The selected artist&apos;s name, image and Spotify data will be kept.</p>
                        <ArtistCard artist={selected} />
                    </div>}
                </div>}
            </DialogBody>
            <DialogFooter className="gap-2">
                <Button variant="text" color="gray" onClick={close} disabled={merging}>{result ? 'Done' : 'Cancel'}</Button>
                {!result && <Button color="orange" disabled={!source || !selected || searching || merging} onClick={() => void confirmMerge()}>{merging ? 'Merging...' : 'Confirm merge'}</Button>}
            </DialogFooter>
        </Dialog>
    </>
}
