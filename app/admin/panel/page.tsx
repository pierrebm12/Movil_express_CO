"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
// Update the import path if the file is located elsewhere, for example:
import ProductSection from "@/components/admin/ProductSection";
import BrandSection from "@/components/admin/BrandSection";
import CategorySection from "@/components/admin/CategorySection";

export default function AdminPanelPage() {
  const [section, setSection] = useState("productos");
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <AdminSidebar section={section} setSection={setSection} />
      <main className="flex-1 flex flex-col">
        <AdminHeader />
        <div className="flex-1 p-8 overflow-y-auto">
          {section === "productos" && <ProductSection />}
          {section === "marcas" && <BrandSection />}
          {section === "categorias" && <CategorySection />}
        </div>
      </main>
    </div>
  );
}
