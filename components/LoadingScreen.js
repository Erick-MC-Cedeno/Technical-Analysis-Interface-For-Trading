import { Card } from "@/components/ui/card"
import { RefreshCw } from "lucide-react"

export default function LoadingScreen({ moneda }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 flex items-center justify-center">
      <Card className="bg-white/10 backdrop-blur-sm border-purple-300/30 p-8">
        <div className="text-center text-white">
          <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">🔃 Cargando análisis...</h2>
          <p className="text-purple-200">Procesando datos de {moneda.nombre}</p>
        </div>
      </Card>
    </div>
  )
}
