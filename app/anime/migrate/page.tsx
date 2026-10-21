"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { migrateAnime, MigrationResult } from "./action";

export default function MigrateAnimePage() {
    const [mode, setMode] = useState<"single" | "multiple">("single");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<MigrationResult | null>(null);
    const [completedRange, setCompletedRange] = useState("");

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (loading) return;
        setLoading(true);
        setResult(null);
        try {
            const last = mode === "single" ? Number(start) : Number(end);
            const response = await migrateAnime(mode, Number(start), last);
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
            <form onSubmit={submit} className="max-w-xl space-y-5 rounded-xl border border-gray-200 bg-white p-6" aria-busy={loading}>
                <fieldset disabled={loading} className="space-y-5">
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
                        {loading ? "Migrating… Please wait" : "Start Migrate"}
                    </button>
                </fieldset>
            </form>
            <div aria-live="polite">
                {result && (
                    <div className="space-y-4">
                        <p className={result.success ? "text-green-700" : "text-red-700"}>
                            {result.success ? (result.alreadyExists ? "This anime already exists in the database." : "Migration completed successfully.") : result.error}
                        </p>
                        {result.resultsError && <p role="alert" className="text-amber-700">{result.resultsError}</p>}
                        {result.animes && (
                            <section className="space-y-3">
                                <h2 className="text-lg font-semibold">Anime available after migration (MAL ID {completedRange}) — {result.animes.length}</h2>
                                <p className="text-sm text-gray-600">Results include anime already present in this range.</p>
                                {result.animes.length === 0 ? <p>No anime found in this range after migration.</p> : (
                                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-gray-50"><tr><th className="px-4 py-3">MAL ID</th><th className="px-4 py-3">Anime</th><th className="px-4 py-3">Detail</th></tr></thead>
                                            <tbody>{result.animes.map(anime => (
                                                <tr key={anime.id} className="border-t border-gray-200">
                                                    <td className="px-4 py-3">{anime.my_anime_list_id}</td>
                                                    <td className="px-4 py-3"><p className="font-medium">{anime.name}</p>{anime.name_thai && <p className="text-gray-600">{anime.name_thai}</p>}</td>
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
