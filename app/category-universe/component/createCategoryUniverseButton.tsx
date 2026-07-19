"use client";

import { useState } from "react";
import { Button } from "../../component/mtailwind";
import CreateCategoryUniverseModal from "./createCategoryUniverseModal";

export default function CreateCategoryUniverseButton() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button variant="gradient" color="green" type="button" onClick={() => setOpen(true)}>
                <span>Create Category Universe</span>
            </Button>
            <CreateCategoryUniverseModal open={open} handler={() => setOpen(false)} />
        </>
    );
}
