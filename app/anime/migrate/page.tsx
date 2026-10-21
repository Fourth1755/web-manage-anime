"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { loadMigratedAnime, migrateAnime, MigrationResult } from "./action";
import VisibilityToggle from "./visibilityToggle";

const STORAGE_KEY = "anime-migration:last-range";
type SavedRange = { mode: "single" | "multiple"; start: number; end: number };

export default function MigrateAnimePage() {
    const [mode, setMode] = useState<"single" | "multiple">("single");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<MigrationResult | null>(null);
    const [completedRange, setCompletedRange] = useState("");
    const [savedRange, setSavedRange] = useState<SavedRange | null>(null);
    const [storageError, setStorageError] = useState("");
    const [restoring, setRestoring] = useState(false);
    const [restoredResult, setRestoredResult] = useState(false);
    const busy = loading || restoring;

    useEffect(() => {
        let cancelled = false;
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            const saved = JSON.parse(raw) as SavedRange;
            if (!saved || (saved.mode !== "single" && saved.mode !== "multiple") ||
                !Number.isSafeInteger(saved.start) || !Number.isSafeInteger(saved.end) ||
                saved.start < 1 || saved.end < saved.start || (saved.mode === "single" && saved.end !== saved.start)) return;
            setSavedRange(saved);
            setMode(saved.mode);
            setStart(String(saved.start));
            setEnd(String(saved.end));
            setCompletedRange(saved.mode === "single" ? String(saved.start) : `${saved.start}–${saved.end}`);
            setRestoredResult(true);
            setRestoring(true);
            loadMigratedAnime(saved.start, saved.end)
                .then(response => { if (!cancelled) setResult(response); })
                .catch(() => {
                    if (!cancelled) setResult({ success: false, error: "Unable to load anime from the saved MAL ID range. Please reload the page to try again." });
                })
                .finally(() => { if (!cancelled) setRestoring(false); });
        } catch {
            setStorageError("Unable to read the saved MAL ID range in this browser.");
        }
        return () => { cancelled = true; };
    }, []);

    function clearSavedRange() {
        try {
            localStorage.removeItem(STORAGE_KEY);
            setSavedRange(null);
            setStart("");
            setEnd("");
            setStorageError("");
            setResult(null);
            setCompletedRange("");
            setRestoredResult(false);
        } catch {
            setStorageError("Unable to clear the saved MAL ID range in this browser.");
        }
    }

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (busy) return;
        setLoading(true);
        setResult(null);
        setRestoredResult(false);
        try {
            const last = mode === "single" ? Number(start) : Number(end);
            const response = await migrateAnime(mode, Number(start), last);
            if (response.success) {
                const saved: SavedRange = { mode, start: Number(start), end: last };
                setSavedRange(saved);
                try {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
                    setStorageError("");
                } catch {
                    setStorageError("Migration completed, but the MAL ID range could not be saved in this browser.");
                }
            }
            setCompletedRange(mode === "single" ? start : `${start}–${end}`);
            setResult(response);
        } catch {
            setResult({ success: false, error: "Unable to confirm migration status. Please check the anime list before retrying." });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mx-auto w-full max-w-screen-xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">Migrate Anime</h1>
            {savedRange && (
                <div className="flex max-w-xl flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <p className="text-sm">Last successful migration: MAL ID {savedRange.start}–{savedRange.end}</p>
                    <button type="button" disabled={busy} onClick={clearSavedRange} className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100 disabled:opacity-50">Clear saved range</button>
                </div>
            )}
            {storageError && <p role="alert" className="text-sm text-amber-700">{storageError}</p>}
            <form onSubmit={submit} className="max-w-xl space-y-5 rounded-xl border border-gray-200 bg-white p-6" aria-busy={busy}>
                <fieldset disabled={busy} className="space-y-5">
                    <legend className="mb-3 font-medium">Migration mode</legend>
                    <div className="flex gap-6">
                        {(["single", "multiple"] as const).map(value => (
                            <label key={value} className="flex items-center gap-2">
                                <input type="radio" name="mode" checked={mode === value} onChange={() => { setMode(value); setResult(null); }} />
                                {value === "single" ? "Single anime" : "Multiple anime"}
                            </label>
                        ))}
                    </div>
                    <label className="block text-sm font-medium">
                        {mode === "single" ? "MAL ID" : "Start MAL ID"}
                        <input required type="number" min="1" max={Number.MAX_SAFE_INTEGER} step="1" value={start} onChange={e => setStart(e.target.value)} className="mt-2 block w-full rounded-lg border border-gray-300 p-3" />
                    </label>
                    {mode === "multiple" && (
                        <label className="block text-sm font-medium">
                            End MAL ID
                            <input required type="number" min={Number(start) || 1} max={Number.MAX_SAFE_INTEGER} step="1" value={end} onChange={e => setEnd(e.target.value)} className="mt-2 block w-full rounded-lg border border-gray-300 p-3" />
                        </label>
                    )}
                    <button type="submit" className="rounded-lg bg-pink-600 px-5 py-3 text-sm font-medium text-white hover:bg-pink-700 disabled:opacity-50">
                        {restoring ? "Loading saved results…" : loading ? "Migrating… Please wait" : "Start Migrate"}
                    </button>
                </fieldset>
            </form>
            <div aria-live="polite" aria-busy={restoring}>
                {restoring && <p className="text-sm text-gray-600">Loading anime from the last saved MAL ID range…</p>}
                {result && (
                    <div className="space-y-4">
                        <p className={result.success ? "text-green-700" : "text-red-700"}>
                            {result.success ? (restoredResult ? "Loaded anime from the last saved migration range." : result.alreadyExists ? "This anime already exists in the database." : "Migration completed successfully.") : result.error}
                        </p>
                        {result.resultsError && <p role="alert" className="text-amber-700">{result.resultsError}</p>}
                        {result.animes && (
                            <section className="space-y-3">
                                <h2 className="text-lg font-semibold">Anime available after migration (MAL ID {completedRange}) — {result.animes.length}</h2>
                                <p className="text-sm text-gray-600">Results include anime already present in this range.</p>
                                {result.animes.length === 0 ? <p>No anime found in this range after migration.</p> : (
                                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-gray-50"><tr><th className="px-4 py-3">Image</th><th className="px-4 py-3">MAL ID</th><th className="px-4 py-3">Anime</th><th className="px-4 py-3">Show anime</th><th className="px-4 py-3">Detail</th></tr></thead>
                                            <tbody>{result.animes.map(anime => (
                                                <tr key={anime.id} className="border-t border-gray-200">
                                                    <td className="px-4 py-3">{anime.image ? <img src={anime.image} alt={anime.name} loading="lazy" width={80} height={112} className="h-28 w-20 max-w-none rounded-lg object-cover" onError={event => { event.currentTarget.style.display = "none"; }} /> : <span className="text-gray-500">No image</span>}</td>
                                                    <td className="px-4 py-3">{anime.my_anime_list_id}</td>
                                                    <td className="px-4 py-3"><p className="font-medium">{anime.name}</p>{anime.name_thai && <p className="text-gray-600">{anime.name_thai}</p>}</td>
                                                    <td className="px-4 py-3"><VisibilityToggle anime={anime} /></td>
                                                    <td className="px-4 py-3"><Link href={`/anime/${anime.my_anime_list_id}`} className="text-pink-600 hover:underline">View anime</Link></td>
                                                </tr>
                                            ))}</tbody>
                                        </table>
                                    </div>
                                )}
                            </section>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
