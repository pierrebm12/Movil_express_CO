"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const sections = [
  { key: "productos", label: "Productos", icon: "📦" },
  { key: "marcas", label: "Marcas", icon: "🏷️" },
  { key: "categorias", label: "Categorías", icon: "🗂️" },
];

export default function AdminSidebar({ section, setSection }: { section: string, setSection: (s: string) => void }) {
  return (
    <aside className="h-full w-64 bg-gray-950 border-r border-gray-800 flex flex-col py-8 px-4">
      <h1 className="text-2xl font-bold text-primary mb-8 text-center">Admin MovilExpress</h1>
      <nav className="flex flex-col gap-2">
        {sections.map(s => (
          <Button
            key={s.key}
            variant={section === s.key ? "default" : "ghost"}
            className={`justify-start w-full text-lg ${section === s.key ? "bg-primary text-black" : "text-white"}`}
            onClick={() => setSection(s.key)}
          >
            <span className="mr-2">{s.icon}</span> {s.label}
          </Button>
        ))}
      </nav>
      <div className="mt-auto text-xs text-gray-500 text-center pt-8">Panel profesional inspirado para Movil Express</div>
    </aside>
  );
}
