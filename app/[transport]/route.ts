import { getUserCategoriesAction } from "@/app/core/categories/actions/categories-actions";
import { getMovementTypes } from "@/app/core/movement-types.ts/repository/movement-type-repository";
import {
	getAllMovements,
	getCurrentMonthMovements,
} from "@/app/core/movements/repository/movements-repository";
import { CreateMovementSchema } from "@/app/core/movements/types/movement-type";
import { verifyClerkToken } from "@clerk/mcp-tools/next";
import { auth, clerkClient } from "@clerk/nextjs/server";
import {
	createMcpHandler,
	experimental_withMcpAuth as withMcpAuth,
} from "@vercel/mcp-adapter";

const clerk = await clerkClient();

const handler = createMcpHandler((server) => {
	server.tool(
		"get-clerk-user-data",
		"Gets data about the Clerk user that authorized this request",
		{}, // tool parameters here if present
		async (_, context) => {
			// Try to read user id from authInfo; fallback to Clerk auth() if missing
			let userId = context?.authInfo?.extra?.userId as string | undefined;
			if (!userId) {
				const clerkAuth = await auth({ acceptsToken: "oauth_token" });
				userId = clerkAuth?.userId ?? undefined;
			}

			if (!userId) {
				return {
					content: [{ type: "text", text: "Unauthorized: missing user id" }],
				};
			}
			const userData = await clerk.users.getUser(userId);

			return {
				content: [{ type: "text", text: JSON.stringify(userData) }],
			};
		},
	);

	server.tool(
		"get-current-month-movements",
		"Gets all expenses and incomes movements of the current month for the user",
		{},
		async (_, context) => {
			let userId = context?.authInfo?.extra?.userId as string | undefined;
			if (!userId) {
				const clerkAuth = await auth({ acceptsToken: "oauth_token" });
				userId = clerkAuth?.userId ?? undefined;
			}
			if (!userId) {
				return {
					content: [{ type: "text", text: "Unauthorized: missing user id" }],
				};
			}
			const movements = await getCurrentMonthMovements(userId);
			return {
				content: [{ type: "text", text: JSON.stringify(movements) }],
			};
		},
	);

	server.tool(
		"get-all-movements",
		"Gets all historical expenses and incomes movements of the user",
		{},
		async (_, context) => {
			let userId = context?.authInfo?.extra?.userId as string | undefined;
			if (!userId) {
				const clerkAuth = await auth({ acceptsToken: "oauth_token" });
				userId = clerkAuth?.userId ?? undefined;
			}
			if (!userId) {
				return {
					content: [{ type: "text", text: "Unauthorized: missing user id" }],
				};
			}
			const movements = await getAllMovements(userId);
			return {
				content: [{ type: "text", text: JSON.stringify(movements) }],
			};
		},
	);

	server.tool(
		"get-user-categories",
		"Gets all categories of the user",
		{},
		async (_, context) => {
			let userId = context?.authInfo?.extra?.userId as string | undefined;
			if (!userId) {
				const clerkAuth = await auth({ acceptsToken: "oauth_token" });
				userId = clerkAuth?.userId ?? undefined;
			}
			if (!userId) {
				return {
					content: [{ type: "text", text: "Unauthorized: missing user id" }],
				};
			}
			const categories = await getUserCategoriesAction(userId);
			return {
				content: [{ type: "text", text: JSON.stringify(categories) }],
			};
		},
	);

	server.tool(
		"get-movement-types",
		"Gets all available movement types",
		{},
		async () => {
			try {
				const movementTypes = await getMovementTypes();
				return {
					content: [{ type: "text", text: JSON.stringify(movementTypes) }],
				};
			} catch (error) {
				console.error(error);
				return {
					content: [{ type: "text", text: "Error getting movement types" }],
				};
			}
		},
	);

	server.tool(
		"create-movement",
		"Creates a movement for the authorized user",
		{
			movement: CreateMovementSchema,
		},
		async (params, context) => {
			try {
				let userId = context?.authInfo?.extra?.userId as string | undefined;
				if (!userId) {
					const clerkAuth = await auth({ acceptsToken: "oauth_token" });
					userId = clerkAuth?.userId ?? undefined;
				}
				if (!userId) {
					return {
						content: [{ type: "text", text: "Unauthorized: missing user id" }],
					};
				}
				return {
					content: [{ type: "text", text: JSON.stringify(params) }],
				};
			} catch (error) {
				console.error(error);
				return {
					content: [{ type: "text", text: "Error creating movement" }],
				};
			}
		},
	);
});

const authHandler = withMcpAuth(
	handler,
	async (_, token) => {
		const clerkAuth = await auth({ acceptsToken: "oauth_token" });
		// Note: OAuth tokens are machine tokens. Machine token usage is free
		// during our public beta period but will be subject to pricing once
		// generally available. Pricing is expected to be competitive and below
		// market averages.
		return verifyClerkToken(clerkAuth, token);
	},
	{
		required: true,
		resourceMetadataPath: "/.well-known/oauth-protected-resource/mcp",
	},
);

export { authHandler as GET, authHandler as POST };
