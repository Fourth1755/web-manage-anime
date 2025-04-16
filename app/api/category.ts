import axios from "axios"
import { ConnectAnimapService } from "./builder"

type CategoryList = {
    id: number,
    name:string
    image:string
    is_universe:boolean
}

type CreateCategory = {
    id: number,
    name: string
    image: string
    is_universe: boolean
}

export class CategoryService{
    private url:string
    private authorization: string
    
    constructor(){
        const connectAnimap = new ConnectAnimapService()
        this.url = connectAnimap.getCategoriesUrl();
        this.authorization = connectAnimap.getAuthorization()
    }

    private getConfigHeaders(){
        return{
            "Content-Type": "application/json",
            "Authorization": this.authorization
        }
    }

    public async getCategories() :Promise<CategoryList[]>{
        const response = await axios.get(this.url, {
            headers: this.getConfigHeaders(),
        })
        return response.data
    }

    public async createCategory(category:CreateCategory){
        const response = await axios.post(this.url,category, {
            headers: this.getConfigHeaders(),
        })
        return response.data
    }
}