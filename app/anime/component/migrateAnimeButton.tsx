"use client";

import { useState } from "react";
import { Button } from "../../component/mtailwind";
import MigrateAnimeModal from "./migrateAnimeModal";

export default function MigrateAnimeButton() {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button className="h-10 shrink-0 whitespace-nowrap px-4 py-2" variant="gradient" color="blue" onClick={() => setOpen(true)}>
                <span>Migrate Anime</span>
            </Button>
            <MigrateAnimeModal open={open} handler={() => setOpen(false)} />
        </>
    );
}
