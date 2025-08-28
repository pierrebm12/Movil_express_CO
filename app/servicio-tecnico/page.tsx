"use client"
import ServCli from "@/components/servicio-tecnico"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ModalUbicaciones } from "@/components/modal-ubicaciones"

export default function ServicioTecnicoPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <ServCli />
      <Footer />
      <ModalUbicaciones />
    </div>
  )
}
