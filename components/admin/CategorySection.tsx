"use client";

import { useState } from "react";
import CategoriasTable from "@/components/admin/CategoriasTable";
import AddCategoriaModal from "@/components/admin/AddCategoriaModal";

export default function CategorySection() {
  const [refreshKey, setRefreshKey] = useState(0);
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-primary">Categorías</h2>
        <AddCategoriaModal onCreated={() => setRefreshKey(k => k + 1)} />
      </div>
      <CategoriasTable refreshKey={refreshKey} />
    </section>
  );
}
