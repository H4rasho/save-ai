export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getMovmentsAction } from "@/app/core/movements/actions/movments-actions";
import FinancialMovementsList from "@/app/core/movements/components/mobile-list";
import {
	getUserCurrency,
	getUserId,
} from "@/app/core/user/actions/user-actions";
import { ArrowLeftRight, List } from "lucide-react";

export default async function Movements() {
	const userId = await getUserId();
	const movements = await getMovmentsAction(userId);
	const userCurrency = await getUserCurrency();

	return (
		<main className="flex flex-col min-h-screen max-w-md mx-auto py-6 md:hidden">
			{/* Header mejorado */}
			<div className="mb-8">
				<div className="flex items-center gap-3 mb-3">
					<div className="p-2 bg-primary/10 rounded-lg">
						<ArrowLeftRight className="w-6 h-6 text-primary" />
					</div>
					<div>
						<h1 className="text-2xl font-bold text-foreground">Movimientos</h1>
						<p className="text-muted-foreground text-sm">
							Historial completo de transacciones
						</p>
					</div>
				</div>
			</div>

			{/* Estadísticas rápidas */}
			<div className="mb-3">
				<div className="bg-secondary p-4 rounded-xl border border-secondary-dark/20 shadow-sm">
					<div className="flex justify-between items-start">
						<div className="flex-1 min-w-0 pr-3">
							<div className="flex items-center gap-2 mb-2">
								<List className="w-4 h-4 text-secondary-foreground/70 flex-shrink-0" />
								<h3 className="font-semibold text-secondary-foreground text-sm truncate">
									Total de movimientos
								</h3>
							</div>
						</div>
						<div className="flex items-center gap-2 flex-shrink-0">
							<div className="text-sm font-bold text-secondary-foreground">
								{movements.length.toLocaleString()}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Lista de movimientos */}
			<FinancialMovementsList
				movements={movements}
				userCurrency={userCurrency}
				showActions={true}
			/>
		</main>
	);
}
