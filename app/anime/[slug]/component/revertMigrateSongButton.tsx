"use client";

import { useState } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Spinner,
} from "@material-tailwind/react";
import { revertMigrateAnimeSongs, MigrateResult } from "./action";

type Props = {
    anime_id: string;
    my_anime_list_id: number;
};

export default function RevertMigrateSongButton({ anime_id, my_anime_list_id }: Props) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<MigrateResult | null>(null);

    const handleClose = () => {
        setResult(null);
        setLoading(false);
        setOpen(false);
    };

    const handleRevert = async () => {
        setLoading(true);
        setResult(null);
        const res = await revertMigrateAnimeSongs(my_anime_list_id, anime_id);
        setLoading(false);
        setResult(res);
    };

    return (
        <>
            <Button variant="outlined" color="red" onClick={() => setOpen(true)}>
                <span>Revert Migrate</span>
            </Button>
            <Dialog
                open={open}
                handler={handleClose}
                animate={{ mount: { scale: 1, y: 0 }, unmount: { scale: 0.9, y: -100 } }}
                size="sm"
            >
                <DialogHeader>Revert Migrate Anime Songs</DialogHeader>
                <DialogBody>
                    <p className="text-sm text-gray-700">
                        This will revert the song migration for this anime. All migrated song data will be removed.
                    </p>
                    {result && (
                        <p className={`mt-3 text-sm font-medium ${result.success ? "text-green-600" : "text-red-600"}`}>
                            {result.success ? "Migration reverted successfully." : result.error}
                        </p>
                    )}
                </DialogBody>
                <DialogFooter>
                    <Button variant="text" color="blue-gray" onClick={handleClose} className="mr-1" disabled={loading}>
                        <span>Cancel</span>
                    </Button>
                    <Button
                        variant="gradient"
                        color="red"
                        onClick={handleRevert}
                        disabled={loading}
                        className="flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Spinner className="h-4 w-4" />
                                <span>Reverting...</span>
                            </>
                        ) : (
                            <span>Confirm Revert</span>
                        )}
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}
