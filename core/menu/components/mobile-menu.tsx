import { AddMovement } from "@/core/movements/components/create-movment";
import { ReadFileModalButton } from "@/core/movements/components/read-file-modal-button";
import { getUserCategories } from "@/core/user/user-actions";
import { ArrowDownCircle, History, Settings } from "lucide-react";
import Link from "next/link";

export async function NavigationMenu() {
	const categories = await getUserCategories(1);
	const categoriesData = categories.map((category) => ({
		id: Number(category.id),
		name: category.name as string,
	}));
	return (
		<nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex justify-around items-center h-16 shadow-lg">
			<ul className="flex w-full justify-around items-center relative">
				<li>
					<Link href="/add-income" aria-label="Agregar Ingreso">
						<ArrowDownCircle
							size={28}
							className="mx-auto text-zinc-500 hover:text-blue-500 transition-colors"
						/>
					</Link>
				</li>
				<li>
					<ReadFileModalButton />
				</li>
				<li className="relative z-10">
					<AddMovement categories={categoriesData} />
				</li>
				<li>
					<Link href="/history" aria-label="Historial">
						<History
							size={28}
							className="mx-auto text-zinc-500 hover:text-blue-500 transition-colors"
						/>
					</Link>
				</li>
				<li>
					<Link href="/settings" aria-label="Configuraciones">
						<Settings
							size={28}
							className="mx-auto text-zinc-500 hover:text-blue-500 transition-colors"
						/>
					</Link>
				</li>
			</ul>
		</nav>
	);
}
