import Link from "next/link";
import { AnimeService } from "../api/anime";
import { Button } from "../component/mtailwind";
import CreateAnimeButton from "./component/createAnimeButton";
import { GetAnimeList } from "../api/dtos/anime";


export default async function Page() {
    const animeSerivce = new AnimeService()
    const animes = await animeSerivce.getAnimes();
    return (
        <>
        <div className="container mx-auto md:px-40 px-5 pt-20">
            <div className="flex justify-between py-10">
                <h1>Anime</h1>
                <CreateAnimeButton name="Add anime" isEdit={false}/>
            </div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-black">
                    <thead>
                        <tr>
                            <th  scope="col" className="px-6 py-3">No.</th>
                            <th  scope="col" className="px-6 py-3">Anime</th>
                            <th  scope="col" className="px-6 py-3">Name</th>
                            <th  scope="col" className="px-6 py-3">Year</th>
                            <th  scope="col" className="px-6 py-3">Seasonal</th>
                            <th  scope="col" className="px-6 py-3">Score</th>
                            <th  scope="col" className="px-6 py-3">Detail</th>
                        </tr>
                    </thead>
                    <tbody>
                        {animes?.map((anime: GetAnimeList, index: number) => (
                            <tr key={index}>
                                <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{index + 1}</td>
                                <td>
                                    <img
                                        className="h-60 w-44 rounded-lg object-cover object-center shadow-xl shadow-blue-gray-900/50 my-1"
                                        src={anime.image}
                                        alt="nature image"
                                    />
                                </td>
                                <td>{anime.name}</td>
                                <td>{anime.year}</td>
                                <td>{anime.seasonal}</td>
                                <td>10</td>
                                <td>
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
        </div>
        
        </>
    );
}
