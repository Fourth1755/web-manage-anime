"use client";

import { useState } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Textarea,
    Select,
    Option,
    Typography,
} from "../../../component/mtailwind";
import { CreateArtistRequest } from "@/app/api/dtos/artist";
import { createArtist } from "./action";
import DatePicker from "@/app/component/datePicker/datePicker";

type PropCreateArtistModal = {
    open: boolean;
    handler: () => void;
    isEdit: boolean;
    handlerResponseMessage: (message:string) => void;
}

type FormArtistData = {
    name:string
    name_japan: string
    first_name: string
    last_name: string
    first_name_japan: string
    last_name_japan: string
    image:string
    description: string
    record_label:string
    is_music_band: boolean
    race_one: string
    race_two: string
    date_of_birth: string
}

export default function CreateArtistModal(prop: PropCreateArtistModal) {
    const {open,isEdit } = prop
    const handleOpen = prop.handler
    const handlerResponseMessage = prop.handlerResponseMessage
    
    const [formData, setFormData] = useState<FormArtistData>({
        name: "",
        name_japan: "",
        first_name:"",
        last_name:"",
        first_name_japan:"",
        last_name_japan:"",
        image: "",
        description: "",
        record_label: "",
        is_music_band: false,
        race_one: "japan",
        race_two: "",
        date_of_birth: "",
    });

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement> | any
    ) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleChangeDateOfBirth = (date:any) => {
        console.log(date)
        setFormData({ ...formData, "date_of_birth": date }); 
    }

    const handleSubmit = async () => {
        if(prop.isEdit){
            // edit artist
            // const request:EditCategoryUniversesAnimeRequest = {
            //     anime_id: prop.anime_id,
            //     category_universe_ids: formData.category_ids
            // }
            // await editCategoryUniverseAnime(request);
        }else {
            // create artist
            const request:CreateArtistRequest = {
                name: formData.name,
                name_japan: formData.name_japan,
                first_name: formData.first_name,
                last_name: formData.last_name,
                first_name_japan: formData.first_name_japan,
                last_name_japan: formData.last_name_japan,
                image: formData.image,
                description: formData.description,
                date_of_birth: formData.date_of_birth,
                is_music_band: formData.is_music_band,
                race_one: formData.race_one,
                race_two:formData.race_two,
                record_label: formData.record_label
            }
            const res = createArtist(request);
            res.then((data)=>handlerResponseMessage(data))
        }
        handleOpen();
    };
    return (        
    <>
        <Dialog
                open={open}
                handler={handleOpen}
                animate={{
                    mount: { scale: 1, y: 0 },
                    unmount: { scale: 0.9, y: -100 },
                }}
            >
                <DialogHeader>{isEdit ? "Edit Artist" : "Create Artist"}</DialogHeader>
                    <DialogBody className="h-[32rem] overflow-y-scroll">
                        <div className="grid gap-6">
                            <Input
                                label="Name"
                                crossOrigin={undefined}
                                value={formData.name}
                                name="name"
                                onChange={handleInputChange}
                            />
                            <Input
                                label="Name japan"
                                crossOrigin={undefined}
                                value={formData.name_japan}
                                name="name_japan"
                                onChange={handleInputChange}
                            />
                            <Input
                                label="First_name"
                                crossOrigin={undefined}
                                value={formData.first_name}
                                name="first_name"
                                onChange={handleInputChange}
                            />
                            <Input
                                label="Last Name"
                                crossOrigin={undefined}
                                value={formData.last_name}
                                name="last_name"
                                onChange={handleInputChange}
                            />
                            <Input
                                label="First Name Japan"
                                crossOrigin={undefined}
                                value={formData.first_name_japan}
                                name="first_name_japan"
                                onChange={handleInputChange}
                            />
                            <Input
                                label="Last Name Japan"
                                crossOrigin={undefined}
                                value={formData.last_name_japan}
                                name="last_name_japan"
                                onChange={handleInputChange}
                            />
                            <Input
                                label="Image"
                                crossOrigin={undefined}
                                value={formData.image}
                                name="image"
                                onChange={handleInputChange}
                            />
                            <Input
                                label="Description"
                                crossOrigin={undefined}
                                value={formData.description}
                                name="description"
                                onChange={handleInputChange}
                            />
                            <Input
                                label="Record Label"
                                crossOrigin={undefined}
                                value={formData.record_label}
                                name="record_label"
                                onChange={handleInputChange}
                            />
                            <h1>Select Date Of Birth</h1>
                            <div aria-hidden={true}>
                                <DatePicker handler={handleChangeDateOfBirth}/>
                            </div>
                        </div>
                    </DialogBody>
                    <DialogFooter>
                        <Button
                            variant="text"
                            color="green"
                            onClick={handleOpen}
                            className="mr-1"
                        >
                            <span>Cancel</span>
                        </Button>
                        <Button 
                            variant="gradient" 
                            color="green" 
                            onClick={handleSubmit}>
                            <span>{isEdit ? "Edit Artist" : "Create Artist"}</span>
                        </Button>
                    </DialogFooter>
        </Dialog>
    </>)
}