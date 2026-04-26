'use client'

import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Select,
    Option,
    Typography,
} from '../../../../component/mtailwind'
import { useState } from 'react'
import { createSongChannel } from './action'

const channelOptions = [
    { id: 'YOUTUBE', name: 'YouTube' },
    { id: 'SPOTIFY', name: 'Spotify' },
]

const channelTypeOptions = [
    { id: 'TV_SIZE', name: 'TV Size' },
    { id: 'FULL_SIZE_OFFICIAL', name: 'Full Size Official' },
    { id: 'FULL_SIZE_UNOFFICIAL', name: 'Full Size Unofficial' },
    { id: 'FIRST_TAKE', name: 'First Take' },
]

type Props = {
    open: boolean
    handler: () => void
    song_id: string
    song_name: string
    anime_id: string
    handlerResponseMessage: (message: string) => void
}

export default function AddSongChannelModal({ open, handler, song_id, song_name, anime_id, handlerResponseMessage }: Props) {
    const [channel, setChannel] = useState('')
    const [type, setType] = useState('')
    const [link, setLink] = useState('')
    const [isMain, setIsMain] = useState(false)

    const reset = () => {
        setChannel('')
        setType('')
        setLink('')
        setIsMain(false)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const message = await createSongChannel(
            { song_id, channel, type, link, is_main: isMain },
            anime_id,
        )
        handlerResponseMessage(message)
        reset()
        handler()
    }

    return (
        <Dialog
            open={open}
            handler={handler}
            animate={{ mount: { scale: 1, y: 0 }, unmount: { scale: 0.9, y: -100 } }}
        >
            <DialogHeader>Add Channel</DialogHeader>
            <form onSubmit={handleSubmit}>
                <DialogBody className="flex flex-col gap-5">
                    <Typography variant="h6" color="blue-gray">{song_name}</Typography>
                    <Select
                        label="Channel"
                        color="green"
                        value={channel}
                        onChange={(val = '') => setChannel(val)}
                    >
                        {channelOptions.map((item) => (
                            <Option key={item.id} value={item.id}>{item.name}</Option>
                        ))}
                    </Select>
                    <Select
                        label="Channel Type"
                        color="green"
                        value={type}
                        onChange={(val = '') => setType(val)}
                    >
                        {channelTypeOptions.map((item) => (
                            <Option key={item.id} value={item.id}>{item.name}</Option>
                        ))}
                    </Select>
                    <Input
                        label="Link"
                        crossOrigin={undefined}
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                    />
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={isMain}
                            onChange={(e) => setIsMain(e.target.checked)}
                            className="w-4 h-4 accent-green-500"
                        />
                        <span className="text-sm text-gray-700">Set as main channel</span>
                    </label>
                </DialogBody>
                <DialogFooter>
                    <Button variant="text" color="green" onClick={() => { reset(); handler(); }} className="mr-1">
                        Cancel
                    </Button>
                    <Button variant="gradient" color="green" type="submit">
                        Add Channel
                    </Button>
                </DialogFooter>
            </form>
        </Dialog>
    )
}
