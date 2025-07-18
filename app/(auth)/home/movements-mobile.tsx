import type { MovementWithCategoryAndMovementType } from "@/app/core/movements/types/movement-type";
import { cn } from "@/lib/utils";

interface MovementsMobileProps {
	data: MovementWithCategoryAndMovementType[];
	totalExpenses: number;
	totalIncome: number;
}

export default function MovementsMgbile({
	data,
	totalExpenses,
	totalIncome,
}: MovementsMobileProps) {
	return (
		<section className="block sm:hidden  bg-card py-12 px-4 rounded-t-2xl">
			<h2 className="font-bold mb-4">Last movements</h2>
			<div className="flex justify-between text-muted-foreground text-sm py-4">
				<div>
					<p className="font-bold">Total Expenses</p>
					<p>
						{totalExpenses.toLocaleString("es-CL", {
							style: "currency",
							currency: "CLP",
						})}
					</p>
				</div>
				<div>
					<p className="font-bold">Total Income</p>
					<p className=" text-right">
						{totalIncome.toLocaleString("es-CL", {
							style: "currency",
							currency: "CLP",
						})}
					</p>
				</div>
			</div>
			{data.slice(0, 5).map((movement) => (
				<div key={movement.id} className="flex justify-between py-2">
					<div className="max-w-1/2">
						<p className="text-sm font-semibold capitalize">{movement.name}</p>
						<p className="text-xs capitalize">{movement.category_name}</p>
					</div>
					<p
						className={cn(
							"text-xs font-semibold self-end",
							movement.movement_type_name === "expense"
								? "text-red-500"
								: "text-green-500",
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
			))}
		</section>
	);
}
