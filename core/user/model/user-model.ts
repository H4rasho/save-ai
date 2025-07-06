import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
	id: integer("id").primaryKey(),
	email: text("email").notNull().unique(),
	name: text("name").notNull(),
	currency: text("currency").notNull(),
});
