import Link from "next/link";
import {
  ArrowDownCircle,
  FileText,
  History,
  Settings,
  Plus,
} from "lucide-react";
import { AddMovement } from "./add-movement";
import { client } from "@/database/database";

export async function NavigationMenu() {
  const categories = await client.execute({
    sql: "SELECT * FROM categories",
  });
  const categoriesData = categories.rows.map((category) => ({
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
          <Link href="/read-file" aria-label="Leer Archivo">
            <FileText
              size={28}
              className="mx-auto text-zinc-500 hover:text-blue-500 transition-colors"
            />
          </Link>
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
