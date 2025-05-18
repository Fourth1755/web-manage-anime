import axios from "axios"
import { ConnectAnimapService } from "./builder"
import { CreateCategoryRequest, GetCategoryListResponse } from "./dtos/category"



export class CategoryUniverseService{
    private url:string
    private authorization: string
    
    constructor(){
        const connectAnimap = new ConnectAnimapService()
        this.url = connectAnimap.getCategoryUniverseUrl();
        this.authorization = connectAnimap.getAuthorization()
    }

    private getConfigHeaders(){
        return{
            "Content-Type": "application/json",
            "Authorization": this.authorization
        }
    }

    public async getCategoryUniverse() :Promise<GetCategoryListResponse[]>{
        const response = await axios.get(this.url, {
            headers: this.getConfigHeaders(),
        })
        return response.data
    }

    // public async createCategory(category:CreateCategoryRequest){
    //     const response = await axios.post(this.url,category, {
    //         headers: this.getConfigHeaders(),
    //     })
    //     return response.data
    // }
}