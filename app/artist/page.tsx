export const dynamic = 'force-dynamic';
import Link from "next/link";
import { Button } from "../component/mtailwind";
import { ArtistSerivce } from "../api/artist";
import CreateArtistButton from "./component/createArtistButton/createArtistButton";
import PaginationControl from "../component/paginationControl";
import MigrateSpotifyButton from "./component/migrateSpotifyButton/migrateSpotifyButton";

type SearchParams = {
    page?: string;
    limit?: string;
};

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
    const page  = Math.max(1, parseInt(searchParams.page  ?? "1",  10));
    const limit = Math.max(1, parseInt(searchParams.limit ?? "20", 10));

    const artistService = new ArtistSerivce();
    const artistResponse = await artistService.getArtists(page, limit);

    const totalPages = artistResponse.total_pages ?? 0;

    return (
        <div className="container mx-auto md:px-40 px-5 pt-20">
            <div className="flex justify-between items-center py-10">
                <h1>Artists</h1>
                <CreateArtistButton isEdit={false} />
            </div>
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
                                    <MigrateSpotifyButton artist_id={artist.id} artist_name={artist.name} />
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
