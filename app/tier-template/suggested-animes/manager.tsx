'use client';

import { useState } from 'react';
import { GetAnimeList } from '@/app/api/dtos/anime';
import { SuggestedAnimeSettings, TierSuggestedAnime } from '@/app/api/dtos/tierSuggestedAnime';
import { saveSuggestedAnime, searchSuggestedAnime } from './action';

function AnimePicture({ image, name }: { image?: string; name: string }) {
    return image
        ? <img src={image} alt={name} className="h-16 w-12 shrink-0 rounded object-cover" />
        : <div className="flex h-16 w-12 shrink-0 items-center justify-center rounded bg-gray-100 text-xs text-gray-400">No image</div>;
}

function SuggestionRow({ item, busy, onSave, onRemove }: {
    item: TierSuggestedAnime;
    busy: boolean;
    onSave: (settings: SuggestedAnimeSettings) => Promise<boolean>;
    onRemove: () => void;
}) {
    const [position, setPosition] = useState(String(item.position));
    const [active, setActive] = useState(item.is_active);
    return (
        <tr className="border-b hover:bg-gray-50">
            <td className="min-w-[220px] px-4 py-3"><div className="flex items-center gap-3">
                <AnimePicture image={item.image} name={item.name} />
                <div><p className="font-medium">{item.name || 'Unavailable anime'}</p><p className="text-xs text-gray-500">{item.name_thai}</p></div>
            </div></td>
            <td className="px-4 py-3">
                <form id={`suggestion-${item.id}`} onSubmit={async (event) => {
                    event.preventDefault();
                    await onSave({ position: Number(position), is_active: active });
                }}>
                    <input aria-label={`Position for ${item.name}`} type="number" min="0" step="1" required value={position} disabled={busy}
                        onChange={(event) => setPosition(event.target.value)} className="w-24 rounded border p-2 disabled:opacity-50" />
                </form>
            </td>
            <td className="whitespace-nowrap px-4 py-3"><label className="flex items-center gap-2">
                <input type="checkbox" checked={active} disabled={busy} onChange={(event) => setActive(event.target.checked)} />
                Enabled<span className="sr-only"> for {item.name}</span>
            </label></td>
            <td className="whitespace-nowrap px-4 py-3">
                <button type="submit" form={`suggestion-${item.id}`} disabled={busy} className="mr-3 rounded bg-green-500 px-3 py-2 text-white hover:bg-green-600 disabled:opacity-50">Save</button>
                <button type="button" disabled={busy} onClick={onRemove} className="text-red-600 hover:underline disabled:opacity-50">Remove<span className="sr-only"> {item.name}</span></button>
            </td>
        </tr>
    );
}

export default function SuggestedAnimeManager({ initialItems }: { initialItems: TierSuggestedAnime[] }) {
    const [items, setItems] = useState(initialItems);
    const [query, setQuery] = useState('');
    const [searchedQuery, setSearchedQuery] = useState('');
    const [results, setResults] = useState<GetAnimeList[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [hasSearched, setHasSearched] = useState(false);
    const [searching, setSearching] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');

    async function search(name: string, nextPage: number) {
        setSearching(true);
        setError('');
        try {
            const result = await searchSuggestedAnime(name, nextPage);
            if (!result.ok) { setError(result.error); return; }
            setResults(result.animes);
            setTotalPages(result.totalPages);
            setPage(nextPage);
            setSearchedQuery(name);
            setHasSearched(true);
        } catch {
            setError('Search failed. Please try again.');
        } finally { setSearching(false); }
    }

    async function mutate(operation: 'create' | 'update' | 'delete', item: TierSuggestedAnime, settings: SuggestedAnimeSettings): Promise<boolean> {
        setBusy(true);
        setError('');
        setNotice('');
        try {
            const result = await saveSuggestedAnime(operation, item.id, settings);
            if (!result.ok) { setError(result.error); return false; }
            setItems((current) => operation === 'delete' ? current.filter((entry) => entry.id !== item.id)
                : operation === 'create' ? [...current, { ...item, ...settings }]
                : current.map((entry) => entry.id === item.id ? { ...entry, ...settings } : entry));
            setNotice(operation === 'delete' ? 'Suggestion removed.' : operation === 'create' ? 'Suggestion added.' : 'Suggestion saved.');
            return true;
        } catch {
            setError('Unable to save changes. Please try again.');
            return false;
        } finally { setBusy(false); }
    }

    const orderedItems = [...items].sort((a, b) => a.position - b.position || a.id.localeCompare(b.id));
    const nextPosition = items.length ? Math.max(...items.map((item) => item.position)) + 1 : 0;
    return (
        <div className="space-y-6">
            {error && <p role="alert" className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            {notice && <p role="status" className="rounded border border-green-200 bg-green-50 p-3 text-sm text-green-700">{notice}</p>}
            <section className="rounded-lg border bg-white p-5 shadow-sm" aria-labelledby="add-suggestion">
                <h2 id="add-suggestion" className="font-medium">Add anime</h2>
                <form className="mt-3 flex gap-3" onSubmit={(event) => { event.preventDefault(); void search(query.trim(), 1); }}>
                    <input aria-label="Search anime by name" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search anime by name" className="min-w-0 flex-1 rounded border p-2" />
                    <button disabled={searching || busy} className="rounded bg-pink-500 px-4 py-2 text-sm text-white hover:bg-pink-600 disabled:opacity-50">{searching ? 'Searching...' : 'Search'}</button>
                </form>
                {hasSearched && <div className="mt-4 space-y-3">
                    {results.length === 0 && <p className="text-sm text-gray-500">No anime found.</p>}
                    {results.map((anime) => {
                        const alreadyAdded = items.some((item) => item.id === anime.id);
                        return <div key={anime.id} className="flex items-center gap-3 rounded border p-3">
                            <AnimePicture image={anime.image} name={anime.name} />
                            <div className="min-w-0 flex-1"><p className="font-medium">{anime.name}</p><p className="text-sm text-gray-500">{anime.name_thai}</p>{anime.status !== 'active' && <p className="text-xs text-gray-500">Inactive anime</p>}</div>
                            <button disabled={busy || searching || alreadyAdded || anime.status !== 'active'} onClick={() => void mutate('create', { ...anime, position: nextPosition, is_active: true }, { position: nextPosition, is_active: true })}
                                className="rounded border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50">{alreadyAdded ? 'Added' : 'Add'}</button>
                        </div>;
                    })}
                    {totalPages > 1 && <div className="flex items-center justify-end gap-3 text-sm">
                        <button disabled={searching || busy || page <= 1} onClick={() => void search(searchedQuery, page - 1)} className="rounded border px-3 py-2 disabled:opacity-50">Previous</button>
                        <span>Page {page} of {totalPages}</span>
                        <button disabled={searching || busy || page >= totalPages} onClick={() => void search(searchedQuery, page + 1)} className="rounded border px-3 py-2 disabled:opacity-50">Next</button>
                    </div>}
                </div>}
            </section>
            <section aria-labelledby="suggestion-list">
                <div className="mb-3"><h2 id="suggestion-list" className="font-medium">Suggestions ({items.length})</h2>
                    <p className="mt-1 text-sm text-gray-500">Lower positions appear first. Save each row after editing. Users see enabled suggestions for visible, active anime.</p>
                </div>
                <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-700"><tr><th className="px-4 py-3">Anime</th><th className="px-4 py-3">Position</th><th className="px-4 py-3">Visibility</th><th className="px-4 py-3">Actions</th></tr></thead>
                        <tbody>{orderedItems.map((item) => <SuggestionRow key={item.id} item={item} busy={busy}
                            onSave={(settings) => mutate('update', item, settings)}
                            onRemove={() => { void mutate('delete', item, { position: item.position, is_active: item.is_active }); }} />)}
                            {items.length === 0 && <tr><td colSpan={4} className="px-4 py-10 text-center text-gray-500">No suggestions yet. Search for an anime above to add one.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
