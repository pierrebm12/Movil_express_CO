"use client"
export const dynamic = "force-dynamic";

import { XCircle, RefreshCw, Home, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"

export default function CheckoutFailurePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="rounded-2xl shadow-lg border-0 overflow-hidden">
            <CardContent className="p-0">
              {/* Header de error */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-8 text-white">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-12 h-12 text-red-500" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Pago No Procesado</h1>
                <p className="text-red-100">Hubo un problema al procesar tu pago</p>
              </div>

              {/* Contenido */}
              <div className="p-8">
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-black mb-4">¿Qué puedes hacer?</h2>
                  <div className="space-y-4 text-left">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <h3 className="font-medium text-black mb-2">Posibles causas:</h3>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Fondos insuficientes en tu cuenta</li>
                        <li>• Datos de la tarjeta incorrectos</li>
                        <li>• Límite de compra excedido</li>
                        <li>• Problemas temporales con el banco</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-xl">
                      <h3 className="font-medium text-black mb-2">Recomendaciones:</h3>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Verifica los datos de tu tarjeta</li>
                        <li>• Contacta a tu banco si es necesario</li>
                        <li>• Intenta con otro método de pago</li>
                        <li>• Contacta nuestro soporte si persiste el problema</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Link href="/checkout">
                    <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-500 py-3 text-lg font-bold rounded-2xl">
                      <RefreshCw className="w-5 h-5 mr-2" />
                      Intentar Nuevamente
                    </Button>
                  </Link>

                  <div className="grid grid-cols-2 gap-4">
                    <Link href="/">
                      <Button variant="outline" className="w-full py-3 font-bold rounded-2xl">
                        <Home className="w-5 h-5 mr-2" />
                        Inicio
                      </Button>
                    </Link>

                    <Button variant="outline" className="w-full py-3 font-bold rounded-2xl">
                      <HelpCircle className="w-5 h-5 mr-2" />
                      Ayuda
                    </Button>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                  <h3 className="font-bold text-black mb-2">¿Necesitas ayuda?</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    Nuestro equipo de soporte está disponible 24/7 para ayudarte
                  </p>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>WhatsApp:</strong> +57 300 123 4567
                    </p>
                    <p>
                      <strong>Email:</strong> soporte@movilexpress.com
                    </p>
                    <p>
                      <strong>Teléfono:</strong> +57 1 234-5678
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
