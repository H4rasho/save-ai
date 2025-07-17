"use client";

import { addExpensesFromFile } from "@/actions/add-expense";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useActionState } from "react";

export const AddExpenseFromFile = () => {
	const [_form, formAction, isPending] = useActionState(
		//@ts-ignore
		addExpensesFromFile,
		null,
	);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="default">
					<Upload />
					Add Expense from File
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Expense from File</DialogTitle>
					<DialogDescription>
						Upload a PDF file to extract expenses.
					</DialogDescription>
				</DialogHeader>
				<form action={formAction}>
					<Label>Upload PDF:</Label>
					<Input type="file" name="file" accept="application/pdf" />
				</form>
				<DialogFooter>
					<Button type="submit" disabled={isPending}>
						{isPending ? "Cargando..." : "Subir PDF"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
