// Utilidad para manejar integración con Bold

const BOLD_API_URL = "https://integrations.api.bold.co";

export function getBoldKeys() {
  return {
    identity: process.env.NEXT_PUBLIC_BOLD_IDENTITY || process.env.BOLD_IDENTITY,
    secret: process.env.NEXT_PUBLIC_BOLD_SECRET || process.env.BOLD_SECRET,
  };
}

export async function boldRequest<T = any>(endpoint: string, options: RequestInit = {}) {
  const { identity, secret } = getBoldKeys();
  if (!identity || !secret) throw new Error("Bold keys not set");

  const headers = {
    "Content-Type": "application/json",
    "x-bold-identity": identity,
    "x-bold-secret": secret,
    ...(options.headers || {}),
  };

  const res = await fetch(`${BOLD_API_URL}${endpoint}`, {
    ...options,
    headers,
  });
  if (!res.ok) throw new Error(`Bold API error: ${res.status}`);
  return res.json() as Promise<T>;
}

// Ejemplo de uso:
// import { boldRequest } from "@/lib/bold";
// const data = await boldRequest("/tu-endpoint", { method: "POST", body: JSON.stringify(payload) });
