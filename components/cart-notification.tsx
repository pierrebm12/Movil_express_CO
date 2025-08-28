"use client"

import { useEffect, useState } from "react"
import { CheckCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CartNotificationProps {
  show: boolean
  message: string
  onClose: () => void
}

export function CartNotification({ show, message, onClose }: CartNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300) // Esperar a que termine la animación
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!show && !isVisible) return null

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div className="bg-white border border-green-200 rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">¡Producto agregado!</p>
            <p className="text-xs text-gray-600">{message}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)} className="p-1 h-auto">
            <X className="w-4 h-4 text-gray-400" />
          </Button>
        </div>
      </div>
    </div>
  )
}
