
interface IAnime{
    id: number,
    name: String,
    year: String,
    score: String,
    seasonal: String
}
async function getAnime(id:number):Promise<IAnime>{
    const response = await fetch(`http://localhost:8080/animes/${id}`,{
        method:"GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZvdXJ0aEBnbWFpbC5jb20iLCJleHAiOjE3MjI2NzM1MTAsInJvbGUiOiJhZG1pbiJ9.E-5c_I_qGq_S0ew9zNN8OmlzjpYX6GhVAPzGygjt1uU"
          },
    })
    if(!response.ok){
        throw new Error('cannot fetch anime')
    }

    return response.json()
}

export default async function Page({params}: { params: { slug: number } }){
    const anime = await getAnime(params.slug)
    return (
        <div className="container mx-auto md:px-32 px-5 pt-20">
            <h1>{anime.name}</h1>
        </div>
    )
}