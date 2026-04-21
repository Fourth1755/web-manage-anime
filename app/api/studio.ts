import axios from "axios";
import { ConnectAnimapService } from "./builder";
import { GetStudioResponse } from "./dtos/studio";

export class StudioService {
    private url:string
    private authorization: string
    
    constructor(){
        const connectAnimap = new ConnectAnimapService()
        this.url = connectAnimap.getUrl();
        this.authorization = connectAnimap.getAuthorization()
    }

    private getConfigHeaders(){
        return{
            "Content-Type": "application/json",
            "Authorization": this.authorization
        }
    }

    public async getStudio() :Promise<GetStudioResponse[]> {
        const response = await axios.get(`${this.url}/studios`, {
            headers: this.getConfigHeaders()
        })
        return response.data
    }
}