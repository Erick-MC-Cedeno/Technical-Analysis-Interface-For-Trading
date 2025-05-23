"use client"

import { useState } from "react"
import CoinSelector from "./components/CoinSelector"
import LoadingScreen from "./components/LoadingScreen"
import Dashboard from "./components/Dashboard"
import { generarDatosMock } from "./utils/dataUtils"

// Configuración de monedas
const MONEDAS = {
  1: { nombre: "Ethereum", symbol: "ETHUSDT", icon: "⟠" },
  2: { nombre: "Pepe", symbol: "PEPEUSDT", icon: "🐸" },
  3: { nombre: "Solana", symbol: "SOLUSDT", icon: "◎" },
  4: { nombre: "Bitcoin", symbol: "BTCUSDT", icon: "₿" },
}

export default function App() {
  const [monedaSeleccionada, setMonedaSeleccionada] = useState(null)
  const [datos, setDatos] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [ultimaActualizacion, setUltimaActualizacion] = useState(null)

  const cargarAnalisis = async (moneda) => {
    setCargando(true)

    // Simular carga de datos
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const nuevosDatos = generarDatosMock(moneda.symbol)
    setDatos(nuevosDatos)
    setUltimaActualizacion(new Date().toLocaleString())
    setCargando(false)
  }

  const seleccionarMoneda = (key) => {
    const moneda = MONEDAS[key]
    setMonedaSeleccionada(moneda)
    cargarAnalisis(moneda)
  }

  const actualizarDatos = () => {
    if (monedaSeleccionada) {
      cargarAnalisis(monedaSeleccionada)
    }
  }

  const cambiarMoneda = () => {
    setMonedaSeleccionada(null)
    setDatos(null)
  }

  // Renderizado condicional basado en el estado
  if (!monedaSeleccionada) {
    return <CoinSelector monedas={MONEDAS} onSelect={seleccionarMoneda} />
  }

  if (cargando) {
    return <LoadingScreen moneda={monedaSeleccionada} />
  }

  return (
    <Dashboard
      moneda={monedaSeleccionada}
      datos={datos}
      ultimaActualizacion={ultimaActualizacion}
      onActualizar={actualizarDatos}
      onCambiarMoneda={cambiarMoneda}
    />
  )
}
