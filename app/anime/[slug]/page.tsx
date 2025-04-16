import { AnimeService } from "@/app/api/anime";
import { CardBody, Card, Typography, Button } from "../../component/mtailwind";
import Link from "next/link";
import CreateAnimeButton from "../component/createAnimeButton";
import { SongService } from "@/app/api/songs";
import AddCategoryToAnimeButton from "./component/addCategoryToAnimeButton";
import CreateSongButton from "./component/createSongButton";

export default async function Page({ params }: { params: { slug: number } }) {
    const animeSerivce = new AnimeService()
    const songSerivce = new SongService();

    const anime = await animeSerivce.getAnimeById(params.slug);
    const songs = await songSerivce.getSongByAnime(params.slug);

    const converAnimeSongType = (type: number) => {
        switch (type) {
            case 1:
                return "TV Size"
            case 2:
                return "Full Size"
            case 3:
                return "Official"
            default:
                return ""
        }
    }

    const converAnimeSongChannel = (type: number) => {
        switch (type) {
            case 1:
                return "Youtube"
            case 2:
                return "Spotify"
            default:
                return ""
        }
    }

    const showAnimeSongItem = (animeSong: SongDetail[],title: string) => {
        if (!animeSong) {
            return <></>
        }
        return <div>
            <Typography variant="h6" className="py-2">
                {title}
            </Typography>
            <div>
                {animeSong.map((song) => (
                    <div key={song.id}>                        
                    <Typography variant="h4" color="blue-gray">
                    {song.name}
                    </Typography>
                        <table className="min-w-max table-auto">
                            <tbody>
                                {song.song_channel.map((item) => (
                                    <tr key={item.id}>
                                        <td scope="col" className="px-2 py-3">            
                                            <iframe
                                            width="560"
                                            height="315"
                                            id="player"
                                            src={`${item.link}`}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        ></iframe></td>
                                        <td scope="col" className="px-8 py-3">
                                            {converAnimeSongType(item.type)}</td>
                                        <td scope="col" className="px-8 py-3">
                                            {converAnimeSongChannel(item.channel)}</td>
                                        <td scope="col" className="px-8 py-3">
                                            <Button>Edit</Button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        </div>
    }
    return (
        <div className="container mx-auto md:px-40 px-5 pt-20 gap-6 flex flex-col">
            <Card className="h-full w-full">
                <CardBody>
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between">
                            <Typography variant="h5" color="blue-gray">
                                {anime.name}
                            </Typography>
                            <CreateAnimeButton name="Edit anime" isEdit={true} anime={anime} />
                        </div>
                        <img
                            className="h-60 w-44 rounded-lg object-cover object-center shadow-xl shadow-blue-gray-900/50"
                            src={anime.image}
                            alt="nature image"
                        />
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
                                        Studios:
                                    </td>
                                    <td>
                                        {anime.studios?.map((item, index) => (
                                            <span key={item.id}>
                                                <Link href={`studio/${item.id}`}>{item.name}</Link>
                                                <p>{index == anime.studios.length ? "," : ""}</p>
                                            </span>
                                        ))}
                                    </td>
                                </tr>
                                <tr>
                                    <td color="blue-gray" className="font-bold">
                                        Duration:
                                    </td>
                                    <td>{anime.duration}</td>
                                </tr>
                                <tr>
                                    <td color="blue-gray" className="font-bold">
                                        Tags:
                                    </td>
                                    <td>
                                        {anime.categories?.map((item, index) => (
                                            <span key={item.id}>
                                                <Link href={`category/${item.id}`}>{item.name}</Link>
                                                <p>{index == anime.categories.length ? "," : ""}</p>
                                            </span>
                                        ))}
                                        <AddCategoryToAnimeButton 
                                            name="Add Tag" 
                                            category={anime.categories} 
                                            anime_id={anime.id}/>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardBody>
            </Card>
            <Card className="h-full w-full">
                <CardBody>
                    <div className="flex justify-between">
                        <Typography variant="h5">
                            Anime Song
                        </Typography>
                        <CreateSongButton anime_id={anime.id} anime_name={anime.name} />
                    </div>
                    {showAnimeSongItem(songs.opening_song,"Anime Opening")}
                    {showAnimeSongItem(songs.ending_song,"Anime Endding")}
                    {showAnimeSongItem(songs.soundtrack_song,"Anime Soundtrack")}
                </CardBody>
            </Card>
        </div>
    );
}
