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

type Props = {
    open: boolean;
    handler: () => void;
    my_anime_list_id: number;
    anime_id: string;
};

export default function MigrateSongModal({ open, handler, my_anime_list_id, anime_id }: Props) {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<MigrateResult | null>(null);

    const handleClose = () => {
        setResult(null);
        setLoading(false);
        handler();
    };

    const handleMigrate = async () => {
        setLoading(true);
        setResult(null);
        const res = await migrateAnimeSongs(my_anime_list_id, anime_id);
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
