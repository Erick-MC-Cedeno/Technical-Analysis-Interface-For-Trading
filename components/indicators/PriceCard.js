import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign } from "lucide-react"

export default function PriceCard({ precio, decimales, symbol }) {
  return (
    <Card className="bg-white/10 backdrop-blur-sm border-purple-300/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <DollarSign className="h-5 w-5 mr-2" />
          Precio Actual
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-white">
          {precio.toFixed(decimales)} {symbol.slice(0, 3)}
        </div>
      </CardContent>
    </Card>
  )
}
