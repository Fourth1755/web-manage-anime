"use client";
import { Dialog, Button, DialogHeader, DialogBody, Option, DialogFooter, Select, CardBody, Chip } from "../../../component/mtailwind";
import { useEffect, useState } from "react";
import { EditCategoryAnimeRequest, EditCategoryUniversesAnimeRequest } from "@/app/api/dtos/anime";
import { editCategoryAnime, editCategoryUniverseAnime, getCategories, getCategoryUniverses } from "./action";

type CategoryData = {
    id: string
    name: string
}

type PropsAddCategoryToAnimeModal = {
    open: boolean;
    handler: () => void;
    category?: CategoryData[]
    anime_id: string
    is_universe: boolean
}

type FormData = {
    category_ids: string[]
}

type CategoryList = {
    id: string
    name: string
}

let categoryMap = new Map();

export default function AddCategoryToAnimeModal(prop: PropsAddCategoryToAnimeModal) {
    const open = prop.open;
    const handleOpen = prop.handler;
    const categoryDataList = prop.category;
    const [formData, setFormData] = useState<FormData>({
        category_ids: [],
    });
    const [category, setCategory] = useState("")
    const [chipOpen, setChipOpen] = useState(true);

    const [categoryList, setCategoryList] = useState<CategoryList[]>()
    const changeCategory = (val = "") => {
        if (!val) return;

        setCategory(val);
        setFormData((current) => {
            const categoryIds = prop.is_universe
                ? [val]
                : current.category_ids.includes(val)
                    ? current.category_ids
                    : [...current.category_ids, val];

            return { ...current, category_ids: categoryIds };
        });
    };


    const handleSubmit = async () => {
        if(prop.is_universe){
            const request:EditCategoryUniversesAnimeRequest = {
                anime_id: prop.anime_id,
                category_universe_id: formData.category_ids[0] ?? ""
            }
            await editCategoryUniverseAnime(request);
        }else {
            const request:EditCategoryAnimeRequest = {
                anime_id: prop.anime_id,
                category_ids: formData.category_ids
            }
            await editCategoryAnime(request);
        }
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

    const onCloseChipCategory = (id:String) => {
        const categoryVal = formData.category_ids.filter((item)=>item!=id)
        console.log(categoryVal)
        setFormData({ ...formData, "category_ids": categoryVal });
        if (prop.is_universe) {
            setCategory("");
        }
    }

    //fetch list of category
    const initCategories = async () => {
        const category = await getCategories();
        if (category != null) {
            setCategoryList(category);
            category.map((item)=>{
                categoryMap.set(item.id,item.name)
            })
        }
    };

    //fetch list of category universe
    const initCategoyUniverse = async () => {
        const category = await getCategoryUniverses();
        if (category != null) {
            setCategoryList(category);
            category.map((item)=>{
                categoryMap.set(item.id,item.name)
            })
        }
    };

    useEffect(() => {
        if(prop.is_universe){
            initCategoyUniverse();
        } else {
            initCategories();
        }
    }, [prop.is_universe]);
    useEffect(() => {
        const categoryIds = categoryDataList?.map((item) => item.id) ?? [];
        setFormData({ category_ids: prop.is_universe ? categoryIds.slice(0, 1) : categoryIds });
        setCategory(prop.is_universe ? categoryIds[0] ?? "" : "");
    }, [categoryDataList, prop.is_universe]);
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
                <DialogHeader>{prop.is_universe ? "Manage Universe Anime" : "Manage Tag Anime"}</DialogHeader>
                    <DialogBody className="space-y-4 pb-6">
                                <CardBody className="flex justify-between">
                                    {formData?.category_ids?.length?<div>
                                        {formData.category_ids.map((item,index)=>(
                                            <div 
                                                key={index}
                                                className="py-1">
                                                <Chip
                                                    open={chipOpen}
                                                    onClose={() => onCloseChipCategory(item)}
            
                                                    value={categoryMap.get(item)}/>
                                            </div>
            
                                        ))}
                                    </div>:<></>}
                                </CardBody>
                        <Select
                            variant="outlined"
                            label={prop.is_universe ? "Choose a Universe" : "Choose a Category"}
                            color="green"
                            value={category}
                            name="category"
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
                        <Button 
                            variant="gradient" 
                            color="green" 
                            type="submit"
                            disabled={prop.is_universe && formData.category_ids.length === 0}
                            onClick={handleSubmit}>
                            <span>Save</span>
                        </Button>
                    </DialogFooter>
            </Dialog>
        </>
    );
}
