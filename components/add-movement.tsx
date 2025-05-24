"use client";

import { Plus, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Category } from "@/types/income";
import { AddMovementForm } from "./movements/add-movement-form";

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
            <AddMovementForm categories={categories} />
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
