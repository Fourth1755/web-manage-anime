export const dynamic = 'force-dynamic';
import { ArtistSerivce } from "@/app/api/artist";
import { CardBody, Card, Typography, Button } from "../../component/mtailwind";
import { SongService } from "@/app/api/songs";
import AddSongChannelButton from "./component/addSongChannelButton/addSongChannelButton";

type Props = {
    params: Promise<{ slug: string }>
}

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

export default async function Page({ params }: Props) {
    const artistService = new ArtistSerivce()
    const songService = new SongService()

    const { slug } = await params
    const artistResponse = await artistService.getArtist(slug)
    const songResponse = await songService.getSongsByArtist(slug)

    return (
        <div className="container mx-auto md:px-40 px-5 pt-20 gap-6 flex flex-col">
            <Card className="h-full w-full">
                <CardBody>
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between">
                            <Typography variant="h5" color="blue-gray">
                                {artistResponse.name}
                            </Typography>
                            {/* <CreateAnimeButton name="Edit anime" isEdit={true} anime={anime} /> */}
                        </div>
                        {artistResponse.image ? (
                            <img
                                className="h-60 w-60 rounded-lg object-cover object-center shadow-xl shadow-blue-gray-900/50"
                                src={artistResponse.image}
                                alt={artistResponse.name}
                            />
                        ) : (
                            <div className="h-60 w-60 rounded-lg bg-gray-200 flex items-center justify-center shadow-xl shadow-blue-gray-900/50 text-gray-500 font-bold text-6xl">
                                {artistResponse.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                </CardBody>
            </Card>
            <Card className="h-full w-full">
                <CardBody>
                    <div className="flex justify-between">
                        <Typography variant="h5">
                            Song
                        </Typography>

                    </div>
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        {songResponse?.songs?.map((song, index: number) => (
                            <div key={index}>
                                <div className="flex justify-between">
                                    <div className="flex p-3">
                                        <h1 className="font-medium text-xl">{index+1}</h1>
                                        <span className="pl-5">{song.name} | {song.anime_name}</span>
                                    </div>
                                    <div>
                                        <AddSongChannelButton song_id={song.id}/>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-4 pt-2">
                                    {song.song_channel?.map((item, index_2) => (
                                        <div key={index_2} className="flex flex-col gap-1">
                                            {item.channel === "YOUTUBE" ? (
                                                <iframe
                                                    width="280"
                                                    height="176"
                                                    src={item.link}
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    className="rounded-lg shadow"
                                                ></iframe>
                                            ) : (
                                                <a href={item.link} target="_blank" rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full hover:bg-green-100 transition-colors">
                                                    <span>▶</span>
                                                    <span>{converAnimeSongChannel(item.channel)}</span>
                                                </a>
                                            )}
                                            <span className="text-xs text-gray-500 text-center">
                                                {converAnimeSongType(item.type)}{item.is_main ? " · Main" : ""}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                    </div>
                </CardBody>
            </Card>
        </div>
    )
}