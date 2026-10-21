'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function AnimeSearchInput({ defaultValue, defaultStart = '', defaultEnd = '' }: { defaultValue: string; defaultStart?: string; defaultEnd?: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [value, setValue] = useState(defaultValue);
    const [start, setStart] = useState(defaultStart);
    const [end, setEnd] = useState(defaultEnd);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', '1');
        if (value.trim()) {
            params.set('name', value.trim());
        } else {
            params.delete('name');
        }
        if (start) params.set('mal_id_start', start);
        else params.delete('mal_id_start');
        if (end) params.set('mal_id_end', end);
        else params.delete('mal_id_end');
        router.push(`?${params.toString()}`);
    }

    function handleClearFilters() {
        setValue('');
        setStart('');
        setEnd('');
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', '1');
        params.delete('name');
        params.delete('mal_id_start');
        params.delete('mal_id_end');
        router.push(`?${params.toString()}`);
    }

    function handleClear() {
        setValue('');
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', '1');
        params.delete('name');
        router.push(`?${params.toString()}`);
    }

    return (
        <form onSubmit={handleSubmit} className="flex w-full min-w-0 flex-wrap items-end gap-2 sm:w-auto">
            <div className="min-w-0 flex-1 sm:w-64">
                <label htmlFor="anime-search-name" className="block text-xs font-medium">Anime name</label>
            <div className="relative min-w-0 flex-1 sm:w-64">
                <input
                    id="anime-search-name"
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Search anime name..."
                    aria-label="Search anime name"
                    className="mt-1 h-10 w-full border border-gray-300 rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
                {value && (
                    <button
                        type="button"
                        onClick={handleClear}
                        aria-label="Clear search"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none"
                    >
                        ×
                    </button>
                )}
            </div>
            </div>
            <label className="block text-xs font-medium">
                MAL ID Start
                <input type="number" min="1" max={Number.MAX_SAFE_INTEGER} step="1" value={start} onChange={event => setStart(event.target.value)} placeholder="From"
                    className="mt-1 block h-10 w-36 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" />
            </label>
            <label className="block text-xs font-medium">
                MAL ID End
                <input type="number" min={Number(start) || 1} max={Number.MAX_SAFE_INTEGER} step="1" value={end} onChange={event => setEnd(event.target.value)} placeholder="To"
                    className="mt-1 block h-10 w-36 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" />
            </label>
            <button
                type="submit"
                className="h-10 shrink-0 px-4 py-2 bg-pink-500 text-white text-sm rounded-lg hover:bg-pink-600 transition-colors"
            >
                Search
            </button>
            {(value || start || end) && <button type="button" onClick={handleClearFilters} className="h-10 rounded-lg border border-gray-300 px-4 text-sm hover:bg-gray-100">Clear filters</button>}
        </form>
    );
}
