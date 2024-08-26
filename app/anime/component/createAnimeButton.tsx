"use client";
import CreateBlogModal from "./createAnimeModal";
import { useState } from "react";
import { Button } from "../../component/mtailwind";

type PropCreateAnimeButton ={
    name: string
    isEdit: boolean
}

export default function CreateAnimeButton(props:PropCreateAnimeButton) {
    const [openModal, setOpenModal] = useState(false);
    const handleOpen = () => setOpenModal(!openModal);
    return (
        <>
            <Button variant="gradient" color="green" type="submit" onClick={handleOpen}>
                <span>{props.name}</span>
            </Button>
            <CreateBlogModal
                open={openModal}
                handler={handleOpen}
                isEdit={props.isEdit}
                anime={undefined}
            />
        </>
    );
}
