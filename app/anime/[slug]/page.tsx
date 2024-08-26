import { getAnime } from "@/app/api/anime";
import { CardBody, Card, Typography, Button } from "../../component/mtailwind";
import Link from "next/link";
import CreateAnimeButton from "../component/createAnimeButton";

export default async function Page({ params }: { params: { slug: number } }) {
    const anime = await getAnime(params.slug);
    return (
        <div className="container mx-auto md:px-40 px-5 pt-20 gap-6 flex flex-col">
            <Card className="h-full w-full">
                <CardBody>
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between">
                        <Typography variant="h5" color="blue-gray">
                            {anime.name}
                        </Typography>
                        <CreateAnimeButton name="Edit anime" isEdit={false}/>
                        </div>
                        <img
                            className="h-60 w-44 rounded-lg object-cover object-center shadow-xl shadow-blue-gray-900/50"
                            src={anime.image}
                            alt="nature image"
                        />
                        <h2>Anime Detail</h2>
                        <table className="w-32 min-w-max table-auto text-left">
                            <tbody>
                                <tr>
                                    <td color="blue-gray" className="font-bold">
                                        Type:
                                    </td>
                                    <td>{anime.type}</td>
                                </tr>
                                <tr>
                                    <td color="blue-gray" className="font-bold">
                                        Premiered:
                                    </td>
                                    <td>
                                        {anime.seasonal} {anime.year}
                                    </td>
                                </tr>
                                <tr>
                                    <td color="blue-gray" className="font-bold">
                                        Episodes:
                                    </td>
                                    <td>{anime.episodes}</td>
                                </tr>
                                <tr>
                                    <td color="blue-gray" className="font-bold">
                                        Tags:
                                    </td>
                                    <td>
                                        {anime.categories?.map((item, index) => (
                                            <p key={item.id}>
                                                <Link href={`category/${item.id}`}>{item.name}</Link>
                                                <p>{index == anime.categories.length ? "," : ""}</p>
                                            </p>
                                        ))}
                                    </td>
                                </tr>
                                <tr>
                                    <td color="blue-gray" className="font-bold">
                                        Studios:
                                    </td>
                                    <td>studios anime</td>
                                </tr>
                                <tr>
                                    <td color="blue-gray" className="font-bold">
                                        Duration:
                                    </td>
                                    <td>{anime.duration}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardBody>
            </Card>
            <Card className="h-full w-full">
                <CardBody>
                    <Typography variant="h5" color="blue-gray">
                        Anime Song
                    </Typography>
                    {anime.opening ? <Typography color="gray" className="mt-1 font-normal">
                        Anime Opening
                    </Typography> : <></>}
                    {anime.ending ? <Typography color="gray" className="mt-1 font-normal">
                        Anime Ending
                    </Typography> : <></>}
                    {anime.soundtrack ? <div>
                        <Typography color="gray" className="mt-1 font-normal">
                            Soundtrack
                        </Typography>
                        {anime.soundtrack.map((song)=>(<div key={song.id}>
                            <Typography color="gray" className="mt-1 font-normal" >
                                {song.name}
                           </Typography>
                        </div>))}
                    </div> : <></>}
                </CardBody>
            </Card>
        </div>
    );
}
