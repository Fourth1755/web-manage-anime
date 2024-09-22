"use client";
import { CategorySerivce } from "@/app/api/category";
import { Dialog, Button, DialogHeader, DialogBody, Option, DialogFooter, Select, Typography, Card, CardBody } from "../../../component/mtailwind";
import { useEffect, useState } from "react";
import TrashIcon from "@/app/component/icon/trashIcon";

type CategoryData = {
    id: number
    name: string
}

type PropsAddCategoryToAnimeModal = {
    open: boolean;
    handler: () => void;
    category?: CategoryData[]
}

type FormData = {
    category_ids: number[]
}

type CategoryList = {
    id: number
    name: string
}
export default function AddCategoryToAnimeModal(prop: PropsAddCategoryToAnimeModal) {
    const open = prop.open;
    const handleOpen = prop.handler;
    const categoryDataList = prop.category;
    const [formData, setFormData] = useState<FormData>({
        category_ids: [],
    });
    const [category, setCategory] = useState("")

    const [categoryList, setCategoryList] = useState<CategoryList[]>()
    const changeCategory = (val = "") => {
        //setFormData({ ...formData, "category_ids": val });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        //event.preventDefault();
        // const anime: AnimeData = {
        //     id: 0,
        //     name: formData.name,
        //     name_english: formData.name_english,
        //     episodes: +formData.episodes,
        //     seasonal: formData.seasonal,
        //     image: formData.image,
        //     description: formData.description,
        //     duration: formData.duration,
        //     year: formData.year,
        //     type: +formData.type,
        // };
        // if (isEdit && animeData) {
        //     anime.id = animeData.id;
        //     await updateAnime(anime);
        // } else {
        //     await createAnime(anime);
        // }
        handleOpen();
    };
    // useEffect(() => {
    //     console.log(isEdit, animeData);
    //     if (isEdit && animeData) {
    //         setFormData({
    //             name: animeData.name,
    //             name_english: animeData.name_english,
    //             episodes: +animeData.episodes,
    //             seasonal: animeData.seasonal,
    //             image: animeData.image,
    //             description: animeData.description,
    //             duration: animeData.duration,
    //             year: animeData.year,
    //             type: animeData.type.toString(),
    //         });
    //     }
    // }, []);

    //fetch list of category
    const initArtist = async () => {
        const categorySerivce = new CategorySerivce()
        const category = await categorySerivce.getCategories();
        if (category != null) {
            setCategoryList(category);
        }
    };
    useEffect(() => {
        initArtist();
    }, []);
    return (
        <>
            <Dialog
                open={open}
                handler={handleOpen}
                animate={{
                    mount: { scale: 1, y: 0 },
                    unmount: { scale: 0.9, y: -100 },
                }}
                size="sm"
            >
                <DialogHeader>Manage Tag Anime</DialogHeader>
                <form onSubmit={handleSubmit}>
                    <DialogBody className="space-y-4 pb-6">
                        {categoryDataList?.map((category) => (
                            <Card>
                                <CardBody className="flex justify-between">
                                    <Typography variant="h5" color="blue-gray">
                                        {category.name}
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        size="sm"
                                        color="red">
                                        <TrashIcon />
                                    </Button>
                                </CardBody>
                            </Card>))}
                        <Select
                            variant="outlined"
                            label="Choose a Category"
                            color="green"
                            value={category}
                            name="seasonal"
                            onChange={changeCategory}
                        >
                            {categoryList?.map((item,i) => (
                                <Option key={i} value={item.id?.toString()}> 
                                    {item.name}
                                </Option>
                            ))}
                        </Select>
                    </DialogBody>
                    <DialogFooter>
                        <Button
                            variant="text"
                            color="red"
                            onClick={handleOpen}
                            className="mr-1"
                        >
                            <span>Cancel</span>
                        </Button>
                        <Button variant="gradient" color="green" type="submit">
                            <span>Save</span>
                        </Button>
                    </DialogFooter>
                </form>
            </Dialog>
        </>
    );
}
