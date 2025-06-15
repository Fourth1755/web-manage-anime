"use client";
import { CategoryService } from "@/app/api/category";
import { 
    Dialog, 
    Button, 
    DialogHeader, 
    DialogBody, 
    Option, 
    DialogFooter, 
    Select, 
    CardBody, 
    Chip } from "../../../../component/mtailwind";
import { useEffect, useState } from "react";
import { CharacterService } from "@/app/api/character";
import { AddCharacterToEpisodeRequest } from "@/app/api/dtos/episode";
import { addCharacterToEpisode } from "./action";

type CategoryData = {
    id: string
    name: string
}

type EpisodeData = {
    id: string
    number: number
    name: string
    name_thai: string
    name_english: string
    name_japan:string
}

type PropsAddCharacterToEpisodeModal = {
    open: boolean;
    handler: () => void;
    episode: EpisodeData
    handlerResponseMessage: (message:string) => void;
    anime_id: string
}

type FormDataCharacter = {
    id: string
    description: string
    first_appearance: boolean
    appearance:boolean
}

type FormData = {
    character_list: FormDataCharacter[]
}

type CharacterItem = {
    id: string
    name: string
    full_name: string
}

let characterMap = new Map();

export default function AddCharacterToEpisodeModal(prop: PropsAddCharacterToEpisodeModal) {
    const open = prop.open;
    const handleOpen = prop.handler;
    const [formData, setFormData] = useState<FormData>({
        character_list: [],
    });
    const [character, setCharacter] = useState("")
    const [chipOpen, setChipOpen] = useState(true);

    const [characterList, setCharacterList] = useState<CharacterItem[]>()
    const changeCharacter = (characterId = "") => {
        let characterListVal: FormDataCharacter[] = [];
        if(formData.character_list.length != 0) {
            characterListVal = formData.character_list
        } 

        let characterVal: FormDataCharacter = {
            id:characterId,
            description:"",
            first_appearance:false,
            appearance: true
        }
        characterListVal.push(characterVal)
        console.log(characterVal)
        setFormData({ ...formData, "character_list": characterListVal });
    };


    const handleSubmit = () => {
        const request:AddCharacterToEpisodeRequest = {
             episode_id:prop.episode.id,
             characters:formData.character_list,
        }
        addCharacterToEpisode(request,prop.anime_id)
        handleOpen();
    };

    const onCloseChipCharacter = (id:String) => {
        const characteVal = formData.character_list.filter((item)=>item.id!=id)
        console.log(characteVal)
        setFormData({ ...formData, "character_list": characteVal });
    }

    //fetch list of category universe
    const initCharacter = async (animeId: string) => {
        const categorySerivce = new CharacterService()
        const response = await categorySerivce.getCharacterByAnimeId(animeId);
        if (response.character != null) {
            setCharacterList(response.character);
            response.character.map((item)=>{
                characterMap.set(item.id,item.name)
            })
        }
    };

    useEffect(() => {
        initCharacter(prop.anime_id);
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
                                    {formData?.character_list?.length?<div>
                                        {formData.character_list.map((item,index)=>(
                                            <div 
                                                key={index}
                                                className="py-1">
                                                <Chip
                                                    open={chipOpen}
                                                    onClose={() => onCloseChipCharacter(item.id)}
            
                                                    value={characterMap.get(item)}/>
                                            </div>
            
                                        ))}
                                    </div>:<></>}
                                </CardBody>
                        <Select
                            variant="outlined"
                            label="Choose a Character"
                            color="green"
                            value={character}
                            name="character"
                            onChange={changeCharacter}
                        >
                            {characterList?.map((item,i) => (
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
