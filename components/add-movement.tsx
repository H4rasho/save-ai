"use client";

import { Plus, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Category } from "@/types/income";

interface AddMovementProps {
  categories: Category[];
}

export function AddMovement({ categories }: AddMovementProps) {
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
        aria-label="Agregar Gasto"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40"
      >
        <span className="flex items-center justify-center rounded-full bg-primary text-secondary shadow-lg border-4 border-white dark:border-zinc-900 w-16 h-16 transition-transform hover:scale-110">
          <Plus size={36} />
        </span>
      </button>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
          <div
            ref={modalRef}
            className="w-full max-w-md mx-auto rounded-t-2xl bg-card p-6 shadow-lg animate-slideUp relative"
            style={{
              animation: "slideUp 0.3s cubic-bezier(0.4,0,0.2,1)"
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
            <h3 className="text-lg font-bold mb-4 text-center">Agregar Gasto</h3>
            <form className="space-y-4">
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Input id="description" name="description" required />
              </div>
              <div>
                <Label htmlFor="amount">Monto</Label>
                <Input id="amount" name="amount" type="number" required />
              </div>
              <div>
                <Label htmlFor="category">Categoría</Label>
                <select
                  id="category"
                  name="category"
                  required
                  className="w-full border rounded px-3 py-2"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Selecciona una categoría
                  </option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="date">Fecha</Label>
                <Input id="date" name="date" type="date" required />
              </div>
              <Button type="submit" className="w-full">
                Guardar
              </Button>
            </form>
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
