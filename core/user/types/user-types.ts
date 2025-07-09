import { z } from "zod";

export const userSchema = z.object({
	id: z.number(),
	email: z.string(),
	name: z.string(),
	currency: z.string(),
	clerk_id: z.string(),
});

export type User = z.infer<typeof userSchema>;
