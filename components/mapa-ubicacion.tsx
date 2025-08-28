"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowLeft, Navigation, Phone, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Ubicacion {
  nombre: string
  direccion: string
  telefono: string
  coordenadas: [number, number]
  horario: string
  imagen: string
  descripcion: string
}

interface MapaUbicacionProps {
  ubicacion: Ubicacion
  onClose: () => void
}

export function MapaUbicacion({ ubicacion, onClose }: MapaUbicacionProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let leafletMap: any = null

    const initMap = async () => {
      try {
        // Importar Leaflet dinámicamente
        const L = (await import("leaflet")).default

        // Configurar iconos por defecto
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        })

        if (mapRef.current && !leafletMap) {
          // Crear el mapa
          leafletMap = L.map(mapRef.current).setView(ubicacion.coordenadas, 15)

          // Agregar capa de tiles (OpenStreetMap)
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
          }).addTo(leafletMap)

          // Crear icono personalizado dorado
          const customIcon = L.divIcon({
            html: `
              <div style="
                background: linear-gradient(135deg, #f59e0b, #d97706);
                width: 30px;
                height: 30px;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                border: 3px solid white;
                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                <div style="
                  transform: rotate(45deg);
                  color: white;
                  font-size: 14px;
                  font-weight: bold;
                ">📍</div>
              </div>
            `,
            className: "custom-marker",
            iconSize: [30, 30],
            iconAnchor: [15, 30],
          })

          // Agregar marcador
          const marker = L.marker(ubicacion.coordenadas, { icon: customIcon }).addTo(leafletMap)

          // Popup personalizado
          const popupContent = `
            <div style="font-family: system-ui; min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; color: #92400e; font-size: 16px; font-weight: bold;">${ubicacion.nombre}</h3>
              <p style="margin: 4px 0; color: #d97706; font-size: 14px;">${ubicacion.direccion}</p>
              <p style="margin: 4px 0; color: #92400e; font-size: 12px;">${ubicacion.horario}</p>
            </div>
          `

          marker.bindPopup(popupContent).openPopup()

          setMap(leafletMap)
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Error loading map:", error)
        setIsLoading(false)
      }
    }

    initMap()

    return () => {
      if (leafletMap) {
        leafletMap.remove()
      }
    }
  }, [ubicacion])

  const abrirEnGoogleMaps = () => {
    const [lat, lng] = ubicacion.coordenadas
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`
    window.open(url, "_blank")
  }

  return (
    <>
      {/* CSS para Leaflet */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
        integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
        crossOrigin=""
      />

      <div className="fixed inset-0 bg-black/60 flex flex-col z-50">
        {/* Header */}
        <div className="bg-gradient-to-r bg-primary-700 to-primary-400 p-3 sm:p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20 p-2">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">{ubicacion.nombre}</h2>
                <p className="text-black text-sm hidden sm:block">{ubicacion.direccion}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mapa */}
        <div className="flex-1 relative">
          {isLoading && (
            <div className="absolute inset-0 bg-amber-50 flex items-center justify-center z-10">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-black">Cargando mapa...</p>
              </div>
            </div>
          )}
          <div ref={mapRef} className="w-full h-full" />
        </div>

        {/* Panel de información inferior */}
        <div className="bg-white p-4 sm:p-6 shadow-2xl">
          <Card className="border-0 shadow-none bg-gradient-to-r from-amber-50 to-yellow-50">
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center shadow-md">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-primary-900">Dirección</p>
                    <p className="text-sm text-primary-700">{ubicacion.direccion}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center shadow-md">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-primary-900">Teléfono</p>
                    <p className="text-sm text-primary-700">{ubicacion.telefono}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center shadow-md">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-primary-900">Horarios</p>
                    <p className="text-sm text-primary-700">{ubicacion.horario}</p>
                  </div>
                </div>

                <div className="flex items-center justify-center sm:justify-start">
                  <Button
                    onClick={abrirEnGoogleMaps}
                    className="bg-primary-600 hover:bg-primary-800 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Cómo llegar
                  </Button>
                </div>
              </div>

              <div className="text-center sm:text-left">
                <p className="text-primary-900 text-sm">{ubicacion.descripcion}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}
