"use client";
import React from "react";

interface ConfirmDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  text?: string;
}

export default function ConfirmDeleteModal({ open, onClose, onConfirm, loading, text }: ConfirmDeleteModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-lg font-bold mb-4">¿Eliminar?</h2>
        <p className="mb-4 text-gray-700">{text || "¿Estás seguro que deseas eliminar este elemento? Esta acción no se puede deshacer."}</p>
        <div className="flex gap-2 justify-end">
          <button className="px-3 py-1 bg-gray-200 rounded" onClick={onClose} disabled={loading}>Cancelar</button>
          <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={onConfirm} disabled={loading}>{loading ? "Eliminando..." : "Eliminar"}</button>
        </div>
      </div>
    </div>
  );
}
