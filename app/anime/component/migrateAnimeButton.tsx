"use client";

import { useState } from "react";
import { Button } from "../../component/mtailwind";
import MigrateAnimeModal from "./migrateAnimeModal";

export default function MigrateAnimeButton() {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button variant="gradient" color="blue" onClick={() => setOpen(true)}>
                <span>Migrate Anime</span>
            </Button>
            <MigrateAnimeModal open={open} handler={() => setOpen(false)} />
        </>
    );
}
