import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utilidades para colores dinámicos
export const colorVariants = {
  primary: {
    50: "bg-primary-50 text-primary-900",
    100: "bg-primary-100 text-primary-900",
    200: "bg-primary-200 text-primary-900",
    300: "bg-primary-300 text-black",
    400: "bg-primary-400 text-black",
    500: "bg-primary-500 text-white",
    600: "bg-primary-600 text-white",
    700: "bg-primary-700 text-white",
    800: "bg-primary-800 text-white",
    900: "bg-primary-900 text-white",
  },
  secondary: {
    50: "bg-secondary-50 text-secondary-900",
    100: "bg-secondary-100 text-secondary-900",
    200: "bg-secondary-200 text-secondary-900",
    300: "bg-secondary-300 text-secondary-900",
    400: "bg-secondary-400 text-white",
    500: "bg-secondary-500 text-white",
    600: "bg-secondary-600 text-white",
    700: "bg-secondary-700 text-white",
    800: "bg-secondary-800 text-white",
    900: "bg-secondary-900 text-white",
  },
  accent: {
   50: "bg-secondary-50 text-secondary-900",
    100: "bg-secondary-100 text-secondary-900",
    200: "bg-secondary-200 text-secondary-900",
    300: "bg-secondary-300 text-secondary-900",
    400: "bg-accent-400 text-white",
    500: "bg-accent-500 text-white",
    600: "bg-accent-600 text-white",
    700: "bg-accent-700 text-white",
    800: "bg-accent-800 text-white",
    900: "bg-accent-900 text-white",
  },
}

// Utilidades para tamaños responsivos
export const responsiveContainer = {
  xs: "max-w-xs mx-auto px-4",
  sm: "max-w-sm mx-auto px-4",
  md: "max-w-md mx-auto px-4",
  lg: "max-w-lg mx-auto px-4",
  xl: "max-w-xl mx-auto px-4",
  "2xl": "max-w-2xl mx-auto px-4",
  "3xl": "max-w-3xl mx-auto px-4",
  "4xl": "max-w-4xl mx-auto px-4",
  "5xl": "max-w-5xl mx-auto px-4",
  "6xl": "max-w-6xl mx-auto px-4",
  "7xl": "max-w-7xl mx-auto px-4",
  full: "w-full px-4",
}

// Utilidades para animaciones
export const animations = {
  fadeIn: "animate-fade-in",
  slideUp: "animate-slide-up",
  slideDown: "animate-slide-down",
  scaleIn: "animate-scale-in",
  bounce: "animate-bounce-slow",
  pulse: "animate-pulse-slow",
  float: "animate-float",
}

// Utilidades para sombras
export const shadows = {
  card: "shadow-card",
  cardHover: "shadow-card-hover",
  glow: "shadow-glow",
  glowLg: "shadow-glow-lg",
  none: "shadow-none",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
  "2xl": "shadow-2xl",
}

// Utilidades para gradientes
export const gradients = {
  primary: "gradient-primary",
  dark: "gradient-dark",
  hero: "gradient-hero",
  text: "gradient-text",
}

// Utilidades para efectos de vidrio
export const glassEffects = {
  light: "glass",
  dark: "glass-dark",
  effect: "glass-effect",
}

// Utilidades para bordes redondeados
export const borderRadius = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
  "4xl": "rounded-4xl",
  "5xl": "rounded-5xl",
  full: "rounded-full",
}

// Utilidades para transiciones
export const transitions = {
  none: "transition-none",
  all: "transition-all duration-200",
  colors: "transition-colors duration-200",
  opacity: "transition-opacity duration-200",
  shadow: "transition-shadow duration-200",
  transform: "transition-transform duration-200",
  smooth: "smooth-transition",
}

// Función para generar clases de botón
export function buttonVariants({
  variant = "primary",
  size = "md",
  className = "",
}: {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive"
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}) {
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"

  const variants = {
    primary: "bg-primary-300 text-black hover:bg-primary-400 focus:ring-primary-300 shadow-sm hover:shadow-md",
    secondary: "bg-secondary-100 text-secondary-900 hover:bg-secondary-200 focus:ring-secondary-300",
    outline:
      "border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-primary-300 focus:ring-primary-300",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-300",
    destructive: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-300",
  }

  const sizes = {
    sm: "px-3 py-2 text-sm rounded-lg",
    md: "px-4 py-2 text-base rounded-xl",
    lg: "px-6 py-3 text-lg rounded-xl",
    xl: "px-8 py-4 text-xl rounded-2xl",
  }

  return cn(baseClasses, variants[variant], sizes[size], className)
}

// Función para generar clases de card
export function cardVariants({
  variant = "default",
  padding = "md",
  className = "",
}: {
  variant?: "default" | "elevated" | "outlined" | "glass"
  padding?: "none" | "sm" | "md" | "lg" | "xl"
  className?: string
}) {
  const baseClasses = "bg-white rounded-2xl transition-all duration-300"

  const variants = {
    default: "shadow-card hover:shadow-card-hover",
    elevated: "shadow-lg hover:shadow-xl",
    outlined: "border-2 border-gray-200 hover:border-primary-300",
    glass: "glass border border-white/20",
  }

  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-12",
  }

  return cn(baseClasses, variants[variant], paddings[padding], className)
}

// Función para formatear precios
export function formatPrice(price: number, currency = "COP"): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
     maximumFractionDigits: 0,
  }).format(price)
}

// Función para calcular descuentos
export function calculateDiscount(originalPrice: number, currentPrice: number): number {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
}

// Función para truncar texto
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

// Función para generar slugs
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

// Función para validar email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Función para validar teléfono colombiano
export function isValidColombianPhone(phone: string): boolean {
  const phoneRegex = /^(\+57|57)?[1-9]\d{9}$/
  return phoneRegex.test(phone.replace(/\s/g, ""))
}

// Función para formatear teléfono
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "")
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
  }
  return phone
}

// Función para generar colores aleatorios
export function getRandomColor(): string {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-orange-500",
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

// Función para debounce
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Función para throttle
export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
