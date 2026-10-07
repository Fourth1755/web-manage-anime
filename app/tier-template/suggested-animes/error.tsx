'use client';

import Link from 'next/link';

export default function SuggestedAnimeError({ reset }: { reset: () => void }) {
    return (
        <div className="container mx-auto space-y-4 px-5 py-10 md:px-8">
            <h1>Unable to load suggested anime</h1>
            <p role="alert" className="text-sm text-gray-600">Please check your admin session and try again. The anime service must be running with the latest database migration.</p>
            <div className="flex flex-wrap gap-4">
                <button onClick={reset} className="rounded bg-pink-500 px-4 py-2 text-sm text-white">Try again</button>
                <Link href="/login" className="rounded border px-4 py-2 text-sm">Sign in</Link>
                <Link href="/tier-template" className="rounded border px-4 py-2 text-sm">Back to templates</Link>
            </div>
        </div>
    );
}
