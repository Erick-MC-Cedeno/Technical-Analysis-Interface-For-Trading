"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, BarChart3 } from "lucide-react"

export default function CoinSelector({ monedas, onSelect }) {
  return (
    <div className="min-h-screen trading-gradient p-4">
      <div className="max-w-4xl mx-auto">
        {/* Professional Header */}
        <Card className="mb-8 header-gradient">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <TrendingUp className="h-12 w-12 text-trading-green-500 mr-4" />
              <div>
                <h1 className="text-4xl font-bold text-white mb-2 font-mono">TRADING TERMINAL</h1>
                <p className="text-trading-dark-200 font-mono">Professional Technical Analysis Platform</p>
              </div>
            </div>
            <div className="flex items-center justify-center text-trading-dark-300 text-sm font-mono">
              <BarChart3 className="h-4 w-4 mr-2" />
              <span>Real-time Market Data & Advanced Indicators</span>
            </div>
          </CardContent>
        </Card>

        {/* Asset Selection */}
        <Card className="trading-card">
          <CardHeader>
            <CardTitle className="text-white text-center text-2xl font-mono flex items-center justify-center">
              <BarChart3 className="h-6 w-6 mr-3 text-trading-green-500" />
              SELECT TRADING PAIR
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(monedas).map(([key, moneda]) => (
              <Button
                key={key}
                onClick={() => onSelect(key)}
                className="w-full h-16 text-lg trading-button-secondary justify-start group"
                variant="outline"
              >
                <div className="flex items-center w-full">
                  <span className="text-3xl mr-4">{moneda.icon}</span>
                  <div className="flex-1 text-left">
                    <div className="font-bold text-white group-hover:text-trading-green-400 transition-colors">
                      {moneda.symbol}
                    </div>
                    <div className="text-sm text-trading-dark-300 font-mono">{moneda.nombre}</div>
                  </div>
                  <TrendingUp className="h-5 w-5 text-trading-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
