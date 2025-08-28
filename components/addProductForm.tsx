"use client";
import { useState } from "react";

import { useEffect } from "react";

interface AddProductFormProps {
  onSubmit?: (data: any) => void;
  categorias?: any[];
  marcas?: any[];
  initialData?: any;
  isEdit?: boolean;
}

export default function AddProductForm({ onSubmit, categorias = [], marcas = [], initialData, isEdit }: AddProductFormProps) {
  const [form, setForm] = useState(() => {
    if (initialData) {
      return {
        ...initialData,
        precio_anterior: initialData.precio_anterior || "",
        precio_actual: initialData.precio_actual || "",
        categoria_principal: initialData.categoria_principal || "",
        marca_id: initialData.marca_id || "",
        estado: initialData.estado || "Nuevo",
        capacidad: initialData.capacidad || "",
        stock: initialData.stock || "",
        en_oferta: initialData.en_oferta || false,
        destacado: initialData.destacado || false,
        garantia: initialData.garantia_meses || initialData.garantia || "",
        imagenes: initialData.imagenes?.length ? initialData.imagenes.map((img: any, i: number) => ({
          url_imagen: img.url || img.url_imagen || "",
          alt_text: img.alt_text || "",
          es_principal: img.es_principal || i === 0,
          orden: img.orden || i + 1
        })) : [{ url_imagen: initialData.imagen_principal || "", alt_text: "", es_principal: true, orden: 1 }],
        colores: initialData.colores?.length ? initialData.colores.map((col: any) => ({
          nombre_color: col.nombre || col.nombre_color || "",
          stock_color: col.stock || col.stock_color || ""
        })) : [{ nombre_color: "", stock_color: "" }],
        caracteristicas: initialData.caracteristicas?.length ? initialData.caracteristicas.map((car: any, i: number) => ({
          nombre: car.nombre || "",
          valor: car.valor || "",
          orden: car.orden || i + 1
        })) : [{ nombre: "", valor: "", orden: 1 }],
        tags: initialData.tags || [""]
      };
    }
    return {
      nombre: "",
      descripcion: "",
      precio_anterior: "",
      precio_actual: "",
      categoria_principal: "",
      marca_id: "",
      estado: "Nuevo",
      capacidad: "",
      stock: "",
      en_oferta: false,
      destacado: false,
      garantia: "",
      imagenes: [{ url_imagen: "", alt_text: "", es_principal: true, orden: 1 }],
      colores: [{ nombre_color: "", stock_color: "" }],
      caracteristicas: [{ nombre: "", valor: "", orden: 1 }],
      tags: [""]
    };
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        precio_anterior: initialData.precio_anterior || "",
        precio_actual: initialData.precio_actual || "",
        categoria_principal: initialData.categoria_principal || "",
        marca_id: initialData.marca_id || "",
        estado: initialData.estado || "Nuevo",
        capacidad: initialData.capacidad || "",
        stock: initialData.stock || "",
        en_oferta: initialData.en_oferta || false,
        destacado: initialData.destacado || false,
        garantia: initialData.garantia_meses || initialData.garantia || "",
        imagenes: initialData.imagenes?.length ? initialData.imagenes.map((img: any, i: number) => ({
          url_imagen: img.url || img.url_imagen || "",
          alt_text: img.alt_text || "",
          es_principal: img.es_principal || i === 0,
          orden: img.orden || i + 1
        })) : [{ url_imagen: initialData.imagen_principal || "", alt_text: "", es_principal: true, orden: 1 }],
        colores: initialData.colores?.length ? initialData.colores.map((col: any) => ({
          nombre_color: col.nombre || col.nombre_color || "",
          stock_color: col.stock || col.stock_color || ""
        })) : [{ nombre_color: "", stock_color: "" }],
        caracteristicas: initialData.caracteristicas?.length ? initialData.caracteristicas.map((car: any, i: number) => ({
          nombre: car.nombre || "",
          valor: car.valor || "",
          orden: car.orden || i + 1
        })) : [{ nombre: "", valor: "", orden: 1 }],
        tags: initialData.tags || [""]
      });
    }
  }, [initialData]);

  // If categorias or marcas change and the selected value is not present, reset
  useEffect(() => {
    if (categorias.length > 0 && !categorias.find(c => String(c.id) === String(form.categoria_principal))) {
      setForm((f: typeof form) => ({ ...f, categoria_principal: "" }));
    }
  }, [categorias]);
  useEffect(() => {
    if (marcas.length > 0 && !marcas.find(m => String(m.id) === String(form.marca_id))) {
      setForm((f: typeof form) => ({ ...f, marca_id: "" }));
    }
  }, [marcas]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // Métodos para agregar/eliminar imágenes, colores, características, tags
  const addImagen = () => setForm((f: typeof form) => ({ ...f, imagenes: [...f.imagenes, { url_imagen: "", alt_text: "", es_principal: false, orden: f.imagenes.length + 1 }] }));
  const removeImagen = (idx: number) => setForm((f: typeof form) => ({ ...f, imagenes: f.imagenes.filter((_: any, i: number) => i !== idx) }));
  const handleImagenChange = (idx: number, e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((f: typeof form) => ({
      ...f,
      imagenes: f.imagenes.map((img: any, i: number) => i === idx ? { ...img, [name]: type === "checkbox" ? checked : value } : img)
    }));
  };

  const addColor = () => setForm((f: typeof form) => ({ ...f, colores: [...f.colores, { nombre_color: "", stock_color: "" }] }));
  const removeColor = (idx: number) => setForm((f: typeof form) => ({ ...f, colores: f.colores.filter((_: any, i: number) => i !== idx) }));
  const handleColorChange = (idx: number, e: any) => {
    const { name, value } = e.target;
    setForm((f: typeof form) => ({
      ...f,
      colores: f.colores.map((col: any, i: number) => i === idx ? { ...col, [name]: value } : col)
    }));
  };

  const addCaracteristica = () => setForm((f: typeof form) => ({ ...f, caracteristicas: [...f.caracteristicas, { nombre: "", valor: "", orden: f.caracteristicas.length + 1 }] }));
  const removeCaracteristica = (idx: number) => setForm((f: typeof form) => ({ ...f, caracteristicas: f.caracteristicas.filter((_: any, i: number) => i !== idx) }));
  const handleCaracteristicaChange = (idx: number, e: any) => {
    const { name, value } = e.target;
    setForm((f: typeof form) => ({
      ...f,
      caracteristicas: f.caracteristicas.map((car: any, i: number) => i === idx ? { ...car, [name]: value } : car)
    }));
  };

  const addTag = () => setForm((f: typeof form) => ({ ...f, tags: [...f.tags, ""] }));
  const removeTag = (idx: number) => setForm((f: typeof form) => ({ ...f, tags: f.tags.filter((_: any, i: number) => i !== idx) }));
  const handleTagChange = (idx: number, e: any) => {
    const { value } = e.target;
    setForm((f: typeof form) => ({ ...f, tags: f.tags.map((tag: any, i: number) => i === idx ? value : tag) }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) throw new Error("No autorizado");
      const formData = new FormData();
      formData.append("nombre", form.nombre);
      formData.append("precioActual", form.precio_actual);
      formData.append("precioAnterior", form.precio_anterior);
      formData.append("descripcion", form.descripcion);
      formData.append("categoria_principal", form.categoria_principal);
      // Si en el futuro hay selección múltiple, enviar array. Por ahora solo la principal.
      formData.append("categorias", JSON.stringify(form.categoria_principal ? [form.categoria_principal] : []));
      formData.append("caracteristicas", JSON.stringify(form.caracteristicas));
      formData.append("tags", JSON.stringify(form.tags));
      formData.append("marca_id", form.marca_id);
      formData.append("capacidad", form.capacidad);
      formData.append("stock", form.stock);
      formData.append("estado", form.estado);
      formData.append("en_oferta", String(form.en_oferta));
      formData.append("destacado", String(form.destacado));
      formData.append("garantia_meses", form.garantia);
      // Imágenes (la principal es la que tiene es_principal true)
      const principal = form.imagenes.find((img: any) => img.es_principal);
      if (principal && principal.url_imagen) {
        formData.append("imagen_principal", principal.url_imagen);
      }
      // Galería (todas las imágenes)
      formData.append("imagenes_galeria", JSON.stringify(form.imagenes));
      // Colores y otras relaciones si aplica
      formData.append("colores", JSON.stringify(form.colores));
      // PUT si es edición, POST si es nuevo
      const url = isEdit && initialData?.id ? `/api/admin/productos/${initialData.id}` : "/api/admin/productos";
      const method = isEdit && initialData?.id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });
      const result = await res.json();
      if (onSubmit) onSubmit(result);
      alert(result.success ? "Producto guardado correctamente" : (result.error + (result.details ? `: ${result.details}` : "")) || "Error al guardar");
    } catch (err) {
      alert("Error al guardar producto");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto p-4 bg-gray-900 rounded-xl">
      <h2 className="text-xl font-bold text-white mb-4">Agregar nuevo producto</h2>
      <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" className="w-full p-2 rounded" required />
      <textarea name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción" className="w-full p-2 rounded" required />
      <input name="precio_anterior" value={form.precio_anterior} onChange={handleChange} placeholder="Precio anterior" type="number" className="w-full p-2 rounded" />
      <input name="precio_actual" value={form.precio_actual} onChange={handleChange} placeholder="Precio actual" type="number" className="w-full p-2 rounded" required />
      <select name="categoria_principal" value={form.categoria_principal} onChange={handleChange} className="w-full p-2 rounded" required>
        <option value="">Selecciona una categoría</option>
        {categorias.map((cat: any) => (
          <option key={cat.id} value={cat.id}>{cat.nombre}</option>
        ))}
      </select>
      <select name="marca_id" value={form.marca_id} onChange={handleChange} className="w-full p-2 rounded" required>
        <option value="">Selecciona una marca</option>
        {marcas.map((marca: any) => (
          <option key={marca.id} value={marca.id}>{marca.nombre}</option>
        ))}
      </select>
      <select name="estado" value={form.estado} onChange={handleChange} className="w-full p-2 rounded" required>
        <option value="Nuevo">Nuevo</option>
        <option value="Usado">Usado</option>
        <option value="Reacondicionado">Reacondicionado</option>
      </select>
      <input name="capacidad" value={form.capacidad} onChange={handleChange} placeholder="Capacidad (opcional)" className="w-full p-2 rounded" />
      <input name="stock" value={form.stock} onChange={handleChange} placeholder="Stock" type="number" className="w-full p-2 rounded" required />
      <input name="garantia" value={form.garantia} onChange={handleChange} placeholder="Garantía" className="w-full p-2 rounded" />
      <label className="flex items-center gap-2 text-white"><input type="checkbox" name="en_oferta" checked={form.en_oferta} onChange={handleChange} />Oferta</label>
      <label className="flex items-center gap-2 text-white"><input type="checkbox" name="destacado" checked={form.destacado} onChange={handleChange} />Destacado</label>
      {/* Imágenes */}
      <div className="bg-gray-800 p-2 rounded">
        <div className="flex justify-between items-center mb-1">
          <span className="text-white font-semibold">Imágenes</span>
          <button type="button" onClick={addImagen} className="text-primary-400">+ Agregar</button>
        </div>
        {form.imagenes.map((img: any, i: number) => (
          <div key={i} className="flex gap-2 mb-1">
            <input name="url_imagen" value={img.url_imagen} onChange={e => handleImagenChange(i, e)} placeholder="URL" className="p-1 rounded w-1/2" />
            <input name="alt_text" value={img.alt_text} onChange={e => handleImagenChange(i, e)} placeholder="Alt text" className="p-1 rounded w-1/3" />
            <label className="text-white text-xs flex items-center gap-1"><input type="checkbox" name="es_principal" checked={!!img.es_principal} onChange={e => handleImagenChange(i, e)} />Principal</label>
            <button type="button" onClick={() => removeImagen(i)} className="text-red-400">Eliminar</button>
          </div>
        ))}
      </div>

      {/* Colores */}
      <div className="bg-gray-800 p-2 rounded">
        <div className="flex justify-between items-center mb-1">
          <span className="text-white font-semibold">Colores</span>
          <button type="button" onClick={addColor} className="text-primary-400">+ Agregar</button>
        </div>
        {form.colores.map((col: any, i: number) => (
          <div key={i} className="flex gap-2 mb-1">
            <input name="nombre_color" value={col.nombre_color} onChange={e => handleColorChange(i, e)} placeholder="Nombre color" className="p-1 rounded w-1/2" />
            <input name="stock_color" value={col.stock_color} onChange={e => handleColorChange(i, e)} placeholder="Stock" type="number" className="p-1 rounded w-1/4" />
            <button type="button" onClick={() => removeColor(i)} className="text-red-400">Eliminar</button>
          </div>
        ))}
      </div>

      {/* Características */}
      <div className="bg-gray-800 p-2 rounded">
        <div className="flex justify-between items-center mb-1">
          <span className="text-white font-semibold">Características</span>
          <button type="button" onClick={addCaracteristica} className="text-primary-400">+ Agregar</button>
        </div>
        {form.caracteristicas.map((car: any, i: number) => (
          <div key={i} className="flex gap-2 mb-1">
            <input name="nombre" value={car.nombre} onChange={e => handleCaracteristicaChange(i, e)} placeholder="Nombre" className="p-1 rounded w-1/2" />
            <input name="valor" value={car.valor} onChange={e => handleCaracteristicaChange(i, e)} placeholder="Valor" className="p-1 rounded w-1/2" />
            <button type="button" onClick={() => removeCaracteristica(i)} className="text-red-400">Eliminar</button>
          </div>
        ))}
      </div>

      {/* Tags */}
      <div className="bg-gray-800 p-2 rounded">
        <div className="flex justify-between items-center mb-1">
          <span className="text-white font-semibold">Tags</span>
          <button type="button" onClick={addTag} className="text-primary-400">+ Agregar</button>
        </div>
        {form.tags.map((tag: any, i: number) => (
          <div key={i} className="flex gap-2 mb-1">
            <input value={tag} onChange={e => handleTagChange(i, e)} placeholder="Tag" className="p-1 rounded w-2/3" />
            <button type="button" onClick={() => removeTag(i)} className="text-red-400">Eliminar</button>
          </div>
        ))}
      </div>
      <button type="submit" className="bg-primary-500 text-black font-bold px-6 py-2 rounded">Guardar producto</button>
    </form>
  );
}
