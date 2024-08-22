"use client";
import CreateBlogModal from "./createAnimeModal";
import { useState } from "react";
import { Button } from "../../component/mtailwind";

export default function CreateAnimeButton() {
    const [openModal, setOpenModal] = useState(false);
    const handleOpen = () => setOpenModal(!openModal);
    return (
        <>
            <Button variant="gradient" color="green" type="submit" onClick={handleOpen}>
                <span>Add New</span>
            </Button>
            <CreateBlogModal
                open={openModal}
                handler={handleOpen}
                isEdit={false}
                anime={undefined}
            />
        </>
    );
}
