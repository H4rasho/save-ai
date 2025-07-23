"use client";

import { AddMovementForm } from "@/app/core/movements/components/movement-form";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import type { Category } from "@/types/income";
import { Plus } from "lucide-react";

interface AddMovementProps {
	categories: Category[];
}

export function AddMovement({ categories }: AddMovementProps) {
	return (
		<>
			<Dialog>
				<DialogTrigger asChild>
					<button type="button" aria-label="Agregar Gasto" className="relative">
						<span className="flex items-center justify-center rounded-full bg-primary text-secondary shadow-lg border-4 border-white dark:border-zinc-900 w-16 h-16 transition-transform hover:scale-110">
							<Plus size={36} />
						</span>
					</button>
				</DialogTrigger>
				<DialogContent className="max-w-lg fixed top-auto bottom-0 left-0 right-0 translate-x-0 translate-y-0 rounded-t-2xl rounded-b-none max-h-[90vh] w-full data-[state=open]:!animate-fade-in-up">
					<DialogTitle>Agregar nuevo movimiento</DialogTitle>
					<DialogDescription>
						Añade un nuevo movimiento a tu cuenta
					</DialogDescription>
					<AddMovementForm categories={categories} />
				</DialogContent>
			</Dialog>
		</>
	);
}
