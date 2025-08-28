"use client"
import React, { useState } from "react"
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useStore } from "@/lib/store"

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 48 48" fill="none" {...props}>
    <g>
      <path
        d="M34.5 6c.3 3.9 3.1 7 7 7v6.1c-3.1.3-6.1-0.5-8.7-2.2v13.7c0 7.2-5.8 13-13 13s-13-5.8-13-13 5.8-13 13-13c.7 0 1.4.1 2.1.2v6.2c-.7-.2-1.4-.3-2.1-.3-3.7 0-6.7 3-6.7 6.7s3 6.7 6.7 6.7 6.7-3 6.7-6.7V4h6z"
        fill="#25F4EE"
      />
      <path
        d="M34.5 6c.3 3.9 3.1 7 7 7v6.1c-3.1.3-6.1-0.5-8.7-2.2v13.7c0 7.2-5.8 13-13 13v-6.3c3.7 0 6.7-3 6.7-6.7V4h6z"
        fill="#FE2C55"
      />
      <path
        d="M42 13c-3.9 0-7-3.1-7-7h-6v23.3c0 3.7-3 6.7-6.7 6.7s-6.7-3-6.7-6.7 3-6.7 6.7-6.7c.7 0 1.4.1 2.1.2v-6.2c-.7-.1-1.4-.2-2.1-.2-7.2 0-13 5.8-13 13s5.8 13 13 13 13-5.8 13-13V16.9c2.6 1.7 5.6 2.5 8.7 2.2V13z"
        fill="#fff"
      />
    </g>
  </svg>
)

export const redesSociales = [
  {
    nombre: "Facebook",
    icon: Facebook,
    url: "https://www.facebook.com/movilexpressyopal/?locale=es_LA",
    colorClasses: "hover:bg-blue-600 hover:border-blue-600",
    bgGradient: "bg-blue-600",
  },
  {
    nombre: "Instagram",
    icon: Instagram,
    url: "https://www.instagram.com/movilexpress1/?fbclid=IwY2xjawLPhUNleHRuA2FlbQIxMABicmlkETFFY1JNUURYMVRkdWxtZUJjAR4NqDbkglEQ2PmK7AlIUuo3P31gKduUsyrnba1wGEm_c3096r_lr8Cg5epJMQ_aem_4_g_a4IlUdLtqJGnEyNC1Q#",
    colorClasses: "hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:border-purple-500",
    bgGradient: "bg-gradient-to-r from-purple-500 to-pink-500",
  },
  {
    nombre: "TikTok",
    icon: TikTokIcon,
    url: "https://www.tiktok.com/@soyhwander?fbclid=IwY2xjawLPhURleHRuA2FlbQIxMABicmlkETFFY1JNUURYMVRkdWxtZUJjAR65FQuuTbJevLisdLaYgh0REgWsxx3X1vRShwpc4-bdP7zrHN5J23Cbc-Ielw_aem_dKBJLDAlBXiyVZncvgWDEQ",
    colorClasses: "hover:bg-black hover:border-red-600",
    bgGradient: "bg-black",
  },
  {
    nombre: "YouTube",
    icon: Youtube,
    url: "https://www.youtube.com/@soyhwander",
    colorClasses: "hover:bg-red-600 hover:border-red-600",
    bgGradient: "bg-red-600",
  },
  {
    nombre: "WhatsApp",
    icon: MessageCircle,
    url: "https://wa.me/573103003623",
    colorClasses: "hover:bg-green-500 hover:border-green-500",
    bgGradient: "bg-green-500",
  },
]

export const Footer = React.memo(function Footer() {
  const { toggleModalUbicaciones, registrarCliente } = useStore()
  const [email, setEmail] = useState("")
  const [nombre, setNombre] = useState("")
  const [cargando, setCargando] = useState(false)
  const [registrado, setRegistrado] = useState(false)
  const [error, setError] = useState("")

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setError("Por favor ingresa tu email")
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Por favor ingresa un email válido")
      return
    }

    setCargando(true)
    setError("")

    try {
      const success = await registrarCliente({
        email: email.trim(),
        nombre: nombre.trim() || undefined,
      })

      if (success) {
        setRegistrado(true)
        setEmail("")
        setNombre("")
        setTimeout(() => setRegistrado(false), 5000)
      } else {
        setError("Error al registrarte. Intenta nuevamente.")
      }
    } catch (error) {
      setError("Error de conexión. Intenta nuevamente.")
    } finally {
      setCargando(false)
    }
  }

  return (
    <footer className="gradient-dark text-white relative overflow-hidden">
      {/* Patrón de fondo decorativo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary-400/20 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Logo y descripción */}
            <div className="sm:col-span-2 lg:col-span-2">
              <div className="flex items-center space-x-3 mb-4 md:mb-6">
                <div>
                  <img
                    className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40"
                    src="/assets/logos/logosinFondo.PNG"
                    alt="Movil Express"
                  />
                </div>
              </div>

              <p className="text-gray-300 mb-6 md:mb-8 max-w-md leading-relaxed text-sm md:text-base">
                Líderes en tecnología móvil con los mejores precios del mercado. Innovación, confianza y velocidad en
                cada compra. Tu futuro digital comienza aquí.
              </p>

              {/* Redes sociales mejoradas */}
              <div className="mb-6 md:mb-8">
                <h4 className="text-base md:text-lg font-bold mb-3 md:mb-4 text-white">Síguenos en nuestras redes</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
                  {redesSociales.map((red) => {
                    const Icon = red.icon
                    return (
                      <a
                        key={red.nombre}
                        href={red.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group relative overflow-hidden rounded-xl p-3 md:p-4 glass border border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-xl ${red.colorClasses}`}
                      >
                        <div className="flex items-center space-x-2 md:space-x-3">
                          <Icon className="w-4 h-4 md:w-5 md:h-5 text-white group-hover:text-white transition-colors" />
                          <span className="text-xs md:text-sm font-medium text-white group-hover:text-white transition-colors">
                            {red.nombre}
                          </span>
                        </div>

                        {/* Efecto de hover */}
                        <div
                          className={`absolute inset-0 ${red.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}
                        ></div>
                      </a>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Enlaces rápidos */}
            <div className="lg:col-span-1">
              <h4 className="text-base md:text-lg font-bold mb-4 md:mb-6 text-white">Enlaces rápidos</h4>
              <ul className="space-y-2 md:space-y-3">
                {[
                  { nombre: "Inicio", url: "/" },
                  { nombre: "Catálogo", url: "/catalogo" },
                  { nombre: "Nosotros", url: "/nosotros" },
                  { nombre: "Carrito", url: "/carrito" },
                  { nombre: "Soporte", url: "/soporte" },
                  { nombre: "Garantías", url: "/garantias" },
                ].map((link) => (
                  <li key={link.nombre}>
                    <a
                      href={link.url}
                      className="text-gray-300 hover:text-primary-400 transition-colors duration-300 flex items-center space-x-2 group text-sm md:text-base"
                    >
                      <div className="w-1 h-1 bg-primary-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <span>{link.nombre}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contacto y ubicaciones */}
            <div className="lg:col-span-1">
              <h4 className="text-base md:text-lg font-bold mb-4 md:mb-6 text-white">Contacto</h4>
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center space-x-3 group">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-primary-400/20 rounded-xl flex items-center justify-center group-hover:bg-primary-400/30 transition-colors">
                    <Mail className="w-4 h-4 md:w-5 md:h-5 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-xs md:text-sm">Email</p>
                    <p className="text-white font-medium text-xs md:text-base">movilexpressyopal1@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 group">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-primary-400/20 rounded-xl flex items-center justify-center group-hover:bg-primary-400/30 transition-colors">
                    <Phone className="w-4 h-4 md:w-5 md:h-5 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-xs md:text-sm">Teléfono</p>
                    <p className="text-white font-medium text-xs md:text-base">+57 310 300 3623</p>
                  </div>
                </div>

                <Button
                  onClick={toggleModalUbicaciones}
                  className="w-full gradient-primary text-black hover:from-primary-500 hover:to-primary-600 rounded-xl font-bold py-2 md:py-3 shadow-lg hover:shadow-xl transition-all duration-300 btn-hover-lift text-xs md:text-sm"
                >
                  <MapPin className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  Ver Nuestras Ubicaciones
                </Button>
              </div>

              {/* Horarios */}
              <div className="mt-4 md:mt-6 glass rounded-xl p-3 md:p-4 border border-white/10">
                <h5 className="font-bold text-white mb-2 md:mb-3 text-sm md:text-base">Horarios de Atención</h5>
                <div className="space-y-1 md:space-y-2 text-xs md:text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Lun - Vie:</span>
                    <span className="text-white">9:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Sábados:</span>
                    <span className="text-white">9:00 AM - 6:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Separador con gradiente */}
          <div className="my-8 md:my-12 divider-light"></div>

          {/* Footer bottom */}
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-xs md:text-sm">© 2024 Movil Express. Todos los derechos reservados.</p>
              <p className="text-gray-500 text-xs mt-1">
                Desarrollado por{" "}
                <span className="text-primary-400 font-medium">Pierre Buitrago – Fullstack Developer</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 md:space-x-6">
              <a href="#" className="text-gray-400 hover:text-primary-400 text-xs md:text-sm transition-colors">
                Términos y Condiciones
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 text-xs md:text-sm transition-colors">
                Política de Privacidad
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 text-xs md:text-sm transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
})
