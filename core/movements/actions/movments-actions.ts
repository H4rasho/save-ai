"use server";

import { MovementTypeDict } from "../const/movement-type-dict";
import {
	createMovement,
	getAllMovements,
	getBalance,
	getTotalsByType,
} from "../repository/movements-repository";
import type { CreateMovement } from "../types/movement-type";

export async function createMovmentAction(
	prevState: unknown,
	formData: FormData,
) {
	const form = Object.fromEntries(formData);
	//TODO: get user id from clerk and database
	const userId = 1;
	const movementType =
		MovementTypeDict[form.movementType as keyof typeof MovementTypeDict];

	//TODO: create a recurring movement
	const newMovement: CreateMovement = {
		user_id: userId,
		amount: Number(form.amount),
		name: form.description as string,
		is_recurring: false,
		movement_type_id: movementType,
		created_at: new Date().toISOString(),
		category_id: Number(form.category),
		recurrence_start: null,
		recurrence_end: null,
		recurrence_period: null,
	};
	try {
		const createdMovement = await createMovement(newMovement);
	} catch (error) {
		console.error(error);
	}
}

export async function getMovmentsAction(userId: number) {
	try {
		const movements = await getAllMovements(userId);
		return movements;
	} catch (error) {
		console.error(error);
	}
}

export async function getTotalsByTypeAction(userId: number) {
	try {
		return await getTotalsByType(userId);
	} catch (error) {
		console.error(error);
		return { total_expenses: 0, total_income: 0 };
	}
}

export async function getBalanceAction(userId: number) {
	try {
		return await getBalance(userId);
	} catch (error) {
		console.error(error);
		return 0;
	}
}
