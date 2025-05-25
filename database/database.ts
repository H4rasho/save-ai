import { createClient } from "@libsql/client";

export const client = createClient({
	url: "file:local.db",
});

client.execute({
	sql: "CREATE TABLE IF NOT EXISTS expenses (id INTEGER PRIMARY KEY AUTOINCREMENT, amount REAL, category TEXT, currency TEXT)",
});
