"use client";
import { CategoryService } from "@/app/api/category";
import { Dialog, Button, DialogHeader, DialogBody, Option, DialogFooter, Select, Typography, Card, CardBody, Chip } from "../../../component/mtailwind";
import { useEffect, useState } from "react";
import { EditCategoryAnimeRequest, EditCategoryUniversesAnimeRequest } from "@/app/api/dtos/anime";
import { editCategoryAnime, editCategoryUniverseAnime } from "./action";
import { CategoryUniverseService } from "@/app/api/categoryUniverse";

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
        let categoryVal: string[] = [];
        if(formData.category_ids.length != 0) {
            categoryVal = formData.category_ids
        } 
    
        categoryVal.push(val)
        console.log(categoryVal)
        setFormData({ ...formData, "category_ids": categoryVal });
    };


    const handleSubmit = async () => {
        if(prop.is_universe){
            const request:EditCategoryUniversesAnimeRequest = {
                anime_id: prop.anime_id,
                category_universe_ids: formData.category_ids
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
    }

    //fetch list of category
    const initCategories = async () => {
        const categorySerivce = new CategoryService()
        const category = await categorySerivce.getCategories();
        if (category != null) {
            setCategoryList(category);
            category.map((item)=>{
                categoryMap.set(item.id,item.name)
            })
        }
    };

    //fetch list of category universe
    const initCategoyUniverse = async () => {
        const categorySerivce = new CategoryUniverseService()
        const category = await categorySerivce.getCategoryUniverse();
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
                            label="Choose a Category"
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
                            onClick={handleSubmit}>
                            <span>Save</span>
                        </Button>
                    </DialogFooter>
            </Dialog>
        </>
    );
}
