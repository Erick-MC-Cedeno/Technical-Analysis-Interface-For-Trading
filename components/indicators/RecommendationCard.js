import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, TrendingDown, Minus } from "lucide-react"

export default function RecommendationCard({ recomendacion, buySignals, sellSignals, neutralSignals }) {
  const getRecommendationIcon = (rec) => {
    switch (rec) {
      case "COMPRA":
        return <TrendingUp className="h-4 w-4 mr-2" />
      case "VENTA":
        return <TrendingDown className="h-4 w-4 mr-2" />
      default:
        return <Minus className="h-4 w-4 mr-2" />
    }
  }

  const getRecommendationColorPro = (rec) => {
    switch (rec) {
      case "COMPRA":
        return "bg-trading-green-600 hover:bg-trading-green-700"
      case "VENTA":
        return "bg-trading-red-600 hover:bg-trading-red-700"
      default:
        return "bg-trading-dark-600 hover:bg-trading-dark-500"
    }
  }

  return (
    <Card className="trading-card">
      <CardHeader>
        <CardTitle className="text-white flex items-center font-mono">
          <BarChart3 className="h-5 w-5 mr-2 text-trading-blue-500" />
          MARKET SIGNAL
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Badge
            className={`text-lg px-4 py-2 ${getRecommendationColorPro(recomendacion)} text-white font-mono flex items-center w-fit`}
          >
            {getRecommendationIcon(recomendacion)}
            {recomendacion}
          </Badge>

          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            <div className="text-center p-2 bg-trading-green-600/20 rounded border border-trading-green-600/30">
              <div className="text-trading-green-400 font-bold">{buySignals}</div>
              <div className="text-trading-green-300">BUY</div>
            </div>
            <div className="text-center p-2 bg-trading-red-600/20 rounded border border-trading-red-600/30">
              <div className="text-trading-red-400 font-bold">{sellSignals}</div>
              <div className="text-trading-red-300">SELL</div>
            </div>
            <div className="text-center p-2 bg-trading-dark-600/20 rounded border border-trading-dark-600/30">
              <div className="text-trading-dark-200 font-bold">{neutralSignals}</div>
              <div className="text-trading-dark-300">HOLD</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
