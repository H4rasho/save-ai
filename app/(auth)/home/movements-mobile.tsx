import type { MovementWithCategoryAndMovementType } from "@/app/core/movements/types/movement-type";
import { cn } from "@/lib/utils";
import { ArrowDownCircle, ArrowUpCircle, Calendar, Tag } from "lucide-react";

interface MovementsMobileProps {
	data: MovementWithCategoryAndMovementType[];
}

export default function MovementsMobile({ data }: MovementsMobileProps) {
	return (
		<section className="block sm:hidden bg-gradient-to-b from-card to-card/50 py-6 px-4 rounded-t-3xl border-t border-border/50 shadow-lg">
			{/* Lista de movimientos mejorada */}
			<div className="space-y-3">
				<div className="flex items-center gap-2 mb-4">
					<Calendar className="w-4 h-4 text-muted-foreground" />
					<h3 className="text-sm font-semibold text-foreground">
						Últimos Movimientos
					</h3>
				</div>

				{data.slice(0, 5).map((movement) => (
					<div
						key={movement.id}
						className="bg-secondary-subtle dark:bg-secondary-dark p-4 rounded-xl border border-secondary/30 shadow-sm"
					>
						<div className="flex justify-between items-start">
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2 mb-1">
									<Tag className="w-3 h-3 text-muted-foreground flex-shrink-0" />
									<p className="text-sm font-semibold text-foreground capitalize truncate">
										{movement.name}
									</p>
								</div>
								<p className="text-xs text-muted-foreground capitalize bg-muted px-2 py-1 rounded-md inline-block">
									{movement.category_name}
								</p>
							</div>

							<div className="flex items-center gap-2 ml-3">
								{movement.movement_type_name === "expense" ? (
									<ArrowDownCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
								) : (
									<ArrowUpCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
								)}
								<p
									className={cn(
										"text-sm font-bold",
										movement.movement_type_name === "expense"
											? "text-red-600 dark:text-red-400"
											: "text-green-600 dark:text-green-400",
									)}
								>
									<span className="text-xs">
										{movement.movement_type_name === "expense" ? "-" : "+"}
									</span>
									{movement.amount.toLocaleString("es-CL", {
										style: "currency",
										currency: "CLP",
									})}
								</p>
							</div>
						</div>
					</div>
				))}

				{data.length === 0 && (
					<div className="text-center py-8">
						<Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
						<p className="text-muted-foreground text-sm">
							No hay movimientos recientes
						</p>
					</div>
				)}
			</div>
		</section>
	);
}
