"use client";
import { CategoryService } from "@/app/api/category";
import { Dialog, Button, DialogHeader, DialogBody, Option, DialogFooter, Select, Typography, Card, CardBody } from "../../../component/mtailwind";
import { useEffect, useState } from "react";
import TrashIcon from "@/app/component/icon/trashIcon";
import { EditCategoryAnimeRequest } from "@/app/api/dtos/anime";
import { editCategoryAnime } from "./action";

type CategoryData = {
    id: string
    name: string
}

type PropsAddCategoryToAnimeModal = {
    open: boolean;
    handler: () => void;
    category?: CategoryData[]
    anime_id: string
}

type FormData = {
    category_ids: string[]
}

type CategoryList = {
    id: string
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
        let categoryVal: string[] = [];
        if(formData.category_ids.length != 0) {
            categoryVal = formData.category_ids
        } 
    
        categoryVal.push(val)
        console.log(categoryVal)
        setFormData({ ...formData, "category_ids": categoryVal });
    };


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const request:EditCategoryAnimeRequest = {
            anime_id: "",
            category_ids: formData.category_ids
        }
        await editCategoryAnime(request);
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
    const initCategories = async () => {
        const categorySerivce = new CategoryService()
        const category = await categorySerivce.getCategories();
        if (category != null) {
            setCategoryList(category);
        }
    };
    useEffect(() => {
        initCategories();
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
