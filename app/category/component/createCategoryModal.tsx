"use client";
import { useEffect, useState } from "react";
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Input, Switch } from "../../component/mtailwind";
import { createCategory } from "./action";

type CategoryData = {
    id: number,
    name: string
    image: string
    is_universe: boolean
}

type PropsCreateCategoryModal = {
    open: boolean;
    handler: () => void;
    isEdit: boolean;
    category?: CategoryData
};

type FormData = {
    name: string
    image: string
    is_universe: boolean
}

export default function CreateCategoryModal(prop: PropsCreateCategoryModal) {
    const open = prop.open;
    const handleOpen = prop.handler;
    const isEdit = prop.isEdit
    const categoryData = prop.category

    const [formData, setFormData] = useState<FormData>({
        name: "",
        image: "",
        is_universe: false,
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement> | any) => {
        const { name, value } = event.target;
        console.log(name,value)
        if(name=="is_universe"){
            setFormData({ ...formData, [name]: !formData.is_universe });
        }else{
            setFormData({ ...formData, [name]: value });
        }
    }
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        const category: CategoryData = {
            id: 0,
            name: formData.name,
            image: formData.image,
            is_universe: formData.is_universe,
        }
        
        if (isEdit && categoryData) {
            category.id = categoryData.id
            //await updateAnime(anime)
        } else {
            console.log(category)
            await createCategory(category)
        }
        handleOpen()
    }

    useEffect(() => {
        console.log(isEdit, categoryData)
        if (isEdit && categoryData) {
            setFormData({
                name: categoryData.name,
                image: categoryData.image,
                is_universe: categoryData.is_universe
            })
        }
    }, [])

    return (
        <>
            <Dialog
                open={open}
                handler={handleOpen}
                animate={{
                    mount: { scale: 1, y: 0 },
                    unmount: { scale: 0.9, y: -100 },
                }}
                size="xs"
            >
                <DialogHeader>{isEdit ? "Edit Anime" : "Create Anime"}</DialogHeader>
                <form onSubmit={handleSubmit}>
                    <DialogBody className="space-y-4 pb-6">
                        <Input
                            label="Category"
                            crossOrigin={undefined}
                            value={formData.name}
                            name="name"
                            onChange={handleInputChange}
                        />
                        <Input
                            label="Image"
                            crossOrigin={undefined}
                            value={formData.image}
                            name="image"
                            onChange={handleInputChange}
                        />
                        <Switch
                            id="custom-switch-component"
                            ripple={false}
                            crossOrigin={undefined}
                            className="h-full w-full checked:bg-[#2ec946]"
                            containerProps={{
                                className: "w-11 h-6",
                            }}
                            circleProps={{
                                className: "before:hidden left-0.5 border-none",
                            }}
                            type="checkbox"
                            name="is_universe"
                            defaultChecked={formData.is_universe}
                            label="Set this category to universe"
                            onChange={handleInputChange}
                        />
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
                            <span>{isEdit ? "Save" : "Create"}</span>
                        </Button>
                    </DialogFooter>
                </form>
            </Dialog>
        </>)
}