export const dynamic = 'force-dynamic';
import Link from "next/link";
import { Button } from "../component/mtailwind";
import { ArtistSerivce } from "../api/artist";
import CreateArtistButton from "./component/createArtistButton/createArtistButton";
import PaginationControl from "../component/paginationControl";
import MigrateSpotifyButton from "./component/migrateSpotifyButton/migrateSpotifyButton";
import MergeArtistButton from "./component/mergeArtistButton/mergeArtistControls";

type SearchParams = {
    page?: string;
    limit?: string;
    name?: string;
};

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const params = await searchParams;
    const page  = Math.max(1, parseInt(params.page  ?? "1",  10));
    const limit = Math.max(1, parseInt(params.limit ?? "20", 10));
    const name = params.name?.trim() ?? "";

    const artistService = new ArtistSerivce();
    const artistResponse = await artistService.getArtists(page, limit, name);

    const totalPages = artistResponse.total_pages ?? 0;

    return (
        <div className="container mx-auto md:px-8 px-5 pt-8">
            <div className="flex flex-wrap justify-between items-center gap-4 py-10">
                <h1>Artists</h1>
                <div className="flex flex-wrap items-center gap-3">
                    <CreateArtistButton isEdit={false} />
                    <MergeArtistButton />
                </div>
            </div>
            <form action="/artist" method="get" className="mb-6 flex flex-wrap items-end gap-2">
                <input type="hidden" name="page" value="1" />
                <input type="hidden" name="limit" value={limit} />
                <div className="w-full sm:w-64">
                    <label htmlFor="artist-name" className="mb-1 block text-sm font-medium text-gray-700">
                        Artist name
                    </label>
                    <input
                        key={name}
                        id="artist-name"
                        name="name"
                        type="search"
                        defaultValue={name}
                        placeholder="Search artist name..."
                        className="h-10 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                    />
                </div>
                <button type="submit" className="h-10 rounded-lg bg-pink-500 px-4 py-2 text-sm text-white hover:bg-pink-600">
                    Search
                </button>
                {name && (
                    <Link href={`/artist?page=1&limit=${limit}`} className="inline-flex h-10 items-center rounded-lg border border-gray-300 px-4 text-sm hover:bg-gray-100">
                        Clear
                    </Link>
                )}
            </form>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-black">
                    <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                        <tr>
                            <th scope="col" className="px-6 py-3">No.</th>
                            <th scope="col" className="px-6 py-3">Artist</th>
                            <th scope="col" className="px-6 py-3">Detail</th>
                            <th scope="col" className="px-6 py-3">Migrate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {artistResponse.artists.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                    {name ? "No artists found matching your search." : "No artists found."}
                                </td>
                            </tr>
                        )}
                        {artistResponse?.artists.map((artist, index) => (
                            <tr key={artist.id} className="border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {(page - 1) * limit + index + 1}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        {artist.image ? (
                                            <img
                                                src={artist.image}
                                                alt={artist.name}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold text-lg flex-shrink-0">
                                                {artist.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <span>{artist.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <Link href={`artist/${artist.id}`}>
                                        <Button variant="outlined" color="pink" type="submit">
                                            <span>Detail</span>
                                        </Button>
                                    </Link>
                                </td>
                                <td className="px-6 py-4">
                                    {artist.spotify_artist_id?.trim() ? (
                                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                                            Migrate Complete
                                        </span>
                                    ) : (
                                        <MigrateSpotifyButton artist_id={artist.id} artist_name={artist.name} />
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <PaginationControl page={page} limit={limit} totalPages={totalPages} />
        </div>
    );
}
