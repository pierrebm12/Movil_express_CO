import { useEffect, useState } from "react";

type ConfirmedProduct = {
  id: number;
  orden_id: number;
  producto_id: number;
  producto_nombre: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  fecha_confirmacion: string;
  numero_pedido?: string;
  nombre?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  departamento?: string;
  codigo_postal?: string;
};

export default function ConfirmedProductsSection() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<ConfirmedProduct[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch("/api/admin/productos-confirmados")
      .then(res => res.json())
      .then(data => {
        setProducts(data.productos || []);
        setLoading(false);
      });
  }, [refresh]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Eliminar este producto confirmado?")) return;
    setLoading(true);
    await fetch("/api/admin/productos-confirmados", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    setRefresh(r => r + 1);
    setLoading(false);
  };

  const filtered = products.filter(p =>
    !search || (p.numero_pedido || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="min-h-screen w-full flex flex-col items-center justify-start bg-gradient-to-br from-[#232526] to-[#414345] py-8 px-2">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-[#988443] tracking-wide drop-shadow-lg">Productos Confirmados</h2>
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <div className="w-full md:w-1/2">
          <input
            type="text"
            placeholder="Buscar por número de factura (pedido)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-[#988443] focus:outline-none focus:ring-2 focus:ring-[#988443] bg-white text-gray-800 shadow-md"
          />
        </div>
        <button
          className="luxury-btn bg-[#988443] text-white hover:bg-[#b3a05a] transition-all px-5 py-2 rounded-xl shadow-md font-semibold flex items-center gap-2"
          onClick={() => setRefresh(r => r + 1)}
          title="Refrescar productos confirmados"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5A9 9 0 1021 12m0 0v4.5m0-4.5h-4.5" />
          </svg>
          Refrescar
        </button>
      </div>
      {loading && <div className="text-lg text-[#988443] font-semibold animate-pulse">Cargando...</div>}
      <div className="w-full max-w-6xl bg-white/90 rounded-2xl shadow-2xl p-2 mb-10 border border-[#988443] backdrop-blur-md overflow-x-auto">
        <table className="min-w-[900px] w-full text-center luxury-table">
          <thead>
            <tr className="bg-[#988443] text-white">
              <th className="py-3 px-2 whitespace-nowrap">ID</th>
              <th className="py-3 px-2 whitespace-nowrap">Factura</th>
              <th className="py-3 px-2 whitespace-nowrap">Producto</th>
              <th className="py-3 px-2 whitespace-nowrap">Cantidad</th>
              <th className="py-3 px-2 whitespace-nowrap">Precio Unitario</th>
              <th className="py-3 px-2 whitespace-nowrap">Subtotal</th>
              <th className="py-3 px-2 whitespace-nowrap">Fecha Confirmación</th>
              <th className="py-3 px-2 whitespace-nowrap">Cliente</th>
              <th className="py-3 px-2 whitespace-nowrap">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="transition-all duration-200 hover:bg-[#f5e9c6]">
                <td className="py-2 px-2 whitespace-nowrap">{p.id}</td>
                <td className="py-2 px-2 whitespace-nowrap">{p.numero_pedido || <span className="text-gray-400">-</span>}</td>
                <td className="py-2 px-2 whitespace-nowrap">{p.producto_nombre}</td>
                <td className="py-2 px-2 whitespace-nowrap">{p.cantidad}</td>
                <td className="py-2 px-2 whitespace-nowrap">{p.precio_unitario.toLocaleString("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 })}</td>
                <td className="py-2 px-2 whitespace-nowrap">{p.subtotal?.toLocaleString("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 })}</td>
                <td className="py-2 px-2 whitespace-nowrap">{p.fecha_confirmacion ? new Date(p.fecha_confirmacion).toLocaleString() : <span className="text-gray-400">-</span>}</td>
                <td className="py-2 px-2 whitespace-nowrap">{p.nombre || <span className="text-gray-400">-</span>}</td>
                <td className="py-2 px-2 whitespace-nowrap flex gap-2 justify-center">
                  <button
                    className="luxury-btn bg-[#988443] text-white hover:bg-[#b3a05a] transition-all px-3 py-1 rounded-lg shadow-md font-semibold"
                    onClick={() => setSelected(selected === p.id ? null : p.id)}
                  >
                    {selected === p.id ? "Ocultar" : "Ver Detalles"}
                  </button>
                  <button
                    className="luxury-btn bg-red-600 text-white hover:bg-red-700 transition-all px-3 py-1 rounded-lg shadow-md font-semibold"
                    onClick={() => handleDelete(p.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selected && (
        <div className="mb-8 w-full max-w-4xl mx-auto bg-white/95 rounded-2xl shadow-xl p-2 border border-[#988443] overflow-x-auto animate-modalpop">
          <h3 className="text-2xl font-bold mb-4 text-[#988443] text-center">Detalles del Producto Confirmado #{selected}</h3>
          {/* Aquí puedes mostrar más detalles si lo deseas */}
          <button className="mt-4 px-6 py-2 rounded-lg bg-gray-300 text-gray-800 font-bold hover:bg-gray-400" onClick={() => setSelected(null)}>Cerrar</button>
        </div>
      )}
    </section>
);
}
