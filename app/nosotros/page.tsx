"use client"
export const dynamic = "force-dynamic";

import { Award, Users, Target, Heart, Shield, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ModalUbicaciones } from "@/components/modal-ubicaciones"
import Image from "next/image"
import { ImageSlider } from "@/components/ImageSlider"
import AtencionCli from "@/components/atencion-cleinte"
import ServCli from "@/components/servicio-tecnico"
import PromotionalSlider from "@/components/banners"

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-black via-gray-900 to-black text-white">
  {/* Imagen de fondo con opacidad */}
  <img 
    src="/assets/banners/sucursalYopal.webp" 
    alt="sede yopal" 
    className="absolute inset-0 w-full h-full object-cover object-center opacity-30 z-0" 
  />
  
  {/* Contenido principal */}
  <div className="container mx-auto px-4 relative z-10">
    <div className="text-center max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-6xl font-bold mb-6">
        Conoce <span className="text-primary-600">Movil Express</span>
      </h1>
      <p className="text-xl md:text-2xl text-gray-200 leading-relaxed">
        Más que una tienda de tecnología, somos tu aliado en la era digital. Conectamos personas con la innovación
        que transforma vidas.
      </p>
    </div>
  </div>
</section>

      {/* Nuestra Historia */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-black mb-6">Nuestra Historia</h2>
              <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                <p>
                  Fundada en 2017, <strong>Movil Express</strong> nació con una visión clara: democratizar el acceso a
                  la tecnología móvil de vanguardia en Colombia.
                </p>
                <p>
                  Nace en el año 2017 en la ciudad de Yopal, en un local pequeño con las ganas de cmabiar la vida de las personas atraves d eun buen telefono.
                  Con pasion y esfuerzo, Hwander fue creando un acomunidad, ganandose la confianza de los clientes y creciendo paso a paso, hoy esta presente en Yopal, Bogotá y Medellin, con un equipo humano que comparte un mismo proposito: Servir con Honestidad y ofrecer tecnologia de calidad a un precio justo.

                </p>
                <p>
                  Nuestro compromiso va más allá de la venta: ofrecemos una experiencia completa que incluye asesoría
                  especializada, servicio técnico certificado y soporte postventa excepcional.
                </p>
              </div>
            </div>
            {/* Slider de imágenes infinito */}
            <div className="relative w-full flex items-center justify-center">
              <ImageSlider images={["/assets/banners/iniciosmovil.jpeg", "/assets/banners/iniciosmovil2.jpeg"]} />
            </div>
          </div>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">Misión y Visión</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Los principios que guían cada decisión y acción en Movil Express
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="rounded-2xl shadow-lg border-0 overflow-hidden">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary-400 rounded-full flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-2xl font-bold text-black mb-4">Nuestra Misión</h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  "Queremos que cada persona tenga el celular que siempre ha querido. En cinco años, seremos la tienda
                  número uno en Colombia en intercambio y reparación, movidos por la pasión de cambiar vidas a través de
                  la tecnología."
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-lg border-0 overflow-hidden">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary-400 rounded-full flex items-center justify-center mb-6">
                  <Award className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-2xl font-bold text-black mb-4">Nuestra Visión</h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  "En Movil Express, nos dedicamos a ofrecer teléfonos y productos tecnológicos de calidad, creando
                  relaciones a través de nuestras redes sociales. Nuestro objetivo es brindarles a nuestros clientes y
                  seguidores la mejor experiencia, impulsados por la pasión de ayudarles a conseguir el dispositivo que
                  se merecen."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-20 bg-gradient-to-br from-black via-gray-900 to-black text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Nuestros Valores</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Los pilares fundamentales que definen nuestra cultura empresarial
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/10 backdrop-blur-sm border-0 rounded-2xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-2xl font-bold text-primary-400 mb-4">Innovación</h3>
                <p className="text-gray-300 leading-relaxed">
                  Siempre a la vanguardia de la tecnología, ofreciendo los productos más avanzados del mercado y
                  anticipándonos a las necesidades futuras de nuestros clientes.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-0 rounded-2xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-2xl font-bold text-primary-400 mb-4">Confianza</h3>
                <p className="text-gray-300 leading-relaxed">
                  Construimos relaciones duraderas basadas en la transparencia, honestidad y cumplimiento de promesas.
                  Cada cliente es parte de nuestra familia.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-0 rounded-2xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-2xl font-bold text-primary-400 mb-4">Velocidad</h3>
                <p className="text-gray-300 leading-relaxed">
                  Respuesta rápida a las necesidades del cliente, desde la compra hasta el servicio postventa. Tu tiempo
                  es valioso y lo respetamos.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Estadísticas */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">Nuestros Logros</h2>
            <p className="text-xl text-gray-600">Números que reflejan nuestro compromiso y crecimiento</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary-600 mb-2">50K+</div>
              <div className="text-lg font-medium text-black mb-1">Clientes Satisfechos</div>
              <div className="text-sm text-gray-600">Desde 2018</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-primary-600 mb-2">3</div>
              <div className="text-lg font-medium text-black mb-1">Sucursales</div>
              <div className="text-sm text-gray-600">Yopal, Bogotá y Medellín</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-primary-600 mb-2">98%</div>
              <div className="text-lg font-medium text-black mb-1">Satisfacción</div>
              <div className="text-sm text-gray-600">Calificación promedio</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-primary-600 mb-2">24/7</div>
              <div className="text-lg font-medium text-black mb-1">Soporte</div>
              <div className="text-sm text-gray-600">Atención continua</div>
            </div>
          </div>
        </div>
      </section>

      {/*atencion al cliente */}
      <AtencionCli/>
      
      {/* Equipo */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">Nuestro Equipo</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Profesionales apasionados por la tecnología y comprometidos con tu satisfacción
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="rounded-2xl shadow-lg border-0 text-center">
              <CardContent className="p-6">
                <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-12 h-12 text-black" />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">Especialistas en Ventas</h3>
                <p className="text-gray-600">
                  Expertos certificados que te ayudan a encontrar el dispositivo perfecto para tus necesidades
                  específicas.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-lg border-0 text-center">
              <CardContent className="p-6">
                <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-12 h-12 text-black" />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">Técnicos Certificados</h3>
                <p className="text-gray-600">
                  Profesionales con certificaciones oficiales de Apple, Samsung y otras marcas líderes del mercado.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-lg border-0 text-center">
              <CardContent className="p-6">
                <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-12 h-12 text-black" />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">Atención al Cliente</h3>
                <p className="text-gray-600">
                  Equipo dedicado 24/7 para resolver tus dudas y brindarte el mejor soporte antes y después de tu
                  compra.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Compromiso */}
      <section className="py-20 bg-gradient-to-r from-primary-400 to-primary-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-black mb-6">Nuestro Compromiso Contigo</h2>
          <p className="text-xl text-black/80 max-w-3xl mx-auto mb-8 leading-relaxed">
            En Movil Express, cada cliente es único y merece una atención personalizada. Nos comprometemos a ofrecerte
            no solo los mejores productos, sino también una experiencia de compra excepcional que supere tus
            expectativas.
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-black/10 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="font-bold text-lg text-black mb-2">Garantía Total</h3>
              <p className="text-black/80">
                Respaldamos cada producto con garantía completa y servicio técnico especializado.
              </p>
            </div>
            <div className="bg-black/10 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="font-bold text-lg text-black mb-2">Mejor Precio</h3>
              <p className="text-black/80">
                Garantizamos los mejores precios del mercado. Si encuentras más barato, igualamos la oferta.
              </p>
            </div>
            <div className="bg-black/10 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="font-bold text-lg text-black mb-2">Satisfacción 100%</h3>
              <p className="text-black/80">
                Tu satisfacción es nuestra prioridad. Si no estás feliz, nosotros tampoco.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ModalUbicaciones />
    </div>
  )
}
