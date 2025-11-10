"use client";

import { AddMovementForm } from "@/app/core/movements/components/movement-form";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import type { Category } from "@/types/income";
import { Plus } from "lucide-react";
import { useState } from "react";

interface AddMovementProps {
	categories: Category[];
}

export function AddMovement({ categories }: AddMovementProps) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button
						variant="default"
						className="rounded-full w-14 h-14 relative p-0"
						type="button"
						aria-label="Agregar Gasto"
					>
						<Plus size={24} className="size-6" />
					</Button>
				</DialogTrigger>
				<DialogContent className="max-w-lg fixed top-auto bottom-0 left-0 right-0 translate-x-0 translate-y-0 rounded-t-2xl rounded-b-none max-h-[90vh] w-full data-[state=open]:!animate-fade-in-up">
					<DialogTitle>Agregar nuevo movimiento</DialogTitle>
					<DialogDescription>
						Añade un nuevo movimiento a tu cuenta
					</DialogDescription>
					<AddMovementForm
						categories={categories}
						onSuccess={() => setOpen(false)}
					/>
				</DialogContent>
			</Dialog>
		</>
	);
}
