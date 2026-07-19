export const dynamic = 'force-dynamic';

import { CategoryUniverseService } from "../api/categoryUniverse";
import CreateCategoryUniverseButton from "./component/createCategoryUniverseButton";

export default async function CategoryUniversePage() {
    const categoryUniverseService = new CategoryUniverseService();
    const categoryUniverses = await categoryUniverseService.getCategoryUniverse();

    return (
        <div className="container mx-auto px-5 pt-20 md:px-40">
            <div className="flex justify-between py-10">
                <h1>Category Universe</h1>
                <CreateCategoryUniverseButton />
            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-left text-sm text-black">
                    <thead>
                        <tr>
                            <th scope="col" className="px-6 py-3">No.</th>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Image</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categoryUniverses.map((categoryUniverse, index) => (
                            <tr key={categoryUniverse.id} className="border-b">
                                <td className="px-6 py-4 font-medium">{index + 1}</td>
                                <td className="px-6 py-4">{categoryUniverse.name}</td>
                                <td className="px-6 py-4">{categoryUniverse.image || "—"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
