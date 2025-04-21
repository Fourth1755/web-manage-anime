export type GetCategoryListResponse = {
    id: string,
    name:string
    image:string
    is_universe:boolean
}

export type CreateCategoryRequest = {
    id: string,
    name: string
    image: string
    is_universe: boolean
}