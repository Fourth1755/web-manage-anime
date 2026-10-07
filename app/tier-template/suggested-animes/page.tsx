import Link from 'next/link';
import { TierSuggestedAnimeService } from '@/app/api/tierSuggestedAnime';
import SuggestedAnimeManager from './manager';

export const dynamic = 'force-dynamic';

export default async function SuggestedAnimePage() {
    const response = await new TierSuggestedAnimeService().list();
    return (
        <div className="container mx-auto px-5 pb-10 pt-8 md:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4 py-10">
                <div>
                    <h1>Suggested Anime</h1>
                    <p className="mt-1 text-sm text-gray-500">Choose which anime appear as suggestions when users create a tier list.</p>
                </div>
                <Link href="/tier-template" className="text-sm text-pink-500 hover:underline">Back to templates</Link>
            </div>
            <SuggestedAnimeManager initialItems={response.animes ?? []} />
        </div>
    );
}
