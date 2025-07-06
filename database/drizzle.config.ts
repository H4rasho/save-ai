import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
	schema: "./core/**/model/*.ts",
	out: "./database/migrations",
	dialect: "turso",
	dbCredentials: {
		url: process.env.TURSO_DATABASE_URL || "",
		authToken: process.env.TURSO_AUTH_TOKEN || "",
	},
} satisfies Config;
