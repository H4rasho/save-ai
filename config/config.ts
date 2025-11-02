const { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } = process.env;

export const CONFIG = {
	DATABASE_URL: TURSO_DATABASE_URL ?? "",
	DATABASE_AUTH_TOKEN: TURSO_AUTH_TOKEN ?? "",
	APP_NAME: "SmartSaver",
} as const;
