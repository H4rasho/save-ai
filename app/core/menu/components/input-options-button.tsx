"use client";

import { CreateMovementFromAudio } from "@/app/core/movements/components/create-movement-from-audio";
import { ReadFileModalButton } from "@/app/core/movements/components/read-file-modal-button";
import { Upload } from "lucide-react";
import { useState } from "react";

export function InputOptionsButton() {
	const [showOptions, setShowOptions] = useState(false);

	return (
		<div className="relative">
			<button
				type="button"
				onClick={() => setShowOptions(!showOptions)}
				className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-secondary/50 transition-all duration-200 group w-full"
				aria-label="Opciones de entrada"
			>
				<Upload
					size={20}
					className="text-foreground/70 group-hover:text-primary transition-colors duration-200"
				/>
				<span className="text-xs text-foreground/60 group-hover:text-primary font-medium mt-1">
					Importar
				</span>
			</button>

			{/* Modal flotante con opciones */}
			{showOptions && (
				<div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-card border border-border rounded-lg shadow-lg p-2 min-w-max z-[60]">
					<div className="space-y-2">
						<div className="flex flex-col items-center p-2">
							<ReadFileModalButton />
							<span className="text-xs text-foreground/60 font-medium mt-1">
								Archivo
							</span>
						</div>
						<div className="border-t border-border pt-2">
							<div className="flex flex-col items-center p-2">
								<CreateMovementFromAudio />
								<span className="text-xs text-foreground/60 font-medium mt-1">
									Audio
								</span>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Overlay para cerrar al hacer click fuera */}
			{showOptions && (
				<div
					className="fixed inset-0 z-[55]"
					onClick={() => setShowOptions(false)}
					onKeyDown={(e) => {
						if (e.key === "Escape") {
							setShowOptions(false);
						}
					}}
					role="button"
					tabIndex={0}
				/>
			)}
		</div>
	);
}
