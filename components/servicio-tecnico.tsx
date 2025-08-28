"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Smartphone,
  Shield,
  Zap,
  CheckCircle,
  Star,
  Wrench,
  Battery,
  Volume2,
  Cpu,
  Bike,
  Car,
  Leaf,
  ArrowRight,
} from "lucide-react"

export default function ServCli() {
  // Servicios destacados
  const servicios = [
    {
      icon: <Smartphone className="w-5 h-5 md:w-7 md:h-7" />,
      titulo: "Cambio de pantalla",
      descripcion: "Pantallas rotas, rayadas o sin respuesta."
    },
    {
      icon: <Battery className="w-5 h-5 md:w-7 md:h-7" />,
      titulo: "Batería nueva",
      descripcion: "Recupera la autonomía de tu equipo."
    },
    {
      icon: <Zap className="w-5 h-5 md:w-7 md:h-7" />,
      titulo: "Remanufacturación de pantalla",
      descripcion: "Soluciona problemas de respuesta táctil o glass."
    },
    {
      icon: <Volume2 className="w-5 h-5 md:w-7 md:h-7" />,
      titulo: "Fallas de audio",
      descripcion: "Micrófono, parlante, auricular."
    },
    {
      icon: <Cpu className="w-5 h-5 md:w-7 md:h-7" />,
      titulo: "Microsoldadura",
      descripcion: "Placas dañadas, IC de carga, encendido."
    },
  ];

  // Beneficios diferenciales
  const beneficios = [
    {
      icon: <Shield className="w-6 h-6 text-primary-500" />,
      titulo: "Garantía real",
      descripcion: "Todas las reparaciones tienen garantía escrita."
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-primary-500" />,
      titulo: "Diagnóstico gratis",
      descripcion: "Revisamos tu equipo sin costo ni compromiso."
    },
    {
      icon: <Star className="w-6 h-6 text-primary-500" />,
      titulo: "Técnicos certificados",
      descripcion: "Solo personal calificado y actualizado."
    },
    {
      icon: <Wrench className="w-6 h-6 text-primary-500" />,
      titulo: "Piezas originales",
      descripcion: "Usamos repuestos de alta calidad."
    },
    {
      icon: <ArrowRight className="w-6 h-6 text-primary-500" />,
      titulo: "Entrega rápida",
      descripcion: "Reparaciones en tiempo récord."
    },
  ];

  // Proceso de atención
  const pasos = [
    {
      icon: "1",
      titulo: "Diagnóstico",
      descripcion: "Trae tu equipo o agenda por WhatsApp."
    },
    {
      icon: "2",
      titulo: "Cotización clara",
      descripcion: "Te informamos el valor y tiempo real."
    },
    {
      icon: "3",
      titulo: "Reparación profesional",
      descripcion: "Solo técnicos certificados y piezas originales."
    },
    {
      icon: "4",
      titulo: "Entrega y garantía",
      descripcion: "Recibe tu equipo como nuevo y con garantía."
    },
  ];

  // Preguntas frecuentes
  const faqs = [
    {
      pregunta: "¿Cuánto tarda la reparación?",
      respuesta: "La mayoría de reparaciones se entregan el mismo día. Si requiere más tiempo, te avisamos con claridad."
    },
    {
      pregunta: "¿Pierdo mi información?",
      respuesta: "No, cuidamos tus datos y te asesoramos para hacer backup si es necesario."
    },
    {
      pregunta: "¿Qué garantía ofrecen?",
      respuesta: "Todas las reparaciones tienen garantía escrita y soporte post-servicio."
    },
    {
      pregunta: "¿Puedo cotizar por WhatsApp?",
      respuesta: "¡Claro! Haz clic en cualquier botón de WhatsApp y te atendemos al instante."
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* HERO PRINCIPAL */}
      <header className="relative overflow-hidden bg-gradient-to-r from-black via-primary-900/20 to-black py-14 md:py-24">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative container mx-auto px-4 text-center z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-primary-500 mb-4 leading-tight drop-shadow-lg animate-bounce">
            ¡Repara tu celular hoy con expertos!
          </h1>
          <p className="text-lg md:text-2xl text-white/80 max-w-2xl mx-auto mb-8 animate-fadeIn">
            Diagnóstico gratis, repuestos originales y garantía real. Más de 5.000 clientes satisfechos.
          </p>
          <a href="https://wa.me/573103003623" target="_blank" rel="noopener noreferrer">
            <Button className="bg-primary-500 hover:bg-primary-600 text-black font-bold text-lg px-8 py-4 rounded-2xl shadow-lg transition-all duration-200 animate-bounce">
              Solicita tu diagnóstico gratis por WhatsApp
            </Button>
          </a>
          <div className="mt-8 animate-fadeIn">
            <img
              src="/assets/banner_microSol.jpg"
              alt="Servicio técnico profesional"
              className="mx-auto rounded-2xl shadow-2xl border-4 border-primary-400 w-full max-w-md md:max-w-xl"
            />
          </div>
        </div>
      </header>

      {/* BENEFICIOS DIFERENCIALES */}
      <section className="py-10 md:py-16 bg-gradient-to-r from-black via-gray-900 to-black">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8 text-center">
            {beneficios.map((b, i) => (
              <div key={i} className="flex flex-col items-center justify-center p-4">
                {b.icon}
                <h4 className="text-white font-bold mt-2 mb-1 text-base md:text-lg">{b.titulo}</h4>
                <p className="text-gray-400 text-xs md:text-sm">{b.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICIOS DESTACADOS */}
      <section className="py-12 md:py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-10 text-center">
            ¿Qué podemos reparar por ti?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {servicios.map((serv, i) => (
              <Card key={i} className="bg-gradient-to-br from-primary-500/10 to-gray-900 border-primary-500/40 hover:border-primary-400/80 transition-all duration-400 hover:scale-105 shadow-lg">
                <CardHeader className="p-6 flex flex-col items-center">
                  <div className="p-3 bg-primary-500/30 rounded-full text-primary-500 mb-2">
                    {serv.icon}
                  </div>
                  <CardTitle className="text-white text-lg font-bold text-center">{serv.titulo}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 text-center">
                  <p className="text-gray-300 text-base">{serv.descripcion}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESO DE ATENCIÓN con fondo parallax y burbujas animadas */}
      <section
        className="relative py-12 md:py-20 overflow-hidden"
        style={{
          background: 'linear-gradient(to right, var(--color-primary-900), #000)',
        }}
      >
        {/* Imagen de fondo parallax */}
        <div
          className="absolute inset-0 w-full h-full z-0 bg-center bg-cover bg-no-repeat"
          style={{
            backgroundImage: "url('/assets/STlado.jpg')",
            backgroundAttachment: 'fixed',
            opacity: 0.13,
          }}
          aria-hidden="true"
        ></div>

        {/* Burbujas animadas con blur */}
        <div className="pointer-events-none absolute inset-0 z-10">
          {[...Array(10)].map((_, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-primary-400/30 blur-2xl animate-burbuja"
              style={{
                width: `${28 + Math.random() * 40}px`,
                height: `${28 + Math.random() * 40}px`,
                left: `${Math.random() * 95}%`,
                top: `${Math.random() * 90}%`,
                animationDuration: `${7 + Math.random() * 7}s`,
                animationDelay: `${-Math.random() * 7}s`,
              }}
            />
          ))}
        </div>

        {/* Contenido principal */}
        <div className="relative z-20 container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-10 text-center drop-shadow-lg">
            Así de fácil es reparar con nosotros
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {pasos.map((paso, i) => (
              <div key={i} className="bg-gradient-to-br from-primary-500/10 to-gray-900 rounded-2xl p-6 flex flex-col items-center shadow-lg">
                <div className="w-12 h-12 flex items-center justify-center bg-primary-500 text-black font-bold rounded-full text-2xl mb-3">{paso.icon}</div>
                <h4 className="text-white font-bold mb-1 text-lg text-center">{paso.titulo}</h4>
                <p className="text-gray-400 text-sm text-center">{paso.descripcion}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Animación de burbujas personalizada */}
        <style jsx>{`
          @keyframes burbuja {
            0% {
              transform: translateY(0) scale(1);
              opacity: 0.7;
            }
            50% {
              opacity: 1;
            }
            100% {
              transform: translateY(-120px) scale(1.2);
              opacity: 0.5;
            }
          }
          .animate-burbuja {
            animation-name: burbuja;
            animation-iteration-count: infinite;
            animation-timing-function: ease-in-out;
          }
        `}</style>
      </section>

      {/* PREGUNTAS FRECUENTES */}
      <section className="py-12 md:py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-10 text-center">
            Preguntas frecuentes
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <Card key={i} className="bg-gradient-to-br from-gray-800 to-black border-primary-400/20">
                <CardHeader className="p-4 flex items-center cursor-pointer">
                  <CardTitle className="text-base md:text-lg text-primary-400 font-bold">
                    {faq.pregunta}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 text-gray-300">
                  {faq.respuesta}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* LLAMADO A LA ACCIÓN FINAL con fondo parallax y burbujas animadas */}
      <section
        className="relative py-12 md:py-20 px-4 overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom, var(--color-primary-900), #000)',
        }}
      >
        {/* Imagen de fondo parallax */}
        <div
          className="absolute inset-0 w-full h-full z-0 bg-center bg-cover bg-no-repeat"
          style={{
            backgroundImage: "url('/assets/banner_microSol.jpg')",
            backgroundAttachment: 'fixed',
            opacity: 0.18,
          }}
          aria-hidden="true"
        ></div>

        {/* Burbujas animadas con blur */}
        <div className="pointer-events-none absolute inset-0 z-10">
          {[...Array(12)].map((_, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-primary-400/30 blur-2xl animate-burbuja"
              style={{
                width: `${32 + Math.random() * 48}px`,
                height: `${32 + Math.random() * 48}px`,
                left: `${Math.random() * 95}%`,
                top: `${Math.random() * 90}%`,
                animationDuration: `${8 + Math.random() * 8}s`,
                animationDelay: `${-Math.random() * 8}s`,
              }}
            />
          ))}
        </div>

        {/* Contenido principal */}
        <div className="relative z-20 container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-400 mb-6 drop-shadow-lg">¿Listo para reparar tu equipo?</h2>
          <p className="text-lg md:text-xl text-white mb-8 drop-shadow">Agenda tu diagnóstico gratis o cotiza por WhatsApp. ¡Tu celular merece lo mejor!</p>
          <a href="https://wa.me/573103003623" target="_blank" rel="noopener noreferrer">
            <Button className="bg-primary-500 hover:bg-primary-600 text-black font-bold text-lg px-8 py-4 rounded-2xl shadow-lg transition-all duration-200 animate-bounce">
              Solicitar diagnóstico gratis por WhatsApp
            </Button>
          </a>
        </div>

        {/* Animación de burbujas personalizada */}
        <style jsx>{`
          @keyframes burbuja {
            0% {
              transform: translateY(0) scale(1);
              opacity: 0.7;
            }
            50% {
              opacity: 1;
            }
            100% {
              transform: translateY(-120px) scale(1.2);
              opacity: 0.5;
            }
          }
          .animate-burbuja {
            animation-name: burbuja;
            animation-iteration-count: infinite;
            animation-timing-function: ease-in-out;
          }
        `}</style>
      </section>
    </div>
  );
}
