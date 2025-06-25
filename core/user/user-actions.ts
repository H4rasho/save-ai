import { client } from "@/database/database";
import { currentUser } from "@clerk/nextjs/server";

export async function getCurrentUser() {
	const userLogged = await currentUser();
	const email = userLogged?.emailAddresses[0].emailAddress;
	if (!email) throw new Error("No email found");
	const userDb = await client.execute({
		sql: "SELECT * FROM users WHERE email = ?",
		args: [email],
	});
	if (!userDb) throw new Error("User not found");
	const [user] = userDb.rows;
	return user;
}

export async function getUserCategories(userId: number) {
	const userCategories = await client.execute({
		sql: "SELECT * FROM categories WHERE user_id = ?",
		args: [userId],
	});
	return userCategories.rows;
}
