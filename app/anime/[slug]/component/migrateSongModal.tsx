"use client";

import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Spinner,
} from "@material-tailwind/react";
import { useState } from "react";
import { migrateAnimeSongs, MigrateResult } from "./action";
import { MigrateAnimeSongsSource } from "@/app/api/dtos/song";

type Props = {
    open: boolean;
    handler: () => void;
    my_anime_list_id: number;
    anime_id: string;
};

export default function MigrateSongModal({ open, handler, my_anime_list_id, anime_id }: Props) {
    const defaultSource: MigrateAnimeSongsSource = "my_anime_list";
    const [source, setSource] = useState<MigrateAnimeSongsSource>(defaultSource);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<MigrateResult | null>(null);

    const handleClose = () => {
        setResult(null);
        setLoading(false);
        setSource(defaultSource);
        handler();
    };

    const handleMigrate = async () => {
        setLoading(true);
        setResult(null);
        const res = await migrateAnimeSongs(my_anime_list_id, anime_id, source);
        setLoading(false);
        setResult(res);
    };

    return (
        <Dialog
            open={open}
            handler={handleClose}
            animate={{ mount: { scale: 1, y: 0 }, unmount: { scale: 0.9, y: -100 } }}
            size="sm"
        >
            <DialogHeader>Migrate Anime Songs</DialogHeader>
            <DialogBody>
                <p className="text-sm text-gray-700">
                    Import songs for this anime from the external source. This will fetch and save all associated song data.
                </p>
                <div className="mt-4">
                    <label htmlFor="migrate-song-source" className="mb-1 block text-sm font-medium text-gray-700">
                        Source
                    </label>
                    <select
                        id="migrate-song-source"
                        value={source}
                        onChange={event => setSource(event.target.value as MigrateAnimeSongsSource)}
                        disabled={loading}
                        className="w-full rounded-md border border-blue-gray-200 bg-white px-3 py-2 text-sm text-blue-gray-700 outline-none focus:border-blue-500"
                    >
                        <option value="my_anime_list">my_anime_list</option>
                        <option value="jikan">jikan</option>
                    </select>
                </div>
                {result && (
                    <p className={`mt-3 text-sm font-medium ${result.success ? "text-green-600" : "text-red-600"}`}>
                        {result.success ? "Songs migrated successfully." : result.error}
                    </p>
                )}
            </DialogBody>
            <DialogFooter>
                <Button variant="text" color="red" onClick={handleClose} className="mr-1" disabled={loading}>
                    <span>Cancel</span>
                </Button>
                <Button
                    variant="gradient"
                    color="blue"
                    onClick={handleMigrate}
                    disabled={loading}
                    className="flex items-center gap-2"
                >
                    {loading ? (
                        <>
                            <Spinner className="h-4 w-4" />
                            <span>Migrating...</span>
                        </>
                    ) : (
                        <span>Start Migrate</span>
                    )}
                </Button>
            </DialogFooter>
        </Dialog>
    );
}
