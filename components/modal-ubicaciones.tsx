"use client"

import { useState } from "react"
import { X, MapPin, Phone, Clock, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useStore } from "@/lib/store"
import { MapaUbicacion } from "./mapa-ubicacion"

const ubicaciones = [
  {
    nombre: "Sede Bogotá",
    direccion: "Cll 13#15-73 Local L2-52, Centro Comercial El Nodo, Bogotá",
    telefono: "+57 315 000 2115",
    coordenadas: [4.604794184130815, -74.08140146256385] as [number, number],
    horario: "Lun - Vie: 9:30 AM - 6:30 PM | Sab: 10:00 AM - 6:00 PM",
    imagen: "/assets/banners/sucursal_bogota.jpg",
    descripcion: "Nuestra sucursal principal en el corazón de Bogotá",
  },
  {
    nombre: "Sede Yopal",
    direccion: "CRA 20#14-26, Cerca a la Herradura Yopal",
    telefono: "+57 310 300 3623",
    coordenadas: [5.343268436140387, -72.39811822985543] as [number, number],
    horario: "Lun - Vie: 8:00 AM - 8:00 PM | Sáb: 9:00 AM - 7:00 PM",
    imagen: "/assets/banners/sucursalYopal.webp",
    descripcion: "Ubicada en la zona norte, fácil acceso y parqueadero",
  },
  {
    nombre: "Sede Medellín",
    direccion: "Cra. 43A #30-25, Av. El Poblado Con 30, Local 21 - 40 Medellín",
    telefono: "+57 300 855 9028",
    coordenadas: [6.2291486381394785, -75.57092294882528] as [number, number],
    horario: "Lun - Sáb: 9:30 AM - 7:30 PM",
    imagen: "/assets/banners/sedeMedellin.jpg",
    descripcion: "Nuestra primera sucursal en Medellín, ciudad de la eterna primavera",
  },
]

export function ModalUbicaciones() {
  const { modalUbicaciones, toggleModalUbicaciones } = useStore()
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState<(typeof ubicaciones)[0] | null>(null)

  if (!modalUbicaciones) return null

  if (ubicacionSeleccionada) {
    return <MapaUbicacion ubicacion={ubicacionSeleccionada} onClose={() => setUbicacionSeleccionada(null)} />
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-none sm:rounded-2xl w-full h-full sm:max-w-6xl sm:w-full max-h-screen overflow-y-auto sm:max-h-[90vh] sm:overflow-y-auto border-0 sm:border sm:border-amber-200 shadow-2xl">

        <div className="p-3 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h3 className="text-xl sm:text-3xl font-bold text-primary-900">Nuestras Ubicaciones</h3>
              <p className="text-primary-700 mt-1 text-sm sm:text-base">Encuentra la sucursal más cercana a ti</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleModalUbicaciones}
              className="bg-white text-primary-800 border-primary-300 hover:bg-primary-50 hover:border-primary-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Grid de ubicaciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {ubicaciones.map((ubicacion, index) => (
              <Card
                key={index}
                className="group cursor-pointer hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden border-0 shadow-lg bg-white hover:scale-[1.02] flex flex-col h-full"
                onClick={() => setUbicacionSeleccionada(ubicacion)}
              >
                {/* Imagen de la sucursal */}
                <div className="relative h-36 sm:h-48">
                  <img
                    src={ubicacion.imagen}
                    alt={ubicacion.nombre}
                    className="w-full h-full object-cover"
                  />
                  {/* Capa oscura encima de la imagen */}
                  <div className="absolute inset-0 bg-black/40"></div>
                  {/* Otros elementos encima */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-500 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/30">
                      <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4">
                    <h4 className="font-bold text-white text-base sm:text-lg drop-shadow-sm">{ubicacion.nombre}</h4>
                    <p className="text-gray-200 font-bold text-xs sm:text-sm drop-shadow-sm">{ubicacion.descripcion}</p>
                  </div>
                </div>

                {/* Información */}
                <div className="p-4 sm:p-6 bg-gradient-to-b from-white to-amber-50/30 flex flex-col flex-1">
                  <div className="space-y-2 sm:space-y-3 flex-1">
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-primary-900">Dirección</p>
                        <p className="text-primary-700 text-xs sm:text-sm">{ubicacion.direccion}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-primary-900">Teléfono</p>
                        <p className="text-primary-700 text-xs sm:text-sm">{ubicacion.telefono}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-primary-900">Horarios</p>
                        <p className="text-primary-700 text-xs sm:text-sm">{ubicacion.horario}</p>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full mt-3 sm:mt-4 bg-primary-600 text-white hover:bg-primary-700 rounded-xl font-bold group-hover:bg-primary-700 transition-all duration-300 text-xs sm:text-base shadow-lg hover:shadow-xl mt-auto">
                    <Navigation className="w-4 h-4 mr-2" />
                    Ver en el mapa
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Información adicional */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-4 sm:p-6 border border-primary-200 shadow-lg">
              <h4 className="font-bold text-primary-900 mb-3 sm:mb-4 flex items-center">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary-600 rounded-full flex items-center justify-center mr-2 sm:mr-3 shadow-md">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                Atención al Cliente
              </h4>
              <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-primary-800">
                <p>📞 Línea nacional: +57 310 3003623</p>
                <p>📱 WhatsApp: +57 310 2147638</p>
                <p>✉️ Email: info@movilexpress.com</p>
                <p>🕒 Atención 24/7 en línea</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-4 sm:p-6 border border-primary-400 shadow-lg">
              <h4 className="font-bold text-primary-900 mb-3 sm:mb-4 flex items-center">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary-600 rounded-full flex items-center justify-center mr-2 sm:mr-3 shadow-md">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                Servicios en Todas las Sucursales
              </h4>
              <div className="grid grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm text-primary-800">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full shadow-sm"></div>
                  <span>Venta de productos</span>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full shadow-sm"></div>
                  <span>Servicio técnico</span>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full shadow-sm"></div>
                  <span>Garantías</span>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full shadow-sm"></div>
                  <span>Asesoría especializada</span>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full shadow-sm"></div>
                  <span>Parqueadero gratis</span>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full shadow-sm"></div>
                  <span>WiFi gratuito</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
