import { categories } from "@/app/core/categories/model/categories-model";
import {
	movement_types,
	movements,
} from "@/app/core/movements/model/movement-model";
import {
	type CreateMovement,
	type CreateNotRecurringMovement,
	type Movement,
	MovementType,
	type MovementWithCategoryAndMovementType,
} from "@/app/core/movements/types/movement-type";
import { getUserId } from "@/app/core/user/actions/user-actions";
import { db } from "@/database/database";
import { and, eq, sql } from "drizzle-orm";

export async function createManyMovements(
	movementsData: CreateNotRecurringMovement[],
): Promise<void> {
	const clerkId = await getUserId();

	if (movementsData.length === 0) {
		return;
	}
	await db.insert(movements).values(
		movementsData.map((movement) => ({
			clerk_id: clerkId,
			category_id: movement.category_id ?? null,
			movement_type_id: movement.movement_type_id,
			name: movement.name,
			amount: movement.amount,
			is_recurring: 0,
			recurrence_period: null,
			recurrence_start: null,
			recurrence_end: null,
		})),
	);
}

export async function createMovement(
	movement: CreateMovement,
): Promise<Movement> {
	const {
		clerk_id,
		category_id,
		movement_type_id,
		name,
		amount,
		is_recurring,
		recurrence_period,
		recurrence_start,
		recurrence_end,
		transaction_date,
		created_at,
	} = movement;

	const [inserted] = await db
		.insert(movements)
		.values({
			clerk_id,
			category_id: category_id ?? null,
			movement_type_id,
			name,
			amount,
			is_recurring: is_recurring ? 1 : 0,
			recurrence_period: recurrence_period ?? null,
			recurrence_start: recurrence_start ?? null,
			recurrence_end: recurrence_end ?? null,
			transaction_date,
			created_at,
		})
		.returning();

	if (!inserted) {
		throw new Error("No se pudo recuperar el movimiento insertado");
	}
	return {
		...inserted,
		is_recurring: Boolean(inserted.is_recurring),
	} as Movement;
}

export async function getAllMovements(
	userId: string,
): Promise<MovementWithCategoryAndMovementType[]> {
	const now = new Date();
	const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
		.toISOString()
		.slice(0, 10);
	const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
		.toISOString()
		.slice(0, 10);

	const rows = await db
		.select({
			id: movements.id,
			clerk_id: movements.clerk_id,
			category_id: movements.category_id,
			movement_type_id: movements.movement_type_id,
			name: movements.name,
			amount: movements.amount,
			is_recurring: movements.is_recurring,
			recurrence_period: movements.recurrence_period,
			recurrence_start: movements.recurrence_start,
			recurrence_end: movements.recurrence_end,
			created_at: movements.created_at,
			category_name: categories.name,
			movement_type_name: movement_types.name,
			transaction_date: movements.transaction_date,
		})
		.from(movements)
		.leftJoin(categories, eq(movements.category_id, categories.id))
		.innerJoin(
			movement_types,
			eq(movements.movement_type_id, movement_types.id),
		)
		.where(
			and(
				eq(movements.clerk_id, userId),
				sql`${movements.transaction_date} >= ${firstDay}`,
				sql`${movements.transaction_date} <= ${lastDay}`,
			),
		);
	return rows.map((row) => ({
		...row,
		is_recurring: Boolean(row.is_recurring),
	})) as MovementWithCategoryAndMovementType[];
}

export async function getTotalsByType(
	userId: string,
): Promise<{ total_expenses: number; total_income: number }> {
	const now = new Date();
	const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
		.toISOString()
		.slice(0, 10);
	const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
		.toISOString()
		.slice(0, 10);

	const rows = await db
		.select({
			total_expenses: sql`SUM(CASE WHEN ${movement_types.name} = ${MovementType.EXPENSE} THEN ${movements.amount} ELSE 0 END)`,
			total_income: sql`SUM(CASE WHEN ${movement_types.name} = ${MovementType.INCOME} THEN ${movements.amount} ELSE 0 END)`,
		})
		.from(movements)
		.innerJoin(
			movement_types,
			eq(movements.movement_type_id, movement_types.id),
		)
		.where(
			and(
				eq(movements.clerk_id, userId),
				sql`${movements.transaction_date} >= ${firstDay}`,
				sql`${movements.transaction_date} <= ${lastDay}`,
			),
		);
	const result = rows[0] as unknown as {
		total_expenses: number;
		total_income: number;
	};
	return {
		total_expenses: result?.total_expenses ?? 0,
		total_income: result?.total_income ?? 0,
	};
}

export async function getBalance(userId: string): Promise<number> {
	const now = new Date();
	const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
		.toISOString()
		.slice(0, 10);
	const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
		.toISOString()
		.slice(0, 10);

	const rows = await db
		.select({
			balance: sql`SUM(CASE WHEN ${movement_types.name} = ${MovementType.INCOME} THEN ${movements.amount} ELSE 0 END) - SUM(CASE WHEN ${movement_types.name} = ${MovementType.EXPENSE} THEN ${movements.amount} ELSE 0 END)`,
		})
		.from(movements)
		.innerJoin(
			movement_types,
			eq(movements.movement_type_id, movement_types.id),
		)
		.where(
			and(
				eq(movements.clerk_id, userId),
				sql`${movements.transaction_date} >= ${firstDay}`,
				sql`${movements.transaction_date} <= ${lastDay}`,
			),
		);
	const result = rows[0] as unknown as { balance: number };
	return result?.balance ?? 0;
}

export async function deleteMovement(id: number): Promise<void> {
	await db.delete(movements).where(eq(movements.id, id));
}
