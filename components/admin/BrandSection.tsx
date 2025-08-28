"use client";
import MarcasTable from "@/components/admin/MarcasTable";
import AddMarcaModal from "@/components/admin/AddMarcaModal";

export default function BrandSection() {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-primary">Marcas</h2>
        <AddMarcaModal />
      </div>
      <MarcasTable />
    </section>
  );
}
