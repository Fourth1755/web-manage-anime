"use client";
import { useState } from "react";
import { Button } from "../../component/mtailwind";
import CreateCategoryModal from "./createCategoryModal";

type PropCreateCategoryButton ={
    name: string
    isEdit: boolean
    category?:CategoryData
}

type CategoryData = {
    id: number,
    name:string
    image:string
    is_universe:boolean
}

export default function CreateCategoryButton(props:PropCreateCategoryButton) {
    const [openModal, setOpenModal] = useState(false);
    const handleOpen = () => setOpenModal(!openModal);
    return (
        <>
            <Button variant="gradient" color="green" type="submit" onClick={handleOpen}>
                <span>{props.name}</span>
            </Button>
            <CreateCategoryModal
                open={openModal}
                handler={handleOpen}
                isEdit={props.isEdit}
                category={props.category}
            />
        </>
    );
}