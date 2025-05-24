"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function CoinSelector({ monedas, onSelect }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Banner */}
        <Card className="mb-8 bg-gradient-to-r from-purple-600 to-pink-600 border-0">
          <CardContent className="p-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-2">Trading Bot</h1>
            <p className="text-purple-100">Creado por Erick Cedeno</p>
          </CardContent>
        </Card>

        {/* Selección de Moneda */}
        <Card className="bg-white/10 backdrop-blur-sm border-purple-300/30">
          <CardHeader>
            <CardTitle className="text-white text-center text-2xl">💰 SELECCIÓN DE CRIPTOMONEDA</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(monedas).map(([key, moneda]) => (
              <Button
                key={key}
                onClick={() => onSelect(key)}
                className="w-full h-16 text-lg bg-purple-600 hover:bg-purple-500 text-white"
                variant="default"
              >
                <span className="text-2xl mr-3">{moneda.icon}</span>
                {key}. {moneda.nombre} ({moneda.symbol.slice(0, 3)})
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
