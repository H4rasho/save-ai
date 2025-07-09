"use client";

import { Button } from "@/components/ui/button";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FileText, X } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";
import { addMovmentsFromFileAction } from "../actions/movments-actions";

export function ReadFileModalButton() {
	const [isOpen, setIsOpen] = useState(false);
	const modalRef = useRef<HTMLDivElement>(null);

	// Cerrar al hacer click fuera del modal
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				isOpen &&
				modalRef.current &&
				!modalRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		}
		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	// Evitar scroll del fondo cuando el modal está abierto
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);

	return (
		<>
			<button
				type="button"
				aria-label="Leer Archivo"
				onClick={() => setIsOpen(true)}
				className="flex flex-col items-center justify-center"
			>
				<FileText
					size={28}
					className="mx-auto text-zinc-500 hover:text-blue-500 transition-colors"
				/>
			</button>
			{isOpen && (
				<div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
					<div
						ref={modalRef}
						className="w-full max-w-md mx-auto rounded-t-2xl bg-card p-6 shadow-lg animate-slideUp relative"
						style={{
							animation: "slideUp 0.3s cubic-bezier(0.4,0,0.2,1)",
						}}
					>
						<button
							aria-label="Cerrar"
							onClick={() => setIsOpen(false)}
							className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
							type="button"
						>
							<X size={28} />
						</button>
						<h2 className="text-lg font-semibold mb-4">Subir archivo</h2>
						<FileUploadForm />
					</div>
					<style jsx global>{`
            @keyframes slideUp {
              from {
                transform: translateY(100%);
              }
              to {
                transform: translateY(0);
              }
            }
          `}</style>
				</div>
			)}
		</>
	);
}

function FileUploadForm() {
	const [_, formAction, isPending] = useActionState(
		//@ts-ignore
		addMovmentsFromFileAction,
		{
			message: "",
		},
	);

	return (
		<form action={formAction} className="space-y-4">
			<label htmlFor="file">Selecciona un archivo</label>
			<Input name="file" id="file" type="file" />
			<Button type="submit" className="w-full">
				{isPending ? "Loading..." : "Upload"}
			</Button>
		</form>
	);
}
