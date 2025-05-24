import { useState } from "react";
import { Category, CreateExpense, CreateIncome } from "@/types/income";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

interface AddMovementFormProps {
  categories: Category[];
}

enum MovementType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
}

export function AddMovementForm({ categories }: AddMovementFormProps) {
  const [movementType, setMovementType] = useState<MovementType>(MovementType.EXPENSE);

  return (
    <section>
      <h3 className="text-lg font-bold mb-4 text-center">
        {movementType === MovementType.EXPENSE ? "Agregar Gasto" : "Agregar Ingreso"}
      </h3>
      <div className="flex justify-center gap-2 mb-4">
        <Button
          type="button"
          variant={movementType === MovementType.EXPENSE ? "default" : "outline"}
          onClick={() => setMovementType(MovementType.EXPENSE)}
        >
          Gasto
        </Button>
        <Button
          type="button"
          variant={movementType === MovementType.INCOME ? "default" : "outline"}
          onClick={() => setMovementType(MovementType.INCOME)}
        >
          Ingreso
        </Button>
      </div>
      <form className="space-y-4">
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
