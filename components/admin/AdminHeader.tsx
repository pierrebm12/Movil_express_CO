"use client";

export default function AdminHeader() {
  return (
    <header className="w-full h-20 bg-gray-950 border-b border-gray-800 flex items-center px-8 justify-between">
      <div className="text-xl font-bold text-primary">Panel de Administración</div>
      <div className="flex items-center gap-4">
        {/* Aquí puedes poner el usuario logueado, notificaciones, etc. */}
        <span className="text-gray-400 text-sm">Desarrollado por FullStack - Pierre Buitrago</span>
      </div>
    </header>
  );
}
