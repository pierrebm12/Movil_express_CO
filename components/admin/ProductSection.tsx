"use client";
import ProductTable from "@/components/ProductTable";
import AddProductModal from "@/components/admin/AddProductModal";

export default function ProductSection() {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-primary">Productos</h2>
        <AddProductModal />
      </div>
      <ProductTable />
    </section>
  );
}
