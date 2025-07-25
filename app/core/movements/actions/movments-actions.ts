"use server";

import { getUserCategoriesAction } from "@/app/core/categories/actions/categories-actions";
import { getUserId } from "@/app/core/user/actions/user-actions";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { MovementTypeDict } from "../const/movement-type-dict";
import {
	createManyMovements,
	createMovement,
	deleteMovement,
	getAllMovements,
	getBalance,
	getTotalsByType,
} from "../repository/movements-repository";
import type {
	CreateMovement,
	CreateNotRecurringMovement,
	MovementWithCategoryAndMovementType,
} from "../types/movement-type";
import { CreateMovementSchema } from "../types/movement-type";

export async function createMovmentAction(
	_prevState: unknown,
	formData: FormData,
) {
	const form = Object.fromEntries(formData);
	const userId = await getUserId();
	if (!userId) throw new Error("No user id");
	const movementType =
		MovementTypeDict[form.movementType as keyof typeof MovementTypeDict];

	//TODO: create a recurring movement
	const newMovement: CreateMovement = {
		clerk_id: userId.toString(),
		amount: Number(form.amount),
		name: form.description as string,
		is_recurring: false,
		movement_type_id: movementType,
		created_at: new Date().toISOString(),
		category_id: Number(form.category),
		recurrence_start: null,
		recurrence_end: null,
		recurrence_period: null,
		transaction_date: form.date as string,
	};

	try {
		const _createdMovement = await createMovement(newMovement);
	} catch (error) {
		console.error(error);
	}
}

export async function getMovmentsAction(
	userId: string,
): Promise<MovementWithCategoryAndMovementType[]> {
	try {
		const movements = await getAllMovements(userId);
		if (!movements.length) return [];
		return movements.map((movements) => ({
			...movements,
			created_at: new Date(movements.created_at).toLocaleDateString("es-ES", {
				day: "2-digit",
				month: "2-digit",
				year: "numeric",
			}),
		}));
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function getTotalsByTypeAction() {
	try {
		const userId = await getUserId();
		if (!userId) throw new Error("No user id");
		return await getTotalsByType(userId);
	} catch (error) {
		console.error(error);
		return { total_expenses: 0, total_income: 0 };
	}
}

export async function getBalanceAction() {
	try {
		const userId = await getUserId();
		if (!userId) throw new Error("No user id");
		return await getBalance(userId);
	} catch (error) {
		console.error(error);
		return 0;
	}
}

export async function addMovmentsFromFileAction(
	_prevState: {
		message: string;
	},
	formData: FormData,
): Promise<void> {
	const file = formData.get("file") as File;
	if (!file) {
		throw new Error("No file uploaded");
	}
	const userId = await getUserId();
	const userCategories = await getUserCategoriesAction(userId);
	const fileContent = await file.arrayBuffer();
	const categoriesDescription = userCategories
		.map((cat) => `${cat.name} (id: ${cat.id})`)
		.join(", ");

	const result = await generateObject({
		model: openai("gpt-4o"),
		schema: z.object({
			expenses: CreateMovementSchema.array(),
		}),
		messages: [
			{
				role: "user",
				content: [
					{
						type: "text",
						text: `Extract the expenses and incomes from the PDF file and categorize them using ONLY the following user-defined categories:
            ${categoriesDescription}.

            When categorizing an expense, you must use the corresponding category ID in the category_id field.
            If an expense doesn't clearly match any of these categories, use the category with the closest match.

            The identifier of movement_type_id is a number that represents the type of movement (income or expense), which can be either 1 for income or 3 for expense.
			Don't forget about the transaction_date field, it should be the date of the movement.

            Each expense should include all required fields from the schema, with the category_id being one of the IDs listed above.`,
					},
					{
						type: "file",
						data: fileContent,
						mimeType: "application/pdf",
						filename: file.name,
					},
				],
			},
		],
	});
	const movements = result.object.expenses;
	console.log(movements);
	await createManyMovements(movements);
	revalidateTag("movement");
}

export async function extractMovementsFromFileAction(
	_prevState: { movements: CreateMovement[]; error: string | null },
	formData: FormData,
): Promise<{ movements: CreateMovement[]; error: string | null }> {
	try {
		const file = formData.get("file") as File;
		if (!file) {
			return { movements: [], error: "No file uploaded" };
		}
		const userId = await getUserId();
		if (!userId) return { movements: [], error: "No user id" };
		const userCategories = await getUserCategoriesAction(userId);
		const fileContent = await file.arrayBuffer();
		const categoriesDescription = userCategories
			.map((cat) => `${cat.name} (id: ${cat.id})`)
			.join(", ");

		const result = await generateObject({
			model: openai("gpt-4o"),
			schema: z.object({
				expenses: CreateMovementSchema.array(),
			}),
			messages: [
				{
					role: "user",
					content: [
						{
							type: "text",
							text: `Extract the expenses and incomes from the PDF file and categorize them using ONLY the following user-defined categories:
              ${categoriesDescription}. 

			  The incones or expenses could be in different columns, pages etc look for them all.
              When categorizing an expense, you must use the corresponding category ID in the category_id field.
              If an expense doesn't clearly match any of these categories, use the category with the closest match.

            The identifier of movement_type_id is a number that represents the type of movement (income or expense), which can be either 1 for income or 3 for expense.
  			Don't forget about the transaction_date field, it should be the date of the movement.

              Each expense should include all required fields from the schema, with the category_id being one of the IDs listed above.`,
						},
						{
							type: "file",
							data: fileContent,
							mimeType: "application/pdf",
							filename: file.name ?? "file.pdf",
						},
					],
				},
			],
		});
		const movementsRaw = result.object.expenses;
		const movements: CreateMovement[] = movementsRaw.map(
			(mov: CreateNotRecurringMovement) => ({
				clerk_id: String(userId),
				is_recurring: false,
				recurrence_period: null,
				recurrence_start: null,
				recurrence_end: null,
				...mov,
			}),
		);
		return { movements, error: null };
	} catch (e: unknown) {
		return {
			movements: [],
			error: e instanceof Error ? e.message : "Error al procesar el archivo",
		};
	}
}

export async function saveManyMovementsAction(
	movements: CreateMovement[],
): Promise<void> {
	if (!movements || movements.length === 0) return;
	await createManyMovements(movements);
	revalidateTag("movement");
}

export async function deleteMovmentAction(_prevState: unknown, id: number) {
	if (!id) throw new Error("No id provided");
	try {
		await deleteMovement(id);
		revalidateTag("movement");
	} catch (error) {
		console.error(error);
		throw error;
	}
}
