"use client"

import { useState } from "react"
import CoinSelector from "@/components/CoinSelector"
import Dashboard from "@/components/Dashboard"

// Configuración de monedas
type Moneda = {
  nombre: string
  symbol: string
  icon: string
}

const MONEDAS: Record<string, Moneda> = {
  1: { nombre: "Ethereum", symbol: "ETHUSDT", icon: "⟠" },
  2: { nombre: "Pepe", symbol: "PEPEUSDT", icon: "🐸" },
  3: { nombre: "Solana", symbol: "SOLUSDT", icon: "◎" },
  4: { nombre: "Bitcoin", symbol: "BTCUSDT", icon: "₿" },
}

export default function CryptoTradingApp() {
  const [monedaSeleccionada, setMonedaSeleccionada] = useState<Moneda | null>(null)

  const seleccionarMoneda = (key: string) => {
    const moneda = MONEDAS[key]
    setMonedaSeleccionada(moneda ?? null)
  }
  const cambiarMoneda = () => {
    setMonedaSeleccionada(null)
  }

  // Renderizado condicional basado en el estado
  if (!monedaSeleccionada) {
    return <CoinSelector monedas={MONEDAS} onSelect={seleccionarMoneda} />
  }

  return (
    <Dashboard
      moneda={monedaSeleccionada}
      onCambiarMoneda={cambiarMoneda}
    />
  )
}
