import Image from "next/image"
import { CheckCircle, MessageSquare, Clock, Shield, Smartphone, Users, Zap, Star, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const redesSociales = [
  {
    nombre: "WhatsApp",
    url: "https://wa.me/573103003623",
    colorClasses: "hover:bg-green-500 hover:border-green-500",
    bgGradient: "bg-green-500",
  },
]

export default function AtencionCli() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 via-transparent to-primary-800/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-800/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-12 sm:py-20 md:py-24 px-4 text-center overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Floating Elements */}
          <div className="absolute top-10 left-10 w-20 h-20 border border-primary-600/30 rounded-full animate-spin-slow hidden lg:block"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-gradient-to-br from-primary-600/20 to-transparent rounded-lg rotate-45 animate-bounce-slow hidden lg:block"></div>

          <div className="flex flex-col sm:flex-row items-center justify-center mb-6 sm:mb-8 relative">
            <div className="relative">
              <Users className="w-10 h-10 sm:w-12 md:w-16 sm:h-12 md:h-16 text-primary-500 mb-4 sm:mb-0 sm:mr-6 drop-shadow-2xl" />
              <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-xl animate-pulse"></div>
            </div>
            <Badge className="text-sm sm:text-base lg:text-lg px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-black hover:from-primary-500 hover:to-primary-400 font-semibold shadow-2xl border border-primary-400/50 backdrop-blur-sm transition-all duration-300 hover:scale-105">
              <Star className="w-4 h-4 mr-2 animate-spin-slow" />
              Atención Premium
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-6 sm:mb-8 leading-tight relative">
            <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
              Atención al Cliente:
            </span>
            <span className="block mt-2 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent animate-gradient-x">
              Asesoría integral con rostro humano
            </span>
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-600/20 via-transparent to-primary-600/20 blur-2xl -z-10"></div>
          </h1>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-xs sm:max-w-3xl lg:max-w-5xl mx-auto leading-relaxed px-2 font-light">
            En nuestra tienda especializada en smartphones (iPhone y Android), entendemos que el éxito de un buen
            servicio no solo radica en la calidad técnica, sino también en la
            <span className="text-primary-400 font-medium"> experiencia humana</span> que brindamos.
          </p>

          <div className="relative w-full max-w-sm sm:max-w-3xl lg:max-w-6xl mx-auto mb-12 sm:mb-16 group">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary-600/50 via-primary-500/30 to-primary-600/50 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative backdrop-blur-sm bg-white/5 p-2 sm:p-4 rounded-2xl sm:rounded-3xl border border-primary-500/30">
              <Image
                src="/assets/atencion_al_clientte_1.jpg"
                alt="Equipo de atención al cliente especializado en smartphones"
                width={800}
                height={400}
                className="w-full h-48 sm:h-64 md:h-80 lg:h-96 rounded-xl sm:rounded-2xl shadow-2xl object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-16 sm:py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 sm:p-12 border border-white/20 shadow-2xl">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-6 sm:mb-8 px-2">
              Nuestra{" "}
              <span className="bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
                Filosofía
              </span>{" "}
              de Servicio Integral
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-8 sm:mb-12 max-w-4xl mx-auto px-2 leading-relaxed">
              Nos regimos por la <span className="text-primary-500 font-semibold">claridad absoluta</span> en procesos y
              precios, porque creemos que la transparencia es la base de la confianza.
            </p>
            <div className="flex justify-center">
              <div className="w-24 sm:w-32 h-2 bg-gradient-to-r from-transparent via-primary-900/50 to-transparent rounded-full shadow-lg shadow-primary-800/50"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 sm:py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white text-center mb-12 sm:mb-16 px-2">
            Nuestros{" "}
            <span className="bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
              Servicios
            </span>{" "}
            Especializados
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
            {/* Service Card 1 */}
            <Card className="group relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-primary-500/30 hover:border-primary-400/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary-500/25">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="text-center pb-4 p-4 sm:p-6 relative z-10">
                <div className="w-full h-40 sm:h-48 relative mb-6 overflow-hidden rounded-xl">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                  <Image
                    src="/assets/atencion_al_cliente_2.jpg"
                    alt="Técnico explicando cotización transparente a cliente"
                    width={300}
                    height={200}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-3 left-3 z-20">
                    <Badge className="bg-gradient-to-r from-primary-400 to-primary-500 text-black hover:from-primary-500 hover:to-primary-700 text-xs sm:text-sm font-semibold shadow-lg">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      Transparente
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-lg sm:text-xl font-bold text-black flex flex-col sm:flex-row items-center justify-center gap-2 group-hover:text-primary-600 transition-colors duration-300">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary-500" />
                  Cotizaciones Transparentes
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center p-4 sm:p-6 relative z-10">
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
                  <strong className="text-primary">Cotizaciones transparentes desde el inicio</strong>, explicando origen
                  del problema y piezas necesarias. Sin sorpresas, sin costos ocultos.
                </p>
                <div className="flex items-center justify-center text-xs sm:text-sm text-gray-500">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-primary-500 mr-1" />
                  Diagnóstico detallado incluido
                </div>
              </CardContent>
            </Card>

            {/* Service Card 2 - Featured */}
            <Card className="group relative overflow-hidden bg-gradient-to-br from-yellow-600/20 to-yellow-800/10 backdrop-blur-xl border-2 border-primary-500/60 hover:border-primary-600 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary-500/40 xl:transform xl:translate-y-[-1rem]">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 via-transparent to-yellow-600/20 opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
              <div className="absolute top-4 right-4 z-20">
                <Badge className="bg-gradient-to-r from-black to-gray-800 text-primary-500 text-xs font-bold px-3 py-1 shadow-lg">
                  <Zap className="w-3 h-3 mr-1" />
                  PREMIUM
                </Badge>
              </div>
              <CardHeader className="text-center pb-4 p-4 sm:p-6 relative z-10">
                <div className="w-full h-40 sm:h-48 relative mb-6 overflow-hidden rounded-xl">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                  <Image
                    src="/assets/atencion_al_clientte_1.jpg"
                    alt="Notificación por WhatsApp de reparación completada"
                    width={300}
                    height={200}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-3 left-3 z-20">
                    <Badge className="bg-gradient-to-r from-primary-500/10 to-primary-700 text-white hover:from-primary-800 hover:to-primary text-xs sm:text-sm font-semibold shadow-lg">
                      <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      Notificaciones
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-lg sm:text-xl font-bold text-black flex flex-col sm:flex-row items-center justify-center gap-2">
                  <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-primary-500" />
                  Comunicación Constante
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center p-4 sm:p-6 relative z-10">
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
                  <strong className="text-primary-500">Te avisamos por SMS o WhatsApp</strong> cuando tu equipo está
                  listo, evitando que te quedes esperando sin información.
                </p>
                <div className="flex items-center justify-center text-xs sm:text-sm text-gray-500">
                  <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 text-primary-500 mr-1" />
                  Actualizaciones en tiempo real
                </div>
              </CardContent>
            </Card>

            {/* Service Card 3 */}
            <Card className="group relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-primary-500/30 hover:border-primary-400/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary-500/25 md:col-span-2 xl:col-span-1">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="text-center pb-4 p-4 sm:p-6 relative z-10">
                <div className="w-full h-40 sm:h-48 relative mb-6 overflow-hidden rounded-xl">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                  <Image
                    src="/assets/atencion_al_cliente_2.jpg"
                    alt="Reloj mostrando tiempos reales de reparación"
                    width={300}
                    height={200}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-3 left-3 z-20">
                    <Badge className="bg-gradient-to-r from-primary-500/10 to-primary-700 text-white hover:from-primary-700 hover:to-primary-500 text-xs sm:text-sm font-semibold shadow-lg">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      Puntualidad
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-lg sm:text-xl font-bold text-black flex flex-col sm:flex-row items-center justify-center gap-2 group-hover:text-primary-500 transition-colors duration-400">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-primary-500" />
                  Tiempos Reales
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center p-4 sm:p-6 relative z-10">
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
                  <strong className="text-primary">Informamos sobre tiempos reales</strong> —no promesas vacías— y
                  evitamos sorpresas durante la reparación.
                </p>
                <div className="flex items-center justify-center text-xs sm:text-sm text-gray-400">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-primary-500 mr-1" />
                  Estimaciones precisas y confiables
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      

    </div>
  )
}
