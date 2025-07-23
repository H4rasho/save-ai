import { getUserCategoriesAction } from "@/app/core/categories/actions/categories-actions";
import { AddMovement } from "@/app/core/movements/components/create-movment";
import { History, Home, Settings } from "lucide-react";
import Link from "next/link";
import { getUserId } from "../../user/actions/user-actions";
import { InputOptionsButton } from "./input-options-button";

export async function NavigationMenu() {
	const userId = await getUserId();
	if (!userId) return null;
	const categories = await getUserCategoriesAction(userId);
	const categoriesData = categories.map((category) => ({
		id: Number(category.id),
		name: category.name as string,
	}));
	return (
		<nav className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border shadow-xl">
			<div className="relative px-4 pt-8 pb-3">
				{/* Botón central flotante */}
				<div className="absolute -top-8 left-1/2 -translate-x-1/2 z-20">
					<AddMovement categories={categoriesData} />
				</div>

				{/* Grid de 4 botones */}
				<div className="grid grid-cols-4 gap-2">
					<Link
						href="/home"
						className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-secondary/50 transition-all duration-200 group"
						aria-label="Inicio"
					>
						<Home
							size={20}
							className="text-foreground/70 group-hover:text-primary transition-colors duration-200"
						/>
						<span className="text-xs text-foreground/60 group-hover:text-primary font-medium mt-1">
							Inicio
						</span>
					</Link>

					<InputOptionsButton />

					<Link
						href="/movements"
						className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-secondary/50 transition-all duration-200 group"
						aria-label="Historial"
					>
						<History
							size={20}
							className="text-foreground/70 group-hover:text-primary transition-colors duration-200"
						/>
						<span className="text-xs text-foreground/60 group-hover:text-primary font-medium mt-1">
							Historial
						</span>
					</Link>

					<Link
						href="/settings"
						className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-secondary/50 transition-all duration-200 group"
						aria-label="Configuración"
					>
						<Settings
							size={20}
							className="text-foreground/70 group-hover:text-primary transition-colors duration-200"
						/>
						<span className="text-xs text-foreground/60 group-hover:text-primary font-medium mt-1">
							Config
						</span>
					</Link>
				</div>
			</div>
		</nav>
	);
}
