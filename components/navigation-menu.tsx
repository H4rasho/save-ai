import Link from "next/link";
import {
  PlusCircle,
  ArrowDownCircle,
  FileText,
  History,
  Settings,
  Plus,
} from "lucide-react";

export function NavigationMenu() {
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
          <Link href="/add-expense" aria-label="Agregar Gasto">
            <span className="flex items-center justify-center rounded-full bg-primary text-secondary shadow-lg border-4 border-white dark:border-zinc-900 w-16 h-16 -mt-10 mx-auto transition-transform hover:scale-110">
              <Plus size={36} />
            </span>
          </Link>
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
