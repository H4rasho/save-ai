export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getMovmentsAction } from "@/app/core/movements/actions/movments-actions";
import MovementsMobileList from "@/app/core/movements/components/mobile-list";
import {
	getUserCurrency,
	getUserId,
} from "@/app/core/user/actions/user-actions";

export default async function Movements() {
	const userId = await getUserId();
	const movements = await getMovmentsAction(userId);
	const userCurrency = await getUserCurrency();
	return (
		<main className="flex flex-col min-h-screen max-w-md mx-auto py-4 px-2 md:hidden">
			<h1 className="text-md font-bold mb-4">Movements</h1>
			<MovementsMobileList movements={movements} userCurrency={userCurrency} />
		</main>
	);
}
