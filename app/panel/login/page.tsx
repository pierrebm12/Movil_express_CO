"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PanelLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/panel/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success && data.rol === "cliente") {
        localStorage.setItem("panel_token", "ok");
        localStorage.setItem("panel_rol", "cliente");
        router.replace("/panel");
      } else if (data.success && data.rol === "admin") {
        localStorage.setItem("panel_token", "ok");
        localStorage.setItem("panel_rol", "admin");
        router.replace("/panel/admin");
      } else {
        setError(data.error || "Credenciales incorrectas");
      }
    } catch (err) {
      setError("Error de conexión");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Panel de Pedidos</h1>
        <input
          type="email"
          placeholder="Correo"
          className="w-full mb-4 px-4 py-2 border rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="w-full mb-4 px-4 py-2 border rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        <button type="submit" className="w-full bg-[#988443] text-white py-2 rounded hover:bg-[#8a7a3e]">Ingresar</button>
      </form>
    </div>
  );
}
