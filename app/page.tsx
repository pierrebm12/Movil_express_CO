"use client"
import { ArrowRight, Shield, Truck, Headphones, Award, MessageCircle, Check, Send, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ModalUbicaciones } from "@/components/modal-ubicaciones"
import { useStore } from "@/lib/store"
import { useProductosDestacados, useProductos } from "@/hooks/use-productos"
import Image from "next/image"
import Link from "next/link"
import { PromotionSlider } from "@/components/promotion-slider"
import { ProductSlider } from "@/components/product-slider"
import { EcoSlider } from "@/components/EcoSlider"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react";
import { Settings, BarChart3, Package, Users, Target, Eye } from "lucide-react";
import PromotionalSlider from "@/components/banners"
import ProductTop from "@/components/product-top"





export default function HomePage() {
  const { isAuthenticated, usuario } = useStore();
  const [ecoCategoriaId, setEcoCategoriaId] = useState<number | null>(null);
  const [loadingEcoCat, setLoadingEcoCat] = useState(true);
  const { productos: productosDestacados, loading, error } = useProductosDestacados();
  // Obtener productos ECO solo si tenemos el ID
  const { productos: productosEco, loading: loadingEco, error: errorEco } = useProductos(
    ecoCategoriaId
      ? { limit: 8, sortBy: "fecha_creacion", sortOrder: "desc", categoria: ecoCategoriaId.toString() }
      : { limit: 0 }
  );

  useEffect(() => {
    // Buscar el ID de la categoría ECO dinámicamente
    setLoadingEcoCat(true);
    fetch("/api/admin/categorias")
      .then(res => res.json())
      .then(data => {
        const categoriasArr = data.data || data.categorias || [];
        const ecoCat = categoriasArr.find((cat: any) => cat.nombre.toLowerCase() === "eco");
        setEcoCategoriaId(ecoCat ? ecoCat.id : null);
      })
      .finally(() => setLoadingEcoCat(false));
  }, []);

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(precio);
  };

  const calcularDescuento = (anterior: number, nuevo: number) => {
    return Math.round(((anterior - nuevo) / anterior) * 100);
  };

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const [cargando, setCargando] = useState(false);
  const [registrado, setRegistrado] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setErr("");
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setErr("Por favor, ingresa un email válido.");
      setCargando(false);
      return;
    }
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, email })
      });
      const data = await response.json();
      if (!response.ok) {
        setErr(data.error || 'Ocurrió un error. Por favor, inténtalo de nuevo.');
        setRegistrado(false);
      } else {
        setRegistrado(true);
      }
    } catch (err) {
      setErr("Ocurrió un error. Por favor, inténtalo de nuevo.");
      setRegistrado(false);
    } finally {
      setCargando(false);
    }
  };
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section - Optimizado para móvil */}
      <section className="relative min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/assets/banners/background(1).jpeg" alt="Fondo Movil Express" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight flex flex-col items-center justify-center gap-2 md:gap-4">
              <span>¡Explora el futuro!</span>
            </h1>
            <div className="logo flex items-center justify-center -mt-2 md:-mt-4">
              <img
                className="rounded-full -mt-5 w-32 sm:w-48 md:w-64 lg:w-80"
                src="/assets/logos/logosinFondo.PNG"
                alt="Movil Express"
              />
            </div>

            <p className="text-sm sm:text-base md:text-xl lg:text-2xl text-gray-200 mb-6 md:mb-8 leading-relaxed max-w-2xl mx-auto px-4">
              Descubre la última tecnología móvil con los mejores precios del mercado. Calidad garantizada y envío
              seguro a todo el país.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
              <Link href="/catalogo">
                <Button
                  size="lg"
                  className="bg-black text-primary-500 hover:bg-primary-500 hover:text-black text-sm md:text-lg px-6 md:px-8 py-3 md:py-4 rounded-2xl shadow-lg font-bold border-2 border-primary-500 w-full sm:w-auto"
                >
                  Ver Catálogo
                  <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <PromotionalSlider />
      {/* Slider de Promociones Dinámico */}
      <section className="mb-4 py-6 md:py-8 bg-white">
        <div className="container  mx-auto px-4">
          <PromotionSlider autoPlay={true} autoPlayInterval={5000} transitionSpeed={1000} />
        </div>
      </section>

      {/* Productos Destacados con Slider */}
      <section id="destacados" className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-10 h-10 animate-spin mx-auto text-primary" />
              <p className="text-gray-600 mt-2">Cargando destacados...</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 py-8">
              <AlertCircle className="w-6 h-6 inline-block mr-2" />
              Error: {error}
            </div>
          ) : productosDestacados.length === 0 ? (
            <div className="text-center py-8 text-gray-600">No hay productos destacados disponibles.</div>
          ) : (
            <ProductTop productos={ecoCategoriaId ? productosDestacados.filter(p => !(p.categorias?.some((cat: any) => cat.nombre.toLowerCase() === "eco"))) : productosDestacados} />
          )}
        </div>
      </section>


      
      <section className="py-12 md:py-20 relative overflow-hidden bg-green-50">
        {/* Fondo animado con imagen y SVGs */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img src="/assets/banners/eco_banner.png" alt="Fondo Eco" className="w-full h-full object-cover opacity-30" />
          {/* Figuras animadas SVG */}
          <svg className="absolute left-10 top-10 animate-bounce-slow" width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="30" fill="#4ade80" fillOpacity="0.3" />
          </svg>
          <svg className="absolute right-10 bottom-10 animate-spin-slow" width="60" height="60" viewBox="0 0 60 60" fill="none">
            <rect x="10" y="10" width="40" height="40" rx="10" fill="#22d3ee" fillOpacity="0.2" />
          </svg>
          <svg className="absolute left-1/2 top-1/3 animate-float" width="100" height="40" viewBox="0 0 100 40" fill="none">
            <ellipse cx="50" cy="20" rx="40" ry="15" fill="#bef264" fillOpacity="0.18" />
          </svg>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-800 mb-4">
              Eco Movilidad: Patinetas, Bicis y Motos Eléctricas
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-green-700 max-w-2xl mx-auto px-4 justify-center">
              Descubre cómo puedes moverte de forma inteligente, económica y ecológica. Nuestras patinetas, bicicletas y motos eléctricas te ayudan a reducir tu huella de carbono, ahorrar dinero en combustible y contribuir a un planeta más limpio. ¡Únete al cambio y disfruta de una movilidad silenciosa, eficiente y divertida!
            </p>
          </div>
          {/* Slider de productos eco */}
          <div className="mb-8">
            {loadingEcoCat || loadingEco ? (
              <div className="text-center py-8"><Loader2 className="w-8 h-8 animate-spin mx-auto text-green-700" /><p className="text-green-700 mt-2">Cargando productos eco...</p></div>
            ) : errorEco ? (
              <div className="text-center text-red-600 py-8">Error: {errorEco}</div>
            ) : productosEco && productosEco.length > 0 ? (
              <EcoSlider
                productos={productosEco.map((p: any) => ({
                  id: p.id,
                  nombre: p.nombre,
                  descripcion: p.descripcion,
                  precio: p.precio_actual,
                  imagen: p.imagen_principal || (p.imagenes?.[0]?.url_imagen) || "/assets/placeholder.png",
                  destacado: p.destacado,
                  tags: p.categorias?.map((cat: any) => cat.nombre) || [],
                  color: p.color || undefined,
                  stock: p.stock,
                }))}
                autoPlay={true}
                autoPlayInterval={5000}
              />
            ) : (
              <div className="text-center py-8 text-green-700">No hay productos eco disponibles.</div>
            )}
          </div>
          <div className="text-center">
            <Link href="/catalogo?categoria=eco">
              <Button className="bg-green-600 text-white hover:bg-green-700 px-8 md:px-12 py-3 md:py-4 rounded-2xl text-base md:text-lg font-bold shadow-lg hover:shadow-xl transition-all">
                Ver detalles
                <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
              </Button>
            </Link>
          </div>
        </div>
        {/* Animaciones personalizadas */}
        <style jsx>{`
          .animate-bounce-slow {
            animation: bounce-slow 3s infinite alternate;
          }
          @keyframes bounce-slow {
            0% { transform: translateY(0); }
            100% { transform: translateY(-30px); }
          }
          .animate-spin-slow {
            animation: spin-slow 8s linear infinite;
          }
          @keyframes spin-slow {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .animate-float {
            animation: float 5s ease-in-out infinite alternate;
          }
          @keyframes float {
            0% { transform: translateY(0); }
            100% { transform: translateY(20px); }
          }
        `}</style>
      </section>

      {/* Sección de Confianza - Optimizada para móvil */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-4">
              ¿Por qué elegir Movil Express?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600">Compromiso total con tu satisfacción</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center p-4 md:p-6 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-black mb-2">Garantía Total</h3>
              <p className="text-sm md:text-base text-gray-600">
                Todos nuestros productos cuentan con garantía completa y soporte técnico especializado las 24 horas.
              </p>
            </div>

            <div className="text-center p-4 md:p-6 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-black mb-2">Envío Express</h3>
              <p className="text-sm md:text-base text-gray-600">
                Entrega rápida y segura a todo el país. Tu compra protegida desde el primer momento hasta tu puerta.
              </p>
            </div>

            <div className="text-center p-4 md:p-6 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-black mb-2">Soporte Premium</h3>
              <p className="text-sm md:text-base text-gray-600">
                Atención especializada para resolver todas tus dudas antes y después de tu compra. Siempre disponibles.
              </p>
            </div>

            <div className="text-center p-4 md:p-6 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-black mb-2">Mejor Precio</h3>
              <p className="text-sm md:text-base text-gray-600">
                Garantizamos los mejores precios del mercado. Si encuentras más barato, igualamos la oferta.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Testimonios */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4">
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Miles de clientes satisfechos respaldan nuestra calidad y servicio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                nombre: "María González",
                ubicacion: "Bogotá",
                testimonio: "Excelente servicio! Mi iPhone llegó en perfectas condiciones y el precio fue increíble. Definitivamente volveré a comprar.",
                rating: 5,
                producto: "iPhone 15 Pro"
              },
              {
                nombre: "Carlos Rodríguez",
                ubicacion: "Medellín",
                testimonio: "La atención al cliente es excepcional. Me ayudaron a elegir el celular perfecto para mis necesidades y el envío fue súper rápido.",
                rating: 5,
                producto: "Samsung Galaxy S24"
              },
              {
                nombre: "Ana Martínez",
                ubicacion: "Cali",
                testimonio: "Compré un smartwatch y quedé encantada. La garantía y el soporte post-venta son realmente buenos. Muy recomendado!",
                rating: 5,
                producto: "Apple Watch Series 9"
              }
            ].map((testimonio, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  {[...Array(testimonio.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed">"{testimonio.testimonio}"</p>
                <div className="border-t pt-4">
                  <p className="font-bold text-black">{testimonio.nombre}</p>
                  <p className="text-sm text-gray-600">{testimonio.ubicacion}</p>
                  <p className="text-xs text-primary-600 mt-1">Compró: {testimonio.producto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de Proceso de Compra */}
      <section className="py-12 md:py-20 bg-gray-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4">
              Comprar es súper fácil
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              En solo 4 pasos tendrás tu producto favorito en casa
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                paso: "1",
                titulo: "Explora",
                descripcion: "Navega por nuestro catálogo y encuentra el producto perfecto para ti",
                icono: "🔍"
              },
              {
                paso: "2",
                titulo: "Agrega al carrito",
                descripcion: "Selecciona tu producto favorito y agrégalo al carrito de compras",
                icono: "🛒"
              },
              {
                paso: "3",
                titulo: "Paga seguro",
                descripcion: "Completa tu compra con nuestros métodos de pago 100% seguros",
                icono: "💳"
              },
              {
                paso: "4",
                titulo: "Recibe en casa",
                descripcion: "Disfruta de tu nuevo dispositivo con envío gratis a todo el país",
                icono: "📦"
              }
            ].map((paso, index) => (
              <div key={index} className="text-center relative">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl md:text-3xl shadow-lg hover:shadow-xl transition-shadow">
                  {paso.icono}
                </div>
                <div className="absolute top-8 left-2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {paso.paso}
                </div>
                <h3 className="text-lg md:text-xl font-bold text-black mb-2">{paso.titulo}</h3>
                <p className="text-sm md:text-base text-gray-600">{paso.descripcion}</p>

                {index < 3 && (
                  <div className="hidden lg:block absolute top-10 -right-4 w-8 h-0.5 bg-primary-300"></div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-8 md:mt-12">
            <Link href="/catalogo">
              <Button className="bg-primary-500 text-black hover:bg-primary-600 px-8 md:px-12 py-3 md:py-4 rounded-2xl text-base md:text-lg font-bold shadow-lg hover:shadow-xl transition-all">
                Comenzar a comprar
                <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Sección de Métodos de Pago */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4">
              Múltiples formas de pagar
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Elige el método que más te convenga. Todos 100% seguros y protegidos
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 mb-8 md:mb-12">
            {[
              { nombre: "Visa", logo: "💳", color: "bg-blue-100" },
              { nombre: "Mastercard", logo: "💳", color: "bg-red-100" },
              { nombre: "PSE", logo: "🏦", color: "bg-green-100" },
              { nombre: "Efecty", logo: "💰", color: "bg-purple-100" },
              { nombre: "SuperGiros", logo: "🎯", color: "bg-yellow-100" },
              { nombre: "Transferencia", logo: "📱", color: "bg-gray-100" }
            ].map((metodo, index) => (
              <div key={index} className={`${metodo.color} rounded-2xl p-4 md:p-6 text-center hover:shadow-lg transition-shadow`}>
                <div className="text-2xl md:text-3xl mb-2">{metodo.logo}</div>
                <p className="text-sm md:text-base font-medium text-gray-700">{metodo.nombre}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-6 md:p-8 text-center">
            <h3 className="text-xl md:text-2xl font-bold text-black mb-4">Pago 100% Seguro</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="flex items-center justify-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-sm md:text-base text-gray-700">Encriptación SSL</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-sm md:text-base text-gray-700">Protección al comprador</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-sm md:text-base text-gray-700">Devolución garantizada</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Preguntas Frecuentes */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4">
              Preguntas Frecuentes
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Resolvemos todas tus dudas para que compres con total confianza
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
            {[
              {
                pregunta: "¿Los productos tienen garantía?",
                respuesta: "Sí, todos nuestros productos cuentan con garantía oficial del fabricante. Los productos nuevos tienen garantía de 12 meses y los usados de 6 meses."
              },
              {
                pregunta: "¿Cuánto tiempo tarda el envío?",
                respuesta: "El envío es gratuito a todo Colombia. En Bogotá y ciudades principales entregamos en 1-2 días hábiles. Para otras ciudades el tiempo es de 2-4 días hábiles."
              },
              {
                pregunta: "¿Puedo cambiar o devolver un producto?",
                respuesta: "Tienes 30 días para cambios y devoluciones. El producto debe estar en perfectas condiciones con su empaque original."
              },
              {
                pregunta: "¿Los precios incluyen IVA?",
                respuesta: "Sí, todos los precios mostrados en nuestra página incluyen IVA y no hay costos adicionales sorpresa."
              },
              {
                pregunta: "¿Cómo puedo rastrear mi pedido?",
                respuesta: "Una vez confirmado tu pago, recibirás un código de seguimiento por email y WhatsApp para rastrear tu pedido en tiempo real."
              },
              {
                pregunta: "¿Ofrecen soporte técnico?",
                respuesta: "Sí, contamos con soporte técnico especializado disponible por WhatsApp, email y teléfono de lunes a sábado."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl shadow-lg overflow-hidden">
                <details className="group">
                  <summary className="flex items-center justify-between p-6 md:p-8 cursor-pointer hover:bg-gray-100 transition-colors">
                    <h3 className="text-base md:text-lg font-bold text-black pr-4">{faq.pregunta}</h3>
                    <div className="text-primary-500 group-open:rotate-180 transition-transform">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </summary>
                  <div className="px-6 md:px-8 pb-6 md:pb-8">
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed">{faq.respuesta}</p>
                  </div>
                </details>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 md:mt-12">
            <p className="text-gray-600 mb-4">¿No encuentras la respuesta que buscas?</p>
            <a href="https://wa.me/573103003623" target="_blank" rel="noopener noreferrer">
              <Button className="bg-green-500 text-white hover:bg-green-600 px-6 md:px-8 py-3 md:py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all">
                <MessageCircle className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Contáctanos por WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>


      {/* Sección Suscriptor */}
      <section className="py-12 md:py-20 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              ¡No te pierdas nuestras ofertas!
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8">
              Suscríbete y recibe descuentos exclusivos, lanzamientos y ofertas especiales
            </p>

            {registrado ? (
              <div className="flex items-center justify-center space-x-2 text-green-400">
                <Check className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-base font-medium">
                  ¡Registrado exitosamente! Pronto recibirás nuestras ofertas.
                </span>
              </div>
            ) : (
              <form id="formulario" onSubmit={handleNewsletterSubmit} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="text"
                    placeholder="Tu nombre (opcional)"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500"
                    disabled={cargando}
                  />
                  <Input
                    type="email"
                    id="correo"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErr("");
                    }}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500"
                    required
                    disabled={cargando}
                  />
                </div>

                {err && (
                  <p className="text-red-400 text-sm">{err}</p>
                )}
                <Button
                  type="submit"
                  disabled={cargando}
                  className="w-full bg-primary-500 hover:bg-primary-800 text-black font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {cargando ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="animate-spin w-4 h-4 md:w-5 md:h-5 mr-2" />
                      Registrando...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Send className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                      Suscribirse
                    </div>
                  )}
                </Button>
              </form>
            )}
            <p className="text-gray-400 text-sm mt-4">
              📧 Prometemos no enviarte spam. Solo ofertas increíbles.
            </p>
          </div>
        </div>
      </section>

      <Footer />
      <ModalUbicaciones />
    </div>
  )
}
