import { users } from "@/core/user/model/user-model";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const categories = sqliteTable("categories", {
	id: integer("id").primaryKey(),
	user_id: integer("user_id").references(() => users.id),
	name: text("name").notNull(),
});
