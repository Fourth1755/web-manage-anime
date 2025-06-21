import { ArtistSerivce } from "@/app/api/artist";
import { CardBody, Card, Typography, Button } from "../../component/mtailwind";
import { SongService } from "@/app/api/songs";
import AddSongChannelButton from "./component/addSongChannelButton/addSongChannelButton";

type Props = {
    params: { slug: string }
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

    const artistResponse = await artistService.getArtist(params.slug)
    const songResponse = await songService.getSongsByArtist(params.slug)

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
                        <img
                            className="h-60 w-60 rounded-lg object-cover object-center shadow-xl shadow-blue-gray-900/50"
                            src={artistResponse.image}
                            alt="nature image"
                        />
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
                                <table className="w-full text-sm text-left text-black">
                                    <tbody>
                                        {song.song_channel.map((item,index_2)=>(
                                            <tr key={index_2}>
                                                <td></td>
                                                <td scope="col" className="px-2 py-3">            
                                                    <iframe
                                                    width="280"
                                                    height="176"
                                                    id="player"
                                                    src={`${item.link}`}
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                ></iframe>
                                                </td>
                                                <td>{item.is_main}</td>
                                                <td scope="col" className="px-8 py-3">
                                                    {converAnimeSongType(item.type)}</td>
                                                <td scope="col" className="px-8 py-3">
                                                    {converAnimeSongChannel(item.channel)}</td>
                                                <td>
                                                    {/* <AddSongChannelButton song_id={song.id}/> */}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}

                    </div>
                </CardBody>
            </Card>
        </div>
    )
}