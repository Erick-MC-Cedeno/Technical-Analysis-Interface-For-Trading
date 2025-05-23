"use client"

import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Header({ moneda, ultimaActualizacion, onActualizar, onCambiarMoneda }) {
  return (
    <Card className="mb-6 bg-gradient-to-r from-purple-600 to-pink-600 border-0">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <span className="text-4xl">{moneda.icon}</span>
            <div>
              <h1 className="text-3xl font-bold text-white">
                {moneda.nombre} ({moneda.symbol})
              </h1>
              <p className="text-purple-100">⏰ Última actualización: {ultimaActualizacion}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button onClick={onActualizar} className="bg-white/20 hover:bg-white/30">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
            <Button
              onClick={onCambiarMoneda}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/20"
            >
              Cambiar Moneda
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
