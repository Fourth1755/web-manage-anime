"use client";
import { 
    Dialog, 
    Button, 
    DialogHeader, 
    DialogBody, 
    Input, 
    DialogFooter, 
    Textarea,
} from "../../../../component/mtailwind";
import { useEffect, useState } from "react";
import { CreateCharacterRequest } from "@/app/api/dtos/character";
import { createCharacter } from "./action";

type PropCreateCharacterModal = {
    open: boolean;
    handler: () => void;
    handlerResponseMessage: (message:string) => void;
    anime_id:string
}

type FormData = {
    name: string
    first_name: string
    last_name: string
    name_thai: string
    first_name_thai: string
    last_name_thai: string
    first_name_japan: string
    last_name_japan: string
    image: string
    is_main_character: boolean
    description: string
}

export default function CreateCharacterModal(prop: PropCreateCharacterModal) {
    const open = prop.open;
    const handleOpen = prop.handler;
    const handlerResponseMessage = prop.handlerResponseMessage;

    const [formData, setFormData] = useState<FormData>({
        name:"",
        first_name:"",
        last_name:"",
        name_thai:"",
        first_name_thai:"",
        last_name_thai:"",
        first_name_japan:"",
        last_name_japan:"",
        image: "",
        is_main_character: true,
        description:"",
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement> | any) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleSubmit = () => {
        const request: CreateCharacterRequest = {
            anime_id: prop.anime_id,
            name: formData.name,
            first_name:formData.first_name,
            last_name: formData.last_name,
            name_thai: formData.name_thai,
            first_name_thai: formData.first_name_thai,
            last_name_thai:formData.last_name_thai,
            first_name_japan: formData.first_name_japan,
            last_name_japan: formData.last_name_japan,
            image: formData.image,
            is_main_character: formData.is_main_character,
            description: formData.description,
        }
        const res = createCharacter(request,prop.anime_id);
        res.then((data)=>handlerResponseMessage(data))
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
                size="sm"
            >
                <DialogHeader>Crate Character Anime</DialogHeader>
                    <DialogBody className="space-y-4 pb-6 overflow-scroll h-96">
                        <Input
                            label="Name"
                            crossOrigin={undefined}
                            value={formData.name}
                            name="name"
                            onChange={handleInputChange}
                        />
                        <Input
                            label="First Name"
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
                            label="Name Thai"
                            crossOrigin={undefined}
                            value={formData.name_thai}
                            name="name_thai"
                            onChange={handleInputChange}
                        />
                        <Input
                            label="First Name Thai"
                            crossOrigin={undefined}
                            value={formData.first_name_thai}
                            name="first_name_thai"
                            onChange={handleInputChange}
                        />
                        <Input
                            label="Last Name Thai"
                            crossOrigin={undefined}
                            value={formData.last_name_thai}
                            name="last_name_thai"
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
                            label="Character Image"
                            crossOrigin={undefined}
                            value={formData.image}
                            name="image"
                            onChange={handleInputChange}
                        />
                        <Textarea
                            label="description"
                            value={formData.description}
                            name="description"
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
