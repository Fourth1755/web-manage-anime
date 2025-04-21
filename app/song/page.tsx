import Link from "next/link";
import { SongService } from "../api/songs";
import { Button } from "../component/mtailwind";
import { GetAllSongResponse } from "../api/dtos/song";

export default async function Page() {
    const songSerivce = new SongService()
    const songs = await songSerivce.getSongs();
    return(<>
        <div className="container mx-auto md:px-40 px-5 pt-20">
            <div className="flex justify-between py-10">
                <h1>Anime Song</h1>
            </div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-black">
                    <thead className="p-10">
                        <tr>
                            <th scope="col" className="px-6 py-3">No.</th>
                            <th scope="col" className="px-6 py-3">Song</th>
                            <th scope="col" className="px-6 py-3">Anime</th>
                            <th scope="col" className="px-4 py-3">Type</th>
                            <th scope="col" className="px-4 py-3">Year</th>
                            <th scope="col" className="px-4 py-3">Detail</th>
                            <th scope="col" className="px-4 py-3">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {songs.map((song: GetAllSongResponse, index: number) => (
                            <tr key={index} className="py-4">
                                <td  scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{index + 1}</td>
                                <td><Link href={`song/${song.id}`}>{song.name}</Link></td>
                                <td><Link href={`anime/${song.anime_id}`}>{song.anime_name}</Link></td>
                                <td>{song.type}</td>
                                <td>{song.year}</td>
                                <td>
                                    <Button variant="outlined" color="green" type="submit">
                                        <span>Edit</span>
                                    </Button>
                                </td>
                                <td>
                                    <Button variant="outlined" color="red" type="submit">
                                        <span>Delete</span>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </>)
    
}