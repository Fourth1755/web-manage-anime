"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { CategoryService } from "@/app/api/category";

type CategoryData = {
    id: string,
    name: string
    image: string
    is_universe: boolean
}

export async function createCategory(category: CategoryData) {
  const categorySerivce = new CategoryService();
  try {
    // Call database
    await categorySerivce.createCategory(category);
  } catch (error) {
    // Handle errors
    console.error(error);
  }
  revalidatePath("/category"); // Update cached posts
  redirect(`/category`); // Navigate to the new post page
}