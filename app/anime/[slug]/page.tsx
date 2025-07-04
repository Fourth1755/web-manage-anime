import { AnimeService } from "@/app/api/anime";
import { CardBody, Card, Typography, Button } from "../../component/mtailwind";
import Link from "next/link";
import CreateAnimeButton from "../component/createAnimeButton";
import { SongService } from "@/app/api/songs";
import AddCategoryToAnimeButton from "./component/addCategoryToAnimeButton";
import CreateSongButton from "./component/createSongButton/createSongButton";
import { GetSongByAnimeIdResponseSongDetail } from "@/app/api/dtos/song";
import CreateEpisodeButton from "./component/createEpisodeButton/createEpisodeButton";
import { EpisodeService } from "@/app/api/episode";
import { GetEpisodeByAnimeResponse } from "@/app/api/dtos/episode";
import EditEpisodeButton from "./component/editEpisodeButton/editEpisodeButton";
import AddCharacterToEpisodeButton from "./component/addCharacterToEpisodeButton/addCharacterToEpisodeButton";
import { CharacterService } from "@/app/api/character";
import CreateCharacterButton from "./component/createCharacterButton/createCharacterButton";

export default async function Page({ params }: { params: { slug: string } }) {
    const animeSerivce = new AnimeService()
    const songSerivce = new SongService();
    const episodeService = new EpisodeService();
    const characterService = new CharacterService();

    const animeId = params.slug
    const anime = await animeSerivce.getAnimeById(animeId);
    const songs = await songSerivce.getSongByAnime(animeId);
    const episodeResponse = await episodeService.getEpisode(animeId,"FIRST_APPEARANCE");
    const characterResponse = await characterService.getCharacterByAnimeId(animeId)

    const converAnimeSongType = (type: string) => {
        switch (type) {
            case "TV_SIZE":
                return "TV Size"
            case "FULL_SIZE_OFFICIAL":
                return "Full Size Official"
            case "FULL_SIZE_UNOFFICIAL":
                return "Full Size Unofficial"
            case "FIRST_TAKE":
                return "First Take"
            default:
                return ""
        }
    }

    const converAnimeSongChannel = (type: string) => {
        switch (type) {
            case "YOUTUBE":
                return "Youtube"
            case "SPOTIFY":
                return "Spotify"
            default:
                return ""
        }
    }

    const showAnimeSongItem = (animeSong: GetSongByAnimeIdResponseSongDetail[],title: string) => {
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
                                    <td color="blue-gray" className="font-bold py-1">
                                        Category:
                                    </td>
                                    <td className="flex">
                                        <div className="flex">
                                        {anime.categories?.map((item, index) => (
                                            <span key={item.id} className="px-1">
                                                <Link href={`category/${item.id}`}>{item.name}</Link>
                                            </span>
                                        ))}
                                        </div>
                                        <AddCategoryToAnimeButton 
                                            name="Add Tag" 
                                            category={anime.categories} 
                                            anime_id={anime.id}
                                            is_universe={false}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td color="blue-gray" className="font-bold">
                                        Universe:
                                    </td>
                                    <td className="flex">
                                        <div className="flex">                                        
                                            {anime.categoryUniverse?.map((item, index) => (
                                            <span key={item.id} className="px-1">
                                                {item.name}
                                                <p>{index == anime.categoryUniverse.length ? "," : ""}</p>
                                            </span>
                                        ))}</div>
                                        <AddCategoryToAnimeButton 
                                            name="Add Tag" 
                                            category={anime.categoryUniverse} 
                                            anime_id={anime.id}
                                            is_universe={true}/>
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
                        <CreateSongButton 
                            anime_id={anime.id} 
                            anime_name={anime.name} />
                    </div>
                    {showAnimeSongItem(songs.opening_song,"Anime Opening")}
                    {showAnimeSongItem(songs.ending_song,"Anime Endding")}
                    {showAnimeSongItem(songs.soundtrack_song,"Anime Soundtrack")}
                </CardBody>
            </Card>
            <Card className="h-full w-full">
                <CardBody>
                    <div className="flex justify-between">
                        <Typography variant="h5">
                            Anime Character
                        </Typography>
                        <CreateCharacterButton anime_id={anime.id} />
                    </div>
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left text-black">
                            <thead>
                                <tr>
                                    <th  scope="col" className="px-6 py-3">No.</th>
                                    <th  scope="col" className="px-6 py-3">Name</th>
                                    <th  scope="col" className="px-6 py-3">Full Name</th>
                                    <th  scope="col" className="px-6 py-3">Name Thai</th>
                                    <th  scope="col" className="px-6 py-3">Full Name Thai</th>
                                    <th  scope="col" className="px-6 py-3">Full Name Japan</th>
                                    <th  scope="col" className="px-6 py-3">Detail</th>
                                </tr>
                            </thead>
                            <tbody>
                            {characterResponse?.character?.map((character, index: number) => (
                                <tr key={index}>
                                    <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{index+1}</td>
                                    <td>{character.name}</td>
                                    <td>{character.full_name}</td>
                                    <td>{character.name_thai}</td>
                                    <td>{character.full_name_thai}</td>
                                    <td>{character.full_name_japan}</td>
                                    <td></td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardBody>
            </Card>
            <Card className="h-full w-full">
                <CardBody>
                    <div className="flex justify-between">
                        <Typography variant="h5">
                            Anime Episode
                        </Typography>
                        <CreateEpisodeButton anime_id={anime.id} />
                    </div>
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-black">
                    <thead>
                        <tr>
                            <th  scope="col" className="px-6 py-3">No.</th>
                            <th  scope="col" className="px-6 py-3">Name English</th>
                            <th  scope="col" className="px-6 py-3">Name Thai</th>
                            <th  scope="col" className="px-6 py-3">Name Japan</th>
                            <th  scope="col" className="px-6 py-3">Edit</th>
                            <th  scope="col" className="px-6 py-3">Detail</th>
                        </tr>
                    </thead>
                    <tbody>
                        {episodeResponse?.episodes?.map((episode, index: number) => (
                            <>
                            <tr key={index}>
                                <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{episode.number}</td>
                                <td>{episode.name_english}</td>
                                <td>{episode.name_thai}</td>
                                <td>{episode.name_japan}</td>
                                <td>
                                    {/* <Link href={`anime/${anime.id}`}>
                                        <Button variant="outlined" color="pink" type="submit">
                                            <span>Detail</span>
                                        </Button>
                                    </Link> */}
                                    <EditEpisodeButton episode={episode} anime_id={animeId}/>
                                </td>
                                <td>
                                    <AddCharacterToEpisodeButton episode={episode} anime_id={animeId}/>
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td className="flex">
                                    {episode?.characters?.map((character)=>(
                                    <span className="ml-2">
                                        <img 
                                            src={character.image}
                                            className="w-10 h-10 rounded-full object-cover"/>
                                    </span>))}
                                </td>
                            </tr>
                            </>
                        ))}
                    </tbody>
                </table>
            </div>
                </CardBody>
            </Card>
        </div>
    );
}
