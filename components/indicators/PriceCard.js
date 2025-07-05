import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react"

export default function PriceCard({ precio, decimales, symbol }) {
  // Simulate price change for demo
  const priceChange = (Math.random() - 0.5) * 5
  const isPositive = priceChange > 0

  return (
    <Card className="trading-card">
      <CardHeader>
        <CardTitle className="text-white flex items-center font-mono">
          <DollarSign className="h-5 w-5 mr-2 text-trading-green-500" />
          CURRENT PRICE
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-3xl font-bold text-white font-mono">${precio.toFixed(decimales)}</div>
          <div
            className={`flex items-center text-sm font-mono ${
              isPositive ? "text-trading-green-400" : "text-trading-red-400"
            }`}
          >
            {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
            {isPositive ? "+" : ""}
            {priceChange.toFixed(2)}% (24h)
          </div>
          <div className="text-xs text-trading-dark-300 font-mono">{symbol}</div>
        </div>
      </CardContent>
    </Card>
  )
}
