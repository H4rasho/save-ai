"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	getOpenAIKey,
	removeOpenAIKey,
	setOpenAIKey,
} from "@/lib/openai-client";
import { Eye, EyeOff, Key, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function OpenAISettings() {
	const [apiKey, setApiKey] = useState("");
	const [showApiKey, setShowApiKey] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [hasExistingKey, setHasExistingKey] = useState(false);

	useEffect(() => {
		// Cargar la API key del localStorage al montar el componente
		const storedKey = getOpenAIKey();
		if (storedKey) {
			setApiKey(storedKey);
			setHasExistingKey(true);
		}
	}, []);

	const handleSave = () => {
		if (!apiKey.trim()) {
			toast.error("Por favor, ingresa una API key válida");
			return;
		}

		if (!apiKey.startsWith("sk-")) {
			toast.warning(
				"La API key debería comenzar con 'sk-'. Verifica que sea correcta.",
			);
		}

		setIsSaving(true);
		try {
			setOpenAIKey(apiKey.trim());
			setHasExistingKey(true);
			toast.success("API key guardada correctamente en tu navegador");
		} catch (error) {
			toast.error("Error al guardar la API key");
			console.error(error);
		} finally {
			setIsSaving(false);
		}
	};

	const handleDelete = () => {
		try {
			removeOpenAIKey();
			setApiKey("");
			setHasExistingKey(false);
			toast.success("API key eliminada correctamente");
		} catch (error) {
			toast.error("Error al eliminar la API key");
			console.error(error);
		}
	};

	const handleTest = async () => {
		if (!apiKey.trim()) {
			toast.error("Por favor, guarda una API key primero");
			return;
		}

		toast.info("Probando conexión con OpenAI...");

		try {
			const response = await fetch("https://api.openai.com/v1/models", {
				headers: {
					Authorization: `Bearer ${apiKey.trim()}`,
				},
			});

			if (response.ok) {
				toast.success("✅ API key válida y funcionando correctamente");
			} else {
				const error = await response.json();
				toast.error(`❌ Error: ${error.error?.message || "API key inválida"}`);
			}
		} catch (error) {
			toast.error("Error al conectar con OpenAI");
			console.error(error);
		}
	};

	return (
		<div className="space-y-6">
			<div className="p-4 bg-warning/10 border border-warning/30 rounded-lg">
				<div className="flex items-start gap-3">
					<Key className="w-5 h-5 text-warning mt-0.5 shrink-0" />
					<div className="space-y-2 text-sm">
						<p className="font-semibold text-foreground">
							⚠️ Información de Seguridad
						</p>
						<ul className="text-muted-foreground space-y-1">
							<li>
								• Tu API key se guarda <strong>solo en tu navegador</strong>, no
								en nuestros servidores
							</li>
							<li>• La API key es personal y no debe compartirse con nadie</li>
							<li>
								• Si limpias los datos del navegador, deberás volver a
								ingresarla
							</li>
							<li>
								• Puedes obtener tu API key en:{" "}
								<a
									href="https://platform.openai.com/api-keys"
									target="_blank"
									rel="noopener noreferrer"
									className="text-primary hover:underline"
								>
									platform.openai.com/api-keys
								</a>
							</li>
						</ul>
					</div>
				</div>
			</div>

			<div className="space-y-3">
				<Label htmlFor="openai-key">API Key de OpenAI</Label>
				<div className="relative">
					<Input
						id="openai-key"
						type={showApiKey ? "text" : "password"}
						placeholder="sk-..."
						value={apiKey}
						onChange={(e) => setApiKey(e.target.value)}
						className="pr-10"
					/>
					<Button
						type="button"
						variant="ghost"
						size="sm"
						className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
						onClick={() => setShowApiKey(!showApiKey)}
					>
						{showApiKey ? (
							<EyeOff className="w-4 h-4" />
						) : (
							<Eye className="w-4 h-4" />
						)}
					</Button>
				</div>
				{hasExistingKey && (
					<p className="text-sm text-success flex items-center gap-2">
						<span className="w-2 h-2 bg-success rounded-full" />
						API key configurada
					</p>
				)}
			</div>

			<div className="flex flex-col sm:flex-row gap-2">
				<Button
					onClick={handleSave}
					disabled={isSaving || !apiKey.trim()}
					className="flex-1 sm:flex-none"
				>
					<Save className="w-4 h-4 mr-2" />
					{isSaving ? "Guardando..." : "Guardar API Key"}
				</Button>

				{hasExistingKey && (
					<>
						<Button
							onClick={handleTest}
							variant="outline"
							className="flex-1 sm:flex-none"
						>
							<Key className="w-4 h-4 mr-2" />
							Probar Conexión
						</Button>

						<Button
							onClick={handleDelete}
							variant="destructive"
							className="flex-1 sm:flex-none"
						>
							<Trash2 className="w-4 h-4 mr-2" />
							Eliminar
						</Button>
					</>
				)}
			</div>

			<div className="p-4 bg-muted/50 rounded-lg border border-border">
				<h4 className="font-semibold text-sm text-foreground mb-2">
					¿Para qué se usa la API key?
				</h4>
				<p className="text-sm text-muted-foreground">
					La API key de OpenAI se utiliza para potenciar funcionalidades de
					inteligencia artificial en la aplicación, como análisis de gastos,
					sugerencias personalizadas y procesamiento de lenguaje natural. Sin
					ella, estas funciones no estarán disponibles.
				</p>
			</div>
		</div>
	);
}
