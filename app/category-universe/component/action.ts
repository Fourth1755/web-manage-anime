"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CategoryUniverseService } from "../../api/categoryUniverse";

export async function createCategoryUniverse(categoryUniverse: { name: string; image: string }) {
    const categoryUniverseService = new CategoryUniverseService();

    try {
        await categoryUniverseService.createCategoryUniverse(categoryUniverse);
    } catch (error: any) {
        return {
            success: false,
            error: error?.response?.data?.message ?? "Unable to create category universe",
        };
    }

    revalidatePath("/category-universe");
    redirect("/category-universe");
}
