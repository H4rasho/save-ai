import { z } from "zod";

export const MovementSchema = z.object({
	id: z.number().int().positive(),
	user_id: z.number().int().positive(),
	category_id: z.number().int().positive().nullable(),
	movement_type_id: z.number().int().positive(),
	name: z.string(),
	amount: z.number(),
	is_recurring: z.boolean(),
	recurrence_period: z.string().nullable(), // Puede ser 'monthly', 'weekly', etc.
	recurrence_start: z.string().nullable(), // ISO date string
	recurrence_end: z.string().nullable(), // ISO date string
	created_at: z.string(), // ISO datetime string
});

// Tipo TypeScript inferido
export type Movement = z.infer<typeof MovementSchema>;

export type CreateMovement = Omit<Movement, "id">;

export type MovementWithCategoryAndMovementType = Movement & {
	category_name: string;
	movement_type_name: string;
};

export enum MovementType {
	INCOME = "INCOME",
	FIXED_EXPENSE = "FIXED_EXPENSE",
	EXPENSE = "EXPENSE",
}
