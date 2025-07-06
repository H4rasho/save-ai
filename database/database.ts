import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

export const client = createClient({
	url: "file:local.db",
});

export const db = drizzle(client);

client.execute({
	sql: "CREATE TABLE IF NOT EXISTS expenses (id INTEGER PRIMARY KEY AUTOINCREMENT, amount REAL, category TEXT, currency TEXT)",
});
