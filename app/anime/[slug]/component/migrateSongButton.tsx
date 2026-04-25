"use client";

import { useState } from "react";
import { Button } from "@/app/component/mtailwind";
import MigrateSongModal from "./migrateSongModal";

type Props = {
    anime_id: string;
    my_anime_list_id: number;
};

export default function MigrateSongButton({ anime_id, my_anime_list_id }: Props) {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button variant="gradient" color="blue" onClick={() => setOpen(true)}>
                <span>Migrate Song</span>
            </Button>
            <MigrateSongModal open={open} handler={() => setOpen(false)} anime_id={anime_id} my_anime_list_id={my_anime_list_id} />
        </>
    );
}
