"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CategoryUniverseService } from "../../api/categoryUniverse";

export async function createCategoryUniverse(categoryUniverse: { name: string; image: string }) {
    const categoryUniverseService = new CategoryUniverseService();
    await categoryUniverseService.createCategoryUniverse(categoryUniverse);
    revalidatePath("/category-universe");
    redirect("/category-universe");
}
