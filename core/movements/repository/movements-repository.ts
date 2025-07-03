import type {
	CreateMovement,
	CreateNotRecurringMovement,
	Movement,
	MovementWithCategoryAndMovementType,
} from "@/core/movements/types/movement-type";
import { client } from "@/database/database";

export async function createManyMovements(
	movements: CreateNotRecurringMovement[],
): Promise<void> {
	if (movements.length === 0) {
		return;
	}
	// Construir la consulta SQL para inserción múltiple
	const placeholders = movements
		.map(() => "(?, ?, ?, ?, ?, 0, NULL, NULL, NULL)")
		.join(", ");

	const values = movements.flatMap((movement) => [
		movement.user_id,
		movement.category_id ?? null,
		movement.movement_type_id,
		movement.name,
		movement.amount,
	]);

	await client.execute({
		sql: `
      INSERT INTO movements (
        user_id,
        category_id,
        movement_type_id,
        name,
        amount,
        is_recurring,
        recurrence_period,
        recurrence_start,
        recurrence_end
      ) VALUES ${placeholders}
		`,
		args: values,
	});
}

export async function createMovement(
	movement: CreateMovement,
): Promise<Movement> {
	const {
		user_id,
		category_id,
		movement_type_id,
		name,
		amount,
		is_recurring,
		recurrence_period,
		recurrence_start,
		recurrence_end,
	} = movement;

	const result = await client.execute({
		sql: `
      INSERT INTO movements (
        user_id,
        category_id,
        movement_type_id,
        name,
        amount,
        is_recurring,
        recurrence_period,
        recurrence_start,
        recurrence_end
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
		args: [
			user_id,
			category_id ?? null,
			movement_type_id,
			name,
			amount,
			is_recurring ? 1 : 0,
			recurrence_period ?? null,
			recurrence_start ?? null,
			recurrence_end ?? null,
		],
	});

	// Recuperar el movimiento recién insertado
	const id = result.lastInsertRowid as unknown as number;
	const row = await client.execute({
		sql: "SELECT * FROM movements WHERE id = ?",
		args: [id],
	});

	if (!row.rows.length) {
		throw new Error("No se pudo recuperar el movimiento insertado");
	}

	// Adaptar los tipos según MovementSchema
	const createdMovement = row.rows[0] as unknown as Movement;
	return createdMovement;
}

export async function getAllMovements(
	userId: number,
): Promise<MovementWithCategoryAndMovementType[]> {
	const rows = await client.execute({
		sql: `SELECT m.*, c.name as category_name, mt.name as movement_type_name, FORMAT(m.created_at, 'dd/MM/yyyy') as created_at  FROM movements as m
    LEFT JOIN categories c ON m.category_id = c.id
    JOIN movement_types mt ON m.movement_type_id = mt.id
    WHERE m.user_id = ?`,
		args: [userId],
	});
	return rows.rows as unknown as MovementWithCategoryAndMovementType[];
}

export async function getTotalsByType(
	userId: number,
): Promise<{ total_expenses: number; total_income: number }> {
	const rows = await client.execute({
		sql: `
      SELECT
        SUM(CASE WHEN mt.name = 'expense' THEN m.amount ELSE 0 END) as total_expenses,
        SUM(CASE WHEN mt.name = 'income' THEN m.amount ELSE 0 END) as total_income
      FROM movements m
      JOIN movement_types mt ON m.movement_type_id = mt.id
      WHERE m.user_id = ?
    `,
		args: [userId],
	});
	const result = rows.rows[0] as unknown as {
		total_expenses: number;
		total_income: number;
	};
	return {
		total_expenses: result.total_expenses ?? 0,
		total_income: result.total_income ?? 0,
	};
}

export async function getBalance(userId: number): Promise<number> {
	const rows = await client.execute({
		sql: `
      SELECT
        SUM(CASE WHEN mt.name = 'income' THEN m.amount ELSE 0 END) -
        SUM(CASE WHEN mt.name = 'expense' THEN m.amount ELSE 0 END) as balance
      FROM movements m
      JOIN movement_types mt ON m.movement_type_id = mt.id
      WHERE m.user_id = ?
    `,
		args: [userId],
	});
	const result = rows.rows[0] as unknown as { balance: number };
	return result.balance ?? 0;
}

export async function deleteMovement(id: number): Promise<void> {
	await client.execute({
		sql: `DELETE FROM movements WHERE id = ?`,
		args: [id],
	});
}
