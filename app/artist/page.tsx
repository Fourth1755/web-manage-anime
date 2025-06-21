import Link from "next/link";
import { Button } from "../component/mtailwind";
import { CategoryService } from "../api/category";
import { ArtistSerivce } from "../api/artist";
import CreateArtistModal from "./component/createArtistButton/createArtistModal";
import CreateArtistButton from "./component/createArtistButton/createArtistButton";

type Category = {
    id: string,
    name:string
    image:string
    is_universe:boolean
}

export default async function Page() {
    const artistSerivce = new ArtistSerivce()
    const artistResponse = await artistSerivce.getArtists()
    return (<div>
        <div className="container mx-auto md:px-40 px-5 pt-20">
            <div className="flex justify-between py-10">
                <h1>Artists</h1>
                <CreateArtistButton isEdit={false}/>
            </div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-black">
                    <thead>
                        <tr>
                            <th  scope="col" className="px-6 py-3">No.</th>
                            <th  scope="col" className="px-6 py-3">Artist</th>
                            <th  scope="col" className="px-6 py-3">Detail</th>
                        </tr>
                    </thead>
                    <tbody>
                        {artistResponse?.artists.map((artist, index) => (
                            <tr key={index}>
                                <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{index + 1}</td>
                                <td>
                                    <div className="flex">
                                    <img
                                        src={artist.image}
                                        className="w-12 h-12 rounded-full object-cover"/>
                                        <h2 className="pl-5">{artist.name}</h2>
                                    </div>
                                </td>
                                
                                {/* <td>
                                    <Link href={`category/${category.id}`}>
                                        <Button variant="outlined" color="pink" type="submit">
                                            <span>Detail</span>
                                        </Button>
                                    </Link>
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>)
}