import { createMovmentAction } from "@/app/core/movements/actions/movments-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectCombobox } from "@/components/ui/select-combobox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Category } from "@/types/income";
import { useActionState, useState } from "react";
import { MovementType } from "../types/movement-type";

interface AddMovementFormProps {
	categories: Category[];
}

const _initialState = {
	amount: "",
	category: "",
	description: "",
};

export function AddMovementForm({ categories }: AddMovementFormProps) {
	const [movementType, setMovementType] = useState<MovementType>(
		MovementType.EXPENSE,
	);
	const [selectedCategory, setSelectedCategory] = useState<string>("");
	const [_open, _setOpen] = useState(false);
	const [_, formAction, _isPending] = useActionState(createMovmentAction, null);

	return (
		<section>
			<h3 className="text-lg font-bold mb-4 text-center">
				{movementType === MovementType.EXPENSE
					? "Agregar Gasto"
					: "Agregar Ingreso"}
			</h3>
			<form className="space-y-4" action={formAction}>
				{/* Tabs para seleccionar tipo de movimiento */}
				<div className="flex justify-center mb-4">
					<Tabs
						value={movementType}
						onValueChange={(val) => setMovementType(val as MovementType)}
					>
						<TabsList>
							<TabsTrigger value={MovementType.EXPENSE}>Gasto</TabsTrigger>
							<TabsTrigger value={MovementType.INCOME}>Ingreso</TabsTrigger>
						</TabsList>
					</Tabs>
					<input type="hidden" name="movementType" value={movementType} />
				</div>
				{movementType === MovementType.EXPENSE ? (
					<>
						<div>
							<Label htmlFor="description">Descripción</Label>
							<Input id="description" name="description" required />
						</div>
						<div>
							<Label htmlFor="amount">Monto</Label>
							<Input id="amount" name="amount" type="number" required />
						</div>
						<div>
							<SelectCombobox
								label="Categoría"
								options={categories.map((cat) => ({
									label: cat.name,
									value: String(cat.id),
								}))}
								value={selectedCategory}
								onChange={setSelectedCategory}
								placeholder="Selecciona una categoría"
								name="category"
								required
							/>
						</div>
						<div>
							<Label htmlFor="date">Fecha</Label>
							<Input id="date" name="date" type="date" required />
						</div>
					</>
				) : (
					<>
						<div>
							<Label htmlFor="name">Nombre</Label>
							<Input id="name" name="name" required />
						</div>
						<div>
							<Label htmlFor="amount">Monto</Label>
							<Input id="amount" name="amount" type="number" required />
						</div>
					</>
				)}
				<Button type="submit" className="w-full">
					Guardar
				</Button>
			</form>
		</section>
	);
}
