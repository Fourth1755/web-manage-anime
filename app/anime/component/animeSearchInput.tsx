'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function AnimeSearchInput({ defaultValue }: { defaultValue: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [value, setValue] = useState(defaultValue);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', '1');
        if (value.trim()) {
            params.set('name', value.trim());
        } else {
            params.delete('name');
        }
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
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <div className="relative">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Search anime name..."
                    className="border border-gray-300 rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 w-64"
                />
                {value && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none"
                    >
                        ×
                    </button>
                )}
            </div>
            <button
                type="submit"
                className="px-4 py-2 bg-pink-500 text-white text-sm rounded-lg hover:bg-pink-600 transition-colors"
            >
                Search
            </button>
        </form>
    );
}
