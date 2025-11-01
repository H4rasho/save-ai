"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectCombobox } from "@/components/ui/select-combobox";
import type { Category } from "@/types/income";
import { useActionState, useEffect, useMemo, useState } from "react";
import { updateMovementAction } from "../actions/movments-actions";
import type { MovementWithCategoryAndMovementType } from "../types/movement-type";

interface EditMovementDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	movement: MovementWithCategoryAndMovementType | null;
	categories: Category[];
}

export function EditMovementDialog({
	open,
	onOpenChange,
	movement,
	categories,
}: EditMovementDialogProps) {
	const [selectedCategory, setSelectedCategory] = useState<string>("");
	const [state, formAction, _isPending] = useActionState(
		updateMovementAction,
		null,
	);

	useEffect(() => {
		if (movement) {
			setSelectedCategory(String(movement.category_id ?? ""));
		}
	}, [movement]);

	useEffect(() => {
		if (state?.success) {
			onOpenChange(false);
		}
	}, [state, onOpenChange]);

	const categoryOptions = useMemo(
		() => categories.map((cat) => ({ label: cat.name, value: String(cat.id) })),
		[categories],
	);

	if (!movement) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-lg fixed top-auto bottom-0 left-0 right-0 translate-x-0 translate-y-0 rounded-t-2xl rounded-b-none max-h-[90vh] w-full data-[state=open]:!animate-fade-in-up">
				<DialogHeader>
					<DialogTitle>Editar movimiento</DialogTitle>
					<DialogDescription>
						Actualiza los datos del movimiento seleccionado
					</DialogDescription>
				</DialogHeader>
				<form action={formAction} className="space-y-4">
					<input type="hidden" name="id" value={movement.id} />
					<div>
						<Label htmlFor="name">Nombre</Label>
						<Input
							id="name"
							name="name"
							defaultValue={movement.name}
							required
						/>
					</div>
					<div>
						<Label htmlFor="amount">Monto</Label>
						<Input
							id="amount"
							name="amount"
							type="number"
							defaultValue={movement.amount}
							required
						/>
					</div>
					<div>
						<SelectCombobox
							label="Categoría"
							options={categoryOptions}
							value={selectedCategory}
							onChange={setSelectedCategory}
							placeholder="Selecciona una categoría"
							name="category_id"
							required
						/>
					</div>
					<div>
						<Label htmlFor="transaction_date">Fecha</Label>
						<Input
							id="transaction_date"
							name="transaction_date"
							type="date"
							defaultValue={(movement.transaction_date ?? "").slice(0, 10)}
							required
						/>
					</div>
					<Button type="submit" className="w-full">
						Guardar cambios
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
