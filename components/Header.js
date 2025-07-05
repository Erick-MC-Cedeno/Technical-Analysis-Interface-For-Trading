"use client"

import { RefreshCw, ArrowLeft, Activity, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Header({ moneda, ultimaActualizacion, onActualizar, onCambiarMoneda }) {
  return (
    <Card className="mb-6 header-gradient">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <span className="text-4xl">{moneda.icon}</span>
              <TrendingUp className="absolute -top-1 -right-1 h-4 w-4 text-trading-green-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white font-mono flex items-center">
                {moneda.symbol}
                <Activity className="h-6 w-6 ml-2 text-trading-green-500 animate-pulse" />
              </h1>
              <p className="text-trading-dark-200 font-mono text-sm">Last Update: {ultimaActualizacion}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button onClick={onActualizar} className="trading-button">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
            <Button onClick={onCambiarMoneda} className="trading-button-secondary">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Change Pair
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
