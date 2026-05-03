export const dynamic = 'force-dynamic';
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
import MigrateSongButton from "./component/migrateSongButton";
import RevertMigrateSongButton from "./component/revertMigrateSongButton";
import AddSongChannelButton from "./component/addSongChannelButton/addSongChannelButton";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const animeSerivce = new AnimeService()
    const songSerivce = new SongService();
    const episodeService = new EpisodeService();
    const characterService = new CharacterService();

    const { slug: animeId } = await params
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

    const showAnimeSongItem = (animeSong: GetSongByAnimeIdResponseSongDetail[], title: string, animeId: string) => {
        if (!animeSong || animeSong.length === 0) return <></>;

        return (
            <div className="mb-6">
                <div className="flex items-center gap-2 py-3 border-b border-blue-gray-100 mb-4">
                    <Typography variant="h6" color="blue-gray">{title}</Typography>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{animeSong.length}</span>
                </div>
                <div className="flex flex-col gap-4">
                    {animeSong.map((song) => {
                        const youtubeChannels = (song.song_channel ?? []).filter(c => c.channel === "YOUTUBE");
                        const spotifyChannels = (song.song_channel ?? []).filter(c => c.channel === "SPOTIFY");
                        const theme = song.themes?.[0];

                        return (
                            <div key={song.id} className="border border-blue-gray-100 rounded-xl p-4 flex flex-col gap-4 bg-gray-50">
                                <div className="flex gap-4 items-start">
                                    {song.image ? (
                                        <img
                                            src={song.image}
                                            alt={song.name}
                                            className="w-20 h-20 rounded-lg object-cover flex-shrink-0 shadow"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 rounded-lg bg-blue-gray-100 flex-shrink-0 flex items-center justify-center text-blue-gray-300 text-2xl">♪</div>
                                    )}
                                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <Typography variant="h6" color="blue-gray" className="font-bold leading-tight">
                                                {song.name}
                                            </Typography>
                                            {theme && (
                                                <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-semibold whitespace-nowrap">
                                                    {theme.type} {theme.sequence}
                                                </span>
                                            )}
                                        </div>
                                        {song.song_artist?.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {song.song_artist.map((artist) => (
                                                    <span key={artist.id} className="flex items-center gap-1 text-xs bg-white border border-gray-200 text-gray-700 px-2 py-0.5 rounded-full shadow-sm">
                                                        {artist.image && (
                                                            <img src={artist.image} alt={artist.name} className="w-4 h-4 rounded-full object-cover" />
                                                        )}
                                                        {artist.name}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                                            {song.year && <span>Year: {song.year}</span>}
                                            {theme?.episodes && <span>Episodes: {theme.episodes}</span>}
                                        </div>
                                        {song.description && (
                                            <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{song.description}</p>
                                        )}
                                        {spotifyChannels.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {spotifyChannels.map((ch) => (
                                                    <a key={ch.id} href={ch.link} target="_blank" rel="noopener noreferrer"
                                                        className="flex items-center gap-1 text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full hover:bg-green-100 transition-colors">
                                                        <span>▶</span>
                                                        <span>Spotify{ch.is_main ? " · Main" : ""} — {converAnimeSongType(ch.type)}</span>
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-1 flex-shrink-0">
                                        <AddSongChannelButton song_id={song.id} song_name={song.name} anime_id={animeId} />
                                        <Button size="sm" variant="outlined" color="blue-gray">Edit</Button>
                                    </div>
                                </div>
                                {youtubeChannels.length > 0 && (
                                    <div className="flex flex-wrap gap-4 pt-2 border-t border-blue-gray-50">
                                        {youtubeChannels.map((ch) => (
                                            <div key={ch.id} className="flex flex-col gap-1">
                                                <iframe
                                                    width="400"
                                                    height="225"
                                                    src={ch.link}
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    className="rounded-lg shadow"
                                                ></iframe>
                                                <span className="text-xs text-gray-500 text-center">
                                                    {converAnimeSongType(ch.type)}{ch.is_main ? " · Main" : ""}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
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
                        {anime.is_migrate_anime_song ? (
                            <RevertMigrateSongButton anime_id={anime.id} my_anime_list_id={anime.my_anime_list_id} />
                        ) : (
                            <MigrateSongButton anime_id={anime.id} my_anime_list_id={anime.my_anime_list_id} />
                        )}
                    </div>
                    {showAnimeSongItem(songs.opening_song, "Anime Opening", animeId)}
                    {showAnimeSongItem(songs.ending_song, "Anime Ending", animeId)}
                    {showAnimeSongItem(songs.soundtrack_song, "Anime Soundtrack", animeId)}
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
                                    <span key={character.id} className="ml-2">
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
