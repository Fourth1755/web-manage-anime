import Link from "next/link";
import { Button } from "../component/mtailwind";
import { CategoryService } from "../api/category";
import CreateCategoryButton from "./component/createCategoryButton";

type Category = {
    id: string,
    name:string
    image:string
    is_universe:boolean
}

export default async function Page() {
    const categorySerivce = new CategoryService()
    const categories = await categorySerivce.getCategories()
    return (<div>
        <div className="container mx-auto md:px-40 px-5 pt-20">
            <div className="flex justify-between py-10">
                <h1>Category</h1>
                <CreateCategoryButton name="Create Category" category={undefined} isEdit={false}/>
            </div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-black">
                    <thead>
                        <tr>
                            <th  scope="col" className="px-6 py-3">No.</th>
                            <th  scope="col" className="px-6 py-3">Name</th>
                            <th  scope="col" className="px-6 py-3">Universe</th>
                            <th  scope="col" className="px-6 py-3">Detail</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category: Category, index: number) => (
                            <tr key={index}>
                                <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{index + 1}</td>
                                <td>{category.name}</td>
                                <td>{category.is_universe}</td>
                                <td>
                                    <Link href={`category/${category.id}`}>
                                        <Button variant="outlined" color="pink" type="submit">
                                            <span>Detail</span>
                                        </Button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>)
}