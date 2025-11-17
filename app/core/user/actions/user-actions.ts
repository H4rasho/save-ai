"use server";
import { users } from "@/app/core/user/model/user-model";
import type { User } from "@/app/core/user/types/user-types";
import { db } from "@/database/database";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getCurrentUser(): Promise<User> {
	const userLogged = await currentUser();
	const clerkId = userLogged?.id;
	if (!clerkId) throw new Error("No clerk id found");
	const userDb = await db
		.select()
		.from(users)
		.where(eq(users.clerk_id, clerkId));
	const user = userDb[0] as User;
	return user;
}

export async function getUserId(): Promise<string | undefined> {
	const userLogged = await currentUser();
	const clerkId = userLogged?.id;
	return clerkId;
}

export const getUserCurrency = async (): Promise<string> => {
	const user = await getCurrentUser();
	return user?.currency || "CLP";
};

export const updateUserCurrency = async (
	currency: string,
): Promise<{ success: boolean; message: string }> => {
	try {
		const userLogged = await currentUser();
		const clerkId = userLogged?.id;
		if (!clerkId) throw new Error("No clerk id found");

		await db.update(users).set({ currency }).where(eq(users.clerk_id, clerkId));

		revalidatePath("/settings");
		revalidatePath("/home");

		return { success: true, message: "Moneda actualizada correctamente" };
	} catch (error) {
		console.error("Error updating currency:", error);
		return { success: false, message: "Error al actualizar la moneda" };
	}
};
