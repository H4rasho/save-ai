"use server";

import { client } from "@/database/database";
import type { UserCreateProfile } from "@/types/income";
import { currentUser } from "@clerk/nextjs/server";

export const createUserProfile = async (profile: UserCreateProfile) => {
	const user = await currentUser();

	if (!user) {
		throw new Error("User not found");
	}
	const email = user.emailAddresses[0].emailAddress;
	const name = user.firstName;

	await client.execute("BEGIN");
	try {
		const userResult = await client.execute({
			sql: "INSERT INTO users (name, email, currency) VALUES (?, ?, ?)",
			args: [name, email, profile.selectedCurrency],
		});

		if (!userResult.lastInsertRowid) {
			throw new Error("User not created");
		}

		const userId = userResult.lastInsertRowid;
		await Promise.all(
			profile.categories.map((category) =>
				client.execute({
					sql: "INSERT INTO categories (user_id, name) VALUES (?, ?)",
					args: [userId, category],
				}),
			),
		);

		await Promise.all(
			profile.incomeSources.map((income) =>
				client.execute({
					sql: "INSERT INTO income_sources (user_id, name, amount) VALUES (?, ?, ?)",
					args: [userId, income.source, income.amount],
				}),
			),
		);

		await Promise.all(
			profile.fixedExpenses.map((expense) =>
				client.execute({
					sql: "INSERT INTO fixed_expenses (user_id, name, amount) VALUES (?, ?, ?)",
					args: [userId, expense, 0],
				}),
			),
		);
		await client.execute("COMMIT");
	} catch (error) {
		await client.execute("ROLLBACK");
		throw error;
	}
};
