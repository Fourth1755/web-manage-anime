'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function UserSearchInput({ defaultValue }: { defaultValue: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [value, setValue] = useState(defaultValue);

    function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', '1');

        if (value.trim()) {
            params.set('search', value.trim());
        } else {
            params.delete('search');
        }

        router.push(`?${params.toString()}`);
    }

    function clear() {
        setValue('');
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', '1');
        params.delete('search');
        router.push(`?${params.toString()}`);
    }

    return (
        <form onSubmit={submit} className="flex items-center gap-2">
            <div className="relative">
                <input
                    type="search"
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    placeholder="Search users..."
                    aria-label="Search users"
                    className="w-64 rounded-lg border border-gray-300 py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
                {value && (
                    <button type="button" onClick={clear} aria-label="Clear search" className="absolute right-2 top-1/2 -translate-y-1/2 text-lg leading-none text-gray-400 hover:text-gray-600">
                        ×
                    </button>
                )}
            </div>
            <button type="submit" className="rounded-lg bg-pink-500 px-4 py-2 text-sm text-white transition-colors hover:bg-pink-600">
                Search
            </button>
        </form>
    );
}
