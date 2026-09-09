"use client";

import { useState } from "react";
import { Button } from "../../component/mtailwind";
import AlertModal from "../../component/alertModal/alertModal";
import CreateCategoryUniverseModal from "./createCategoryUniverseModal";

export default function CreateCategoryUniverseButton() {
    const [open, setOpen] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [message, setMessage] = useState("");

    const handleResponseMessage = (responseMessage: string) => {
        setMessage(responseMessage);
        setOpenAlert(true);
    };

    return (
        <>
            <Button variant="gradient" color="green" type="button" onClick={() => setOpen(true)}>
                <span>Create Category Universe</span>
            </Button>
            <CreateCategoryUniverseModal
                open={open}
                handler={() => setOpen(false)}
                handlerResponseMessage={handleResponseMessage}
            />
            <AlertModal
                open={openAlert}
                handler={() => setOpenAlert(false)}
                message={message}
            />
        </>
    );
}
