"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Edit, MoreVertical, RefreshCw, Tag, Trash2 } from "lucide-react";
import {
	MovementType,
	type MovementWithCategoryAndMovementType,
} from "../types/movement-type";

interface FinancialMovementsListProps {
	movements: MovementWithCategoryAndMovementType[];
	onEdit?: (movement: MovementWithCategoryAndMovementType) => void;
	onDelete?: (movementId: number) => void;
	onConvertToFixed?: (movementId: number) => void;
}

export default function FinancialMovementsList({
	movements,
	onEdit,
	onDelete,
	onConvertToFixed,
}: FinancialMovementsListProps) {
	const formatAmount = (amount: number) => {
		return new Intl.NumberFormat("es-ES", {
			style: "currency",
			currency: "EUR",
		}).format(Math.abs(amount));
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("es-ES", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		});
	};

	const getAmountColor = (typeName: string) => {
		return typeName.toUpperCase() === MovementType.INCOME
			? "text-green-500 dark:text-green-400 font-semibold"
			: "text-red-500 dark:text-red-400 font-semibold";
	};

	const isFixedExpense = (typeName: string) => {
		return typeName.toUpperCase() === MovementType.FIXED_EXPENSE;
	};

	if (movements.length === 0) {
		return (
			<div className="text-center py-12">
				<div className="text-muted-foreground">
					No hay movimientos registrados
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-0">
			{movements.map((movement, index) => (
				<div key={movement.id}>
					<div className="py-4 px-1 hover:bg-muted/50 transition-colors rounded-lg">
						{/* Layout para Desktop */}
						<div className="hidden sm:flex items-center justify-between">
							<div className="flex items-center space-x-3 flex-1">
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2 mb-1">
										<h3 className="font-medium text-sm truncate text-foreground">
											esta
										</h3>
										{movement.is_recurring && (
											<RefreshCw className="h-3 w-3 text-muted-foreground" />
										)}
										{isFixedExpense(movement.movement_type_name) && (
											<Badge
												variant="outline"
												className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800"
											>
												Fijo
											</Badge>
										)}
									</div>

									<div className="flex items-center gap-2 text-xs text-muted-foreground">
										<span>{formatDate(movement.created_at)}</span>
										{movement.category_name && (
											<>
												<span>•</span>
												<div className="flex items-center gap-1">
													<Tag className="h-3 w-3" />
													<span>{movement.category_name}</span>
												</div>
											</>
										)}
									</div>
								</div>
							</div>

							<div className="flex items-center gap-3">
								<div
									className={`text-lg font-semibold ${getAmountColor(movement.movement_type_name)}`}
								>
									{movement.movement_type_name.toUpperCase() ===
									MovementType.INCOME
										? "+"
										: "-"}
									{formatAmount(movement.amount)}
								</div>

								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="ghost"
											size="sm"
											className="size-8 p-0 hover:bg-muted"
										>
											<MoreVertical className="size-4" />
											<span className="sr-only">Abrir menú</span>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end" className="w-48">
										<DropdownMenuItem
											onClick={() => onEdit?.(movement)}
											className="cursor-pointer"
										>
											<Edit className="mr-2 h-4 w-4" />
											Editar
										</DropdownMenuItem>

										{!isFixedExpense(movement.movement_type_name) && (
											<DropdownMenuItem
												onClick={() => onConvertToFixed?.(movement.id)}
												className="cursor-pointer"
											>
												<RefreshCw className="mr-2 h-4 w-4" />
												Convertir a gasto fijo
											</DropdownMenuItem>
										)}

										<DropdownMenuSeparator />

										<DropdownMenuItem
											onClick={() => onDelete?.(movement.id)}
											className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
										>
											<Trash2 className="mr-2 h-4 w-4" />
											Eliminar
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</div>

						{/* Layout optimizado para Mobile */}
						<div className="sm:hidden">
							{/* Header con nombre, badges y monto */}
							<div className="flex items-start justify-between mb-2">
								<div className="flex-1 min-w-0 pr-3">
									<div className="flex items-center gap-2 mb-1">
										<h3 className="font-medium text-sm leading-tight truncate text-foreground">
											{movement.name}
										</h3>
										{movement.is_recurring && (
											<RefreshCw className="h-3 w-3 text-muted-foreground flex-shrink-0" />
										)}
										{isFixedExpense(movement.movement_type_name) && (
											<Badge
												variant="outline"
												className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800 flex-shrink-0"
											>
												Fijo
											</Badge>
										)}
									</div>
								</div>

								<div className="flex items-center gap-2 flex-shrink-0">
									<div
										className={`text-lg font-semibold ${getAmountColor(movement.movement_type_name)}`}
									>
										{movement.movement_type_name.toUpperCase() ===
										MovementType.INCOME
											? "+"
											: "-"}
										{formatAmount(movement.amount)}
									</div>

									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant="ghost"
												size="sm"
												className="h-8 w-8 p-0 flex-shrink-0 hover:bg-muted"
											>
												<MoreVertical className="h-4 w-4" />
												<span className="sr-only">Abrir menú</span>
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end" className="w-48">
											<DropdownMenuItem
												onClick={() => onEdit?.(movement)}
												className="cursor-pointer py-3"
											>
												<Edit className="mr-2 h-4 w-4" />
												Editar
											</DropdownMenuItem>

											{!isFixedExpense(movement.movement_type_name) && (
												<DropdownMenuItem
													onClick={() => onConvertToFixed?.(movement.id)}
													className="cursor-pointer py-3"
												>
													<RefreshCw className="mr-2 h-4 w-4" />
													Convertir a gasto fijo
												</DropdownMenuItem>
											)}

											<DropdownMenuSeparator />

											<DropdownMenuItem
												onClick={() => onDelete?.(movement.id)}
												className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 py-3"
											>
												<Trash2 className="mr-2 h-4 w-4" />
												Eliminar
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</div>

							{/* Información adicional simplificada */}
							<div className="flex items-center gap-2 text-xs text-muted-foreground">
								<span>{formatDate(movement.created_at)}</span>
								{movement.category_name && (
									<>
										<span>•</span>
										<div className="flex items-center gap-1">
											<Tag className="h-3 w-3" />
											<span className="truncate max-w-[120px]">
												{movement.category_name}
											</span>
										</div>
									</>
								)}
							</div>
						</div>
					</div>

					{/* Separador - no mostrar después del último elemento */}
					{index < movements.length - 1 && <Separator className="opacity-50" />}
				</div>
			))}
		</div>
	);
}
