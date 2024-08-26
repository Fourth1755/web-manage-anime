import Link from "next/link";
import { getAnimes } from "../api/anime";
import { Button } from "../component/mtailwind";
import CreateAnimeButton from "./component/createAnimeButton";
interface IAnime {
    id: number;
    name: String;
    year: String;
    score: String;
    seasonal: String;
}

export default async function Page() {
    const animes = await getAnimes();
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
                            <th  scope="col" className="px-6 py-3">Name</th>
                            <th  scope="col" className="px-6 py-3">Year</th>
                            <th  scope="col" className="px-6 py-3">Seasonal</th>
                            <th  scope="col" className="px-6 py-3">Score</th>
                            <th  scope="col" className="px-6 py-3">Detail</th>
                        </tr>
                    </thead>
                    <tbody>
                        {animes.map((anime: IAnime, index: number) => (
                            <tr key={index}>
                                <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{index + 1}</td>
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
