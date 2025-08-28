import type { Metadata } from 'next'
import { Inter } from "next/font/google"
import './globals.css'


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'Movil Express - Tecnología Móvil al Mejor Precio | Celulares, Smartphones y Accesorios',
  description: 'Descubre la mejor tecnología móvil en Movil Express. Celulares nuevos y usados, smartphones, tablets, smartwatches y accesorios con garantía. Envío gratis a toda Colombia. ¡Los mejores precios del mercado!',
  keywords: 'celulares, smartphones, iPhone, Samsung, tecnología móvil, tablets, smartwatches, accesorios móviles, Colombia, Bogotá, Medellín, Cali, envío gratis, garantía',
  authors: [{ name: 'Movil Express' }],
  creator: 'Pierre Buitrago - Fullstack Developer',
  publisher: 'Movil Express',
  robots: 'index, follow',
  generator: 'Next.js',
  icons: {
    icon: '/favico.ico',
    shortcut: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: 'https://movilexpress.com',
    siteName: 'Movil Express',
    title: 'Movil Express - Tecnología Móvil al Mejor Precio',
    description: 'Descubre la mejor tecnología móvil con garantía y envío gratis a toda Colombia. Los mejores precios del mercado.',
    images: [
      {
        url: '/assets/logos/logosinFondo.PNG',
        width: 1200,
        height: 630,
        alt: 'Movil Express - Tecnología Móvil',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Movil Express - Tecnología Móvil al Mejor Precio',
    description: 'Descubre la mejor tecnología móvil con garantía y envío gratis a toda Colombia.',
    images: ['/assets/logos/logosinFondo.PNG'],
  },
}

export const viewport = 'width=device-width, initial-scale=1';
export const themeColor = '#988443';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <head>
        <script src="https://checkout.bold.co/library/boldPaymentButton.js"></script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
