import {
	getBalanceAction,
	getMovmentsAction,
	getTotalsByTypeAction,
} from "@/app/core/movements/actions/movments-actions";
import { Scale } from "lucide-react";
import { unstable_cache } from "next/cache";
import { getUserId } from "../core/user/actions/user-actions";
import { ChatAgentCard } from "./ChatAgentCard";
import MovementsMobile from "./movements-mobile";
import SummaryCard from "./summary-card";

export default async function Home() {
	const userId = await getUserId();
	const getAllMovementsCached = unstable_cache(
		async (userId: string) => getMovmentsAction(userId),
		["movements-list"],
		{
			tags: ["movements"],
			revalidate: 60,
		},
	);
	const movements = await getAllMovementsCached(userId);
	const { total_expenses, total_income } = await getTotalsByTypeAction();
	const balance = await getBalanceAction();

	return (
		<main className="flex flex-col min-h-screen max-w-6xl mx-auto py-10">
			<section>
				<h1 className="text-md font-bold mb-4 px-4">
					Hola Thomas, como va todo
				</h1>
			</section>
			<section className="flex-grow">
				<h2 className="text-xl font-bold mb-4 px-4">Summary</h2>
				<div className="flex gap-4">
					<SummaryCard
						amount={balance}
						title="Total Balance"
						icon={<Scale size={48} strokeWidth={2} />}
					/>
				</div>
			</section>
			<section className="px-4 py-4">
				<ChatAgentCard />
			</section>
			<section>
				<MovementsMobile
					data={movements}
					totalExpenses={total_expenses}
					totalIncome={total_income}
				/>
			</section>
		</main>
	);
}
