export const dynamic = 'force-dynamic';
import { AnimeService } from "@/app/api/anime";
import { CardBody, Card, Typography } from "../../component/mtailwind";
import Link from "next/link";
import CreateAnimeButton from "../component/createAnimeButton";
import { SongService } from "@/app/api/songs";
import AddCategoryToAnimeButton from "./component/addCategoryToAnimeButton";
import { GetSongByAnimeIdResponseSongDetail } from "@/app/api/dtos/song";
import { GetAnimeTrailerItem, GetAnimeTrailersResponse } from "@/app/api/dtos/anime";
import { CharacterService } from "@/app/api/character";
import CreateCharacterButton from "./component/createCharacterButton/createCharacterButton";
import MigrateSongButton from "./component/migrateSongButton";
import RevertMigrateSongButton from "./component/revertMigrateSongButton";
import AddSongChannelButton from "./component/addSongChannelButton/addSongChannelButton";
import MigrateSpotifySongButton from "./component/migrateSpotifySongButton/migrateSpotifySongButton";
import { AxiosError } from "axios";
import CreateTrailerButton from "./component/createTrailerButton/createTrailerButton";
import AnilistTrailerToggle from "../component/anilistTrailerToggle";
import AnilistEpisodeToggle from "../component/anilistEpisodeToggle";
import { EpisodeService } from "@/app/api/episode";
import EditEpisodeButton from "./component/editEpisodeButton/editEpisodeButton";
import AddCharacterToEpisodeButton from "./component/addCharacterToEpisodeButton/addCharacterToEpisodeButton";

export default async function Page(props: any) {
    const params = await props.params;
    const animeService = new AnimeService()

    let anime;
    try {
        anime = await animeService.getAnimeById(params.slug);
    } catch (error) {
        const status = (error as AxiosError)?.response?.status;
        if (status === 404) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-white gap-6">
            <img
                src="https://media.tenor.com/RO4khL1FMxgAAAAM/tokyo.gif"
                alt="Not found"
                width={220}
                height={124}
                className="rounded-xl"
            />
            <h1 className="text-4xl font-extrabold">404 - Page Not Found</h1>
            <p className="text-gray-400 text-lg">This anime does not exist.</p>
            <Link href="/" className="text-blue-400 hover:underline">
                Go back home
            </Link>
            </div>
        );
        }
        throw error;
    }
    const songSerivce = new SongService();
    const characterService = new CharacterService();
    const episodeService = new EpisodeService();

    const [songs, characterResponse, trailerResponse, episodeResponse] = await Promise.all([
        songSerivce.getSongByAnime(anime.id),
        characterService.getCharacterByAnimeId(anime.id),
        animeService.getAnimeTrailers(anime.id).catch(() => [] as GetAnimeTrailerItem[]),
        episodeService.getEpisode(anime.id, "anilist").catch(() => ({ episodes: [] })),
    ]);

    const normalizeTrailers = (trailers: GetAnimeTrailersResponse): GetAnimeTrailerItem[] => {
        if (Array.isArray(trailers)) {
            return trailers;
        }

        if (Array.isArray(trailers?.trailers)) {
            return trailers.trailers;
        }

        if (Array.isArray(trailers?.data)) {
            return trailers.data;
        }

        return [];
    };

    const animeTrailers = normalizeTrailers(trailerResponse as GetAnimeTrailersResponse);

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
                                                {spotifyChannels.map((ch, idx) => (
                                                    <a key={ch.id ?? idx} href={ch.link} target="_blank" rel="noopener noreferrer"
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
                                        {song.spotify_track_id ? (
                                            <span className="rounded-md border px-3 py-2 text-center text-xs font-semibol">
                                                Migrate Complete
                                            </span>
                                        ) : (
                                            <MigrateSpotifySongButton song_id={song.id} song_name={song.name} anime_id={animeId} />
                                        )}
                                    </div>
                                </div>
                                {youtubeChannels.length > 0 && (
                                    <div className="flex flex-wrap gap-4 pt-2 border-t border-blue-gray-50">
                                        {youtubeChannels.map((ch, idx) => (
                                            <div key={ch.id ?? idx} className="flex flex-col gap-1">
                                                <iframe
                                                    width="400"
                                                    height="225"
                                                    src={ch.link_embed}
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
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

    const getYoutubeEmbedLink = (link: string) => {
        try {
            const url = new URL(link);

            if (url.hostname.includes("youtu.be")) {
                const videoId = url.pathname.replace("/", "");
                return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
            }

            if (url.hostname.includes("youtube.com")) {
                const videoId = url.searchParams.get("v");
                return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
            }
        } catch {
            return "";
        }

        return "";
    };

    const showAnimeTrailerItem = (trailers: GetAnimeTrailerItem[]) => {
        if (!trailers || trailers.length === 0) {
            return (
                <div className="rounded-xl border border-dashed border-blue-gray-100 p-6 text-center text-sm text-gray-500">
                    No trailers yet.
                </div>
            );
        }

        return (
            <div className="grid gap-4">
                {trailers.map((trailer, index) => {
                    const trailerLink = trailer.url;
                    const embedLink = trailer.embed_url || getYoutubeEmbedLink(trailer.url);
                    const trailerTitle = trailer.name || `Trailer ${index + 1}`;

                    return (
                        <div key={trailer.id ?? `${trailerTitle}-${index}`} className="rounded-xl border border-blue-gray-100 p-4 bg-gray-50 flex flex-col gap-3">
                            <Typography variant="h6" color="blue-gray">
                                {trailerTitle}
                            </Typography>
                            {embedLink ? (
                                <iframe
                                    width="100%"
                                    height="240"
                                    src={embedLink}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="rounded-lg shadow"
                                ></iframe>
                            ) : null}
                            {trailer.video_id ? (
                                <Typography variant="small" className="text-gray-500">
                                    Video ID: {trailer.video_id}
                                </Typography>
                            ) : null}
                            {trailerLink ? (
                                <a
                                    href={trailerLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 hover:underline break-all"
                                >
                                    {trailerLink}
                                </a>
                            ) : (
                                <Typography variant="small" className="text-gray-500">
                                    Trailer link unavailable
                                </Typography>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

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
                                            {anime.category_universe?.map((item, index) => (
                                            <span key={item.id} className="px-1">
                                                {item.name}
                                                <p>{index == anime.category_universe.length ? "," : ""}</p>
                                            </span>
                                        ))}</div>
                                        <AddCategoryToAnimeButton 
                                            name="Add Tag" 
                                            category={anime.category_universe} 
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
                    <div className="flex flex-wrap justify-between items-center gap-3">
                        <Typography variant="h5">Manage Episodes</Typography>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600">Use AniList Episodes</span>
                            <AnilistEpisodeToggle animeId={anime.id} initialValue={anime.is_anilist_episode_active} />
                        </div>
                    </div>
                    {/* <div className="mt-4 relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left text-black">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3">No.</th>
                                    <th className="px-6 py-3">Name English</th>
                                    <th className="px-6 py-3">Name Thai</th>
                                    <th className="px-6 py-3">Name Japan</th>
                                    <th className="px-6 py-3">Manage</th>
                                </tr>
                            </thead>
                            <tbody>
                                {episodeResponse?.episodes?.map((episode) => (
                                    <tr key={episode.id} className="border-b">
                                        <td className="px-6 py-4 font-medium">{episode.number}</td>
                                        <td className="px-6 py-4">{episode.name_english}</td>
                                        <td className="px-6 py-4">{episode.name_thai}</td>
                                        <td className="px-6 py-4">{episode.name_japan}</td>
                                        <td className="px-6 py-4 flex gap-2">
                                            <EditEpisodeButton episode={episode} anime_id={anime.id} />
                                            <AddCharacterToEpisodeButton episode={episode} anime_id={anime.id} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {episodeResponse?.episodes?.length === 0 ? <p className="p-6 text-center text-sm text-gray-500">No AniList episodes found.</p> : null}
                    </div> */}
                </CardBody>
            </Card>
            <Card className="h-full w-full">
                <CardBody>
                    <div className="flex justify-between items-center">
                        <Typography variant="h5">
                            Anime Trailers
                        </Typography>
                        <div className="flex items-center gap-3">
                            <h4>Use AniList Trailer</h4>
                            <AnilistTrailerToggle
                                animeId={anime.id}
                                initialValue={anime.is_anilist_trailer_active}
                            />
                            <CreateTrailerButton anime_id={anime.id} anime_name={anime.name} />
                        </div>
                    </div>
                    <div className="mt-4">
                        {showAnimeTrailerItem(animeTrailers)}
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
                    {showAnimeSongItem(songs.opening_song, "Anime Opening", anime.id)}
                    {showAnimeSongItem(songs.ending_song, "Anime Ending", anime.id)}
                    {showAnimeSongItem(songs.soundtrack_song, "Anime Soundtrack", anime.id)}
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
        </div>
    );
}
