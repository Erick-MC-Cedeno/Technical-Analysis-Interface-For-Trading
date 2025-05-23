import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3 } from "lucide-react"
import { getRecommendationColor } from "@/utils/dataUtils"

export default function RecommendationCard({ recomendacion, buySignals, sellSignals, neutralSignals }) {
  return (
    <Card className="bg-white/10 backdrop-blur-sm border-purple-300/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          Recomendación
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Badge className={`text-lg px-4 py-2 ${getRecommendationColor(recomendacion)} text-white`}>
          📊 {recomendacion}
        </Badge>
        <div className="mt-4 text-purple-200">
          <span className="text-green-400">▲ {buySignals} Compra</span> -
          <span className="text-red-400"> ▼ {sellSignals} Venta</span> -
          <span className="text-gray-300"> 🔄 {neutralSignals} Neutral</span>
        </div>
      </CardContent>
    </Card>
  )
}
