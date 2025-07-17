"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useMemo, useState } from "react";
import type { CreateMovement } from "../types/movement-type";
import { MovementMobileCard } from "./movement-mobile-card";

interface MovementsPreviewModalProps {
	open: boolean;
	movements: CreateMovement[];
	onCancel: () => void;
	onConfirm: (movements: CreateMovement[]) => void;
}

export function MovementsPreviewModal({
	open,
	movements,
	onCancel,
	onConfirm,
}: MovementsPreviewModalProps) {
	const [editedMovements, setEditedMovements] =
		useState<CreateMovement[]>(movements);
	const [editingIdx, setEditingIdx] = useState<number | null>(null);
	const [editDraft, setEditDraft] = useState<CreateMovement | null>(null);

	useEffect(() => {
		setEditedMovements(movements);
		setEditingIdx(null);
		setEditDraft(null);
	}, [movements]);

	const handleFieldChange = (
		field: keyof CreateMovement,
		value: string | number,
	) => {
		if (editDraft) {
			setEditDraft({ ...editDraft, [field]: value });
		}
	};

	const handleEdit = (idx: number) => {
		setEditingIdx(idx);
		setEditDraft({ ...editedMovements[idx] });
	};

	const handleSave = () => {
		if (editingIdx !== null && editDraft) {
			setEditedMovements((prev) =>
				prev.map((mov, i) => (i === editingIdx ? editDraft : mov)),
			);
			setEditingIdx(null);
			setEditDraft(null);
		}
	};

	const handleCancel = () => {
		setEditingIdx(null);
		setEditDraft(null);
	};

	const handleDelete = (idx: number) => {
		setEditedMovements((prev) => prev.filter((_, i) => i !== idx));
		if (editingIdx === idx) {
			setEditingIdx(null);
			setEditDraft(null);
		}
	};

	const movementsWithUuid = useMemo(() => {
		return editedMovements.map((mov) => {
			return { ...mov, _uuid: crypto.randomUUID() };
		});
	}, [editedMovements]);

	return (
		<Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
			<DialogContent className="max-w-md w-full">
				<DialogHeader>
					<DialogTitle>Previsualizar movimientos</DialogTitle>
				</DialogHeader>
				<div className="space-y-4 max-h-[60vh] overflow-y-auto">
					{editedMovements.length === 0 && (
						<div className="text-center text-zinc-500 py-8">
							No hay movimientos para mostrar.
						</div>
					)}
					{movementsWithUuid.map((mov, idx) => (
						<MovementMobileCard
							key={mov._uuid}
							movement={editingIdx === idx && editDraft ? editDraft : mov}
							isEditing={editingIdx === idx}
							onEdit={() => handleEdit(idx)}
							onDelete={() => handleDelete(idx)}
							onChange={handleFieldChange}
							onSave={handleSave}
							onCancel={handleCancel}
						/>
					))}
				</div>
				<DialogFooter className="mt-4 flex gap-2">
					<Button variant="outline" type="button" onClick={onCancel}>
						Cancelar
					</Button>
					<Button
						type="button"
						onClick={() => onConfirm(editedMovements)}
						disabled={editedMovements.length === 0}
					>
						Confirmar y guardar
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
