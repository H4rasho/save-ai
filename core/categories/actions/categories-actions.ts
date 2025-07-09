import { db } from "@/database/database";
import { eq } from "drizzle-orm";
import { categories } from "../model/categories-model";

export const getUserCategoriesAction = async (userId: string) => {
	const userCategories = await db
		.select()
		.from(categories)
		.where(eq(categories.clerk_id, userId));
	return userCategories;
};
