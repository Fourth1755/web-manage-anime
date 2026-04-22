export const dynamic = 'force-dynamic';
import Link from "next/link";
import { redirect } from "next/navigation";
import { AnimeService } from "../api/anime";
import { Button } from "../component/mtailwind";
import MigrateAnimeButton from "./component/migrateAnimeButton";
import PaginationControl from "./component/paginationControl";
import { GetAnimeList } from "../api/dtos/anime";

type SearchParams = {
    page?: string;
    limit?: string;
    sort?: string;
    order?: string;
};

function formatDate(value: string | null | undefined): string {
    if (!value) return '-';
    const d = new Date(value);
    if (isNaN(d.getTime())) return value;
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
}

function SortIcon({ active, order }: { active: boolean; order: string }) {
    if (!active) return <span className="ml-1 text-gray-400">↕</span>;
    return <span className="ml-1">{order === 'ASC' ? '↑' : '↓'}</span>;
}

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
    const page  = Math.max(1, parseInt(searchParams.page  ?? "1",  10));
    const limit = Math.max(1, parseInt(searchParams.limit ?? "10", 10));
    const sort  = searchParams.sort  ?? '';
    const order = searchParams.order === 'ASC' ? 'ASC' : 'DESC';

    const animeSerivce = new AnimeService();
    let response;
    try {
        response = await animeSerivce.getAnimes(page, limit, sort || undefined, sort ? order : undefined);
    } catch (err: any) {
        if (err?.response?.status === 401) redirect('/login');
        throw err;
    }

    const totalPages = response.total_pages ?? 0;

    // Build href for a sortable column header — toggles asc/desc, resets to page 1
    function sortHref(col: string) {
        const nextOrder = sort === col && order === 'ASC' ? 'DESC' : 'ASC';
        return `?page=1&limit=${limit}&sort=${col}&order=${nextOrder}`;
    }

    return (
        <div className="container mx-auto px-5 md:px-5 pt-20">
            <div className="flex justify-between py-10">
                <h1>Anime</h1>
                <MigrateAnimeButton/>
            </div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-black">
                    <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                        <tr>
                            <th scope="col" className="px-4 py-3 whitespace-nowrap">No.</th>
                            <th scope="col" className="px-4 py-3">Anime</th>
                            <th scope="col" className="px-2 py-3">Name</th>
                            <th scope="col" className="px-2 py-3 whitespace-nowrap">MAL ID</th>
                            <th scope="col" className="px-4 py-3">
                                <Link href={sortHref('aired_at')} className="flex items-center hover:text-pink-500">
                                    Aired At
                                    <SortIcon active={sort === 'aired_at'} order={order} />
                                </Link>
                            </th>
                            <th scope="col" className="px-4 py-3">Status</th>
                            <th scope="col" className="px-4 py-3">Detail</th>
                        </tr>
                    </thead>
                    <tbody>
                        {response.animes?.map((anime: GetAnimeList, index: number) => (
                            <tr key={index} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {(page - 1) * limit + index + 1}
                                </td>
                                <td className="px-4 py-2">
                                    <img
                                        className="h-40 w-28 rounded-lg object-cover object-center shadow-md"
                                        src={anime.image}
                                        alt={anime.name}
                                    />
                                </td>
                                <td className="px-2 py-4 min-w-[160px]">
                                    <p>{anime.name}</p>
                                    {anime.name_thai && <p className="text-sm mt-1">{anime.name_thai}</p>}
                                </td>
                                <td className="px-2 py-4">{anime.my_anime_list_id || '-'}</td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <p>{formatDate(anime.aired_at)}</p>
                                    <p className="text-gray-400 text-xs mt-1">{anime.seasonal} {anime.year}</p>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">{anime.status || '-'}</td>
                                <td className="px-4 py-4">
                                    <Link href={`anime/${anime.id}`}>
                                        <Button variant="outlined" color="pink" type="submit">
                                            <span>Detail</span>
                                        </Button>
                                    </Link>
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
