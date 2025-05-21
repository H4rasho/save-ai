'use client'

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {addExpense} from '@/actions/add-expense'
import {useActionState} from 'react'
import {CreateExpense} from '@/types/income'
import {Plus} from 'lucide-react'

interface AddExpenseDialogProps {
  categories: {
    id: number
    name: string
  }[]
}

export function AddExpenseDialog({categories}: AddExpenseDialogProps) {
  const [, formAction, isPending] = useActionState(addExpense, {
    message: '',
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">
          <Plus />
          Agregar Gasto
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar Gasto</DialogTitle>
          <DialogDescription>
            Completa los datos del nuevo gasto.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
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
            >
              <option value="" disabled defaultValue={categories[0].id}>
                Selecciona una categoría
              </option>
              {categories?.map(cat => (
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
          <DialogFooter>
            <p>{isPending ? 'Guardando...' : 'Guardar'}</p>
            <Button type="submit">Guardar</Button>
            <DialogClose asChild>
              <Button type="button" variant="secondary" id="close-dialog-btn">
                Cancelar
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
