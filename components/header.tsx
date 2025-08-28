"use client"
import { ShoppingCart, Menu, X, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useStore } from "@/lib/store"
import Image from "next/image"
import Link from "next/link"

export function Header() {
  const { menuAbierto, toggleMenu, carrito, filtros = {}, actualizarFiltros, isAuthenticated, usuario} = useStore()

  const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0)

  return (
    <header className="bg-black shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-40">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Image
                src="/assets/logos/logosinFondo.PNG"
                alt="Movil Express"
                width={90}
                height={90}
                className="h-40 w-auto rounded-full transition-transform duration-200 group-hover:scale-105"
              />
            </div>
          </Link>

          {/* Buscador Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 transition-colors group-focus-within:text-primary-500" />
              <Input
                type="text"
                placeholder="Buscar productos..."
                value={filtros?.busqueda ?? ""}
                onChange={(e) => actualizarFiltros({ busqueda: e.target.value })}
                className="pl-10 pr-4 py-2 w-full border-2 border-gray-200 focus:border-primary-300 rounded-xl transition-all duration-200 bg-gray-50 focus:bg-white hover:bg-white"
              />
            </div>
          </div>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-white hover:text-primary-600 font-medium transition-colors duration-200 relative group"
            >
              Inicio
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-400 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link
              href="/catalogo"
              className="text-white hover:text-primary-600 font-medium transition-colors duration-200 relative group"
            >
              Catálogo
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-400 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link
              href="/servicio-tecnico"
              className="text-white hover:text-primary-600 font-medium transition-colors duration-200 relative group"
            >
              Servicio Técnico
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-400 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link
              href="/nosotros"
              className="text-white hover:text-primary-600 font-medium transition-colors duration-200 relative group"
            >
              Nosotros
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-400 transition-all duration-200 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Botones de acción */}
          <div className="flex items-center space-x-4">
            {/* Carrito */}
            <Link href="/carrito">
              <Button
                variant="outline"
                className="bg-white text-gray-700 border-primary-300 hover:bg-primary-50 hover:text-primary-700 hover:border-primary-400 relative transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Carrito</span>
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 min-w-[20px] h-5 flex items-center justify-center rounded-full animate-pulse">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>

        

            {/* Menú móvil */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              onClick={toggleMenu}
            >
              {menuAbierto ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-primary-600" />}
            </button>
          </div>
        </div>

        {/* Buscador móvil */}
        <div className="md:hidden pb-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 transition-colors group-focus-within:text-primary-500" />
            <Input
              type="text"
              placeholder="Buscar productos..."
              value={filtros?.busqueda ?? ""}
              onChange={(e) => actualizarFiltros({ busqueda: e.target.value })}
              className="pl-10 pr-4 py-2 w-full border-2 border-gray-200 focus:border-primary-300 rounded-xl transition-all duration-200 bg-gray-50 focus:bg-white"
            />
          </div>
        </div>

        {/* Menú móvil desplegable */}
        {menuAbierto && (
          <div className="md:hidden pb-4 mb-4 bg-white border-t border-gray-200 py-4 animate-slide-down rounded-b-3xl">
            <nav className="flex flex-col space-y-4 rounded-b-xl">
              <Link
                href="/"
                className="text-black hover:text-primary-600 font-medium transition-colors duration-200 py-2 px-4 rounded-lg hover:bg-gray-50"
              >
                Inicio
              </Link>
              <Link
                href="/catalogo"
                className="text-black hover:text-primary-600 font-medium transition-colors duration-200 py-2 px-4 rounded-lg hover:bg-gray-50"
              >
                Catálogo
              </Link>
              <Link
                href="/servicio-tecnico"
                className="text-black hover:text-primary-600 font-medium transition-colors duration-200 py-2 px-4 rounded-lg hover:bg-gray-50"
              >
                Servicio Técnico
              </Link>
              <Link
                href="/nosotros"
                className="text-black hover:text-primary-600 font-medium transition-colors duration-200 py-2 px-4 rounded-lg hover:bg-gray-50"
              >
                Nosotros
              </Link>
             
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
