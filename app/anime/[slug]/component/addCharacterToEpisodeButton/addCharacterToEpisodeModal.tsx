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
    Input, 
    Checkbox } from "../../../../component/mtailwind";
import { useEffect, useState } from "react";
import { CharacterService } from "@/app/api/character";
import { AddCharacterToEpisodeRequest } from "@/app/api/dtos/episode";
import { addCharacterToEpisode } from "./action";

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
    const handlerResponseMessage = prop.handlerResponseMessage;

    const [character, setCharacter] = useState("")

    const [characterList, setCharacterList] = useState<CharacterItem[]>()
    const cheakCharacterIsDup = (characterListVal: FormDataCharacter[],characterId :string) =>{
        for(let i=0;i<characterListVal.length;i++){
            if(characterListVal[i].id == characterId){
                return true
            }
        }
        return false
    }

    const changeCharacter = (characterId = "") => {
        let characterListVal: FormDataCharacter[] = [];
        if(formData.character_list.length != 0) {
            characterListVal = formData.character_list
        } 
        const isDupCharacter = cheakCharacterIsDup(characterListVal,characterId);
        if(!isDupCharacter){
            let characterVal: FormDataCharacter = {
                id:characterId,
                description:"",
                first_appearance:false,
                appearance: false
            }
            characterListVal.push(characterVal)
            console.log(characterVal)
            setFormData({ ...formData, "character_list": characterListVal });
        }
    };

    const handleInputChange = (characterId:string,name:string) => {
        for(let i=0;i<formData.character_list.length;i++){
            if(formData.character_list[i].id==characterId){
                const characterListVal = formData.character_list.filter((item)=>item.id!=characterId)
                let characterVal: FormDataCharacter = {
                    id:characterId,
                    description:"",
                    first_appearance: name=="first_appearance"?!formData.character_list[i].first_appearance:formData.character_list[i].first_appearance,
                    appearance: name=="appearance"?!formData.character_list[i].appearance:formData.character_list[i].appearance
                }
                characterListVal.push(characterVal)
                setFormData({ ...formData, "character_list": characterListVal });
                console.log(characterVal)
                break;
            }
        }
    }


    const handleSubmit = () => {
        const request:AddCharacterToEpisodeRequest = {
             episode_id:prop.episode.id,
             characters:formData.character_list,
        }
        const response = addCharacterToEpisode(request,prop.anime_id)
        response.then((data)=>handlerResponseMessage(data))
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
    }, [prop]);
    return (
        <>
            <Dialog
                open={open}
                handler={handleOpen}
                animate={{
                    mount: { scale: 1, y: 0 },
                    unmount: { scale: 0.9, y: -100 },
                }}
                size="md"
            >
                <DialogHeader>Manage Tag Anime</DialogHeader>
                    <DialogBody className="space-y-4 pb-6">
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
                        <table className="w-full text-sm text-left text-black">
                            <thead>
                                <tr>
                                    <th  scope="col" className="py-3">Name</th>
                                    <th  scope="col" className="py-3">Appearance</th>
                                    <th  scope="col" className="py-3">First Appearance</th>
                                    <th  scope="col" className="py-3">Delete</th>
                                </tr>
                            </thead>
                            {formData?.character_list?.length?
                                <tbody>
                                    {formData.character_list.map((item,index)=>(
                                            <tr 
                                                key={index}
                                                >
                                                <td>
                                                    <Input
                                                        crossOrigin={undefined}
                                                        value={characterMap.get(item.id)}
                                                        disabled
                                                />   
                                                </td>
                                                <td>
                                                    <Checkbox 
                                                        crossOrigin={undefined}
                                                        id="ripple-on" 
                                                        ripple={true}
                                                        onClick={() => handleInputChange(item.id,"appearance")}
                                                        name="appearance"
                                                        />
                                                </td>
                                                <td>
                                                    <Checkbox 
                                                        crossOrigin={undefined}
                                                        id="ripple-on"
                                                        ripple={true}
                                                        onClick={() => handleInputChange(item.id,"first_appearance")}
                                                        name="first_appearance"
                                                         />
                                                </td>
                                                <td>
                                                <Button
                                                    onClick={() => onCloseChipCharacter(item.id)}
                                                    color="red"
                                                    variant="outlined"
                                                    >X</Button>
                                                </td>
                                            </tr>
                                        ))}
                            </tbody>:<></>}
                        </table>
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
