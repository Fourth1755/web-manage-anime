"use client";
import { 
    Dialog, 
    Button, 
    DialogHeader, 
    DialogBody, 
    Input, 
    DialogFooter, 
} from "../../../../component/mtailwind";
import { useEffect, useState } from "react";
import { UpdateEpisodeRequest } from "@/app/api/dtos/episode";
import { updateEpisode } from "./action";

type EpisodeData = {
    id: string
    number: number
    name: string
    name_thai: string
    name_english: string
    name_japan:string
}

type PropsEditEpisodeModal = {
    open: boolean;
    handler: () => void;
    episode: EpisodeData
    handlerResponseMessage: (message:string) => void;
    anime_id:string
}

type FormData = {
    name: string
    name_thai: string
    name_english: string
    name_japan:string
}

export default function EditEpisodeModal(prop: PropsEditEpisodeModal) {
    const open = prop.open;
    const handleOpen = prop.handler;
    const handlerResponseMessage = prop.handlerResponseMessage;
    const epidoseData = prop.episode;

    const [formData, setFormData] = useState<FormData>({
        name:epidoseData.name,
        name_thai:epidoseData.name_thai,
        name_english:epidoseData.name_english,
        name_japan:epidoseData.name_japan,
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement> | any) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleSubmit = () => {
        const request: UpdateEpisodeRequest = {
            id:epidoseData.id,
            name: formData.name,
            name_thai:formData.name_thai,
            name_english: formData.name_english,
            name_japan: formData.name_japan
        }
        const res = updateEpisode(request,prop.anime_id);
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
                <DialogHeader>Edit Episode {epidoseData.number}</DialogHeader>
                    <DialogBody className="space-y-4 pb-6">
                        <Input
                            label="Episode name"
                            crossOrigin={undefined}
                            value={formData.name}
                            name="name"
                            onChange={handleInputChange}
                        />
                        <Input
                            label="Episode thai name"
                            crossOrigin={undefined}
                            value={formData.name_thai}
                            name="name_thai"
                            onChange={handleInputChange}
                        />
                        <Input
                            label="Episode english name"
                            crossOrigin={undefined}
                            value={formData.name_english}
                            name="name_english"
                            onChange={handleInputChange}
                        />
                        <Input
                            label="Episode japan name"
                            crossOrigin={undefined}
                            value={formData.name_japan}
                            name="name_japan"
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
