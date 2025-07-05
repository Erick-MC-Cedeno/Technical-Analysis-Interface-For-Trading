import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign } from "lucide-react"

export default function PriceCard({ precio, decimales, symbol }) {
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
          <div className="text-xs text-trading-dark-300 font-mono">{symbol}</div>
        </div>
      </CardContent>
    </Card>
  )
}
