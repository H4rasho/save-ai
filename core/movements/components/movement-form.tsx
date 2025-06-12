import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createMovmentAction } from "@/core/movements/actions/movments-actions";
import { type Category, CreateExpense, CreateIncome } from "@/types/income";
import { useActionState, useState } from "react";
import { MovementType } from "../types/movement-type";

interface AddMovementFormProps {
	categories: Category[];
}

const initialState = {
	amount: "",
	category: "",
	description: "",
};

export function AddMovementForm({ categories }: AddMovementFormProps) {
	const [movementType, setMovementType] = useState<MovementType>(
		MovementType.EXPENSE,
	);
	const [_, formAction, isPending] = useActionState(createMovmentAction, null);

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
							<Label htmlFor="category">Categoría</Label>
							<select
								id="category"
								name="category"
								required
								className="w-full border rounded px-3 py-2"
								defaultValue=""
							>
								<option value="" disabled>
									Selecciona una categoría
								</option>
								{categories?.map((cat) => (
									<option key={cat.id} value={cat.id}>
										{cat.name}
									</option>
								))}
							</select>
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
