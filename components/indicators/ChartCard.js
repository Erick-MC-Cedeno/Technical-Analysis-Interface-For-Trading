import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from "recharts"

export default function ChartCard({ title, icon, data, type, currentValue, datos }) {
  const renderChart = () => {
    switch (type) {
      case "rsi":
        // Generar datos históricos basados en el RSI actual
        const rsiChartData = Array.from({ length: 14 }, (_, i) => {
          const variation = (Math.random() - 0.5) * 10 // Variación de ±5 puntos
          const rsiValue = Math.max(0, Math.min(100, datos.rsi + variation))
          return {
            name: `T-${13 - i}`,
            rsi: rsiValue,
          }
        })
        // Asegurar que el último punto sea el RSI actual
        rsiChartData[rsiChartData.length - 1].rsi = datos.rsi

        return (
          <div className="space-y-4">
            {/* Numerical Values */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-trading-dark-700 p-3 rounded border border-trading-dark-600">
                <div className="text-xs text-trading-dark-300 font-mono mb-1">RSI (14)</div>
                <div
                  className={`text-xl font-bold font-mono ${
                    datos.rsi > 70
                      ? "text-trading-red-400"
                      : datos.rsi < 30
                        ? "text-trading-green-400"
                        : "text-trading-blue-400"
                  }`}
                >
                  {datos.rsi.toFixed(2)}
                </div>
                <div className="text-xs text-trading-dark-300 font-mono">
                  {datos.rsi > 70 ? "Overbought" : datos.rsi < 30 ? "Oversold" : "Neutral"}
                </div>
              </div>
              <div className="bg-trading-dark-700 p-3 rounded border border-trading-dark-600">
                <div className="text-xs text-trading-dark-300 font-mono mb-1">Stoch RSI</div>
                <div
                  className={`text-xl font-bold font-mono ${
                    datos.rsiStoch > 80
                      ? "text-trading-red-400"
                      : datos.rsiStoch < 20
                        ? "text-trading-green-400"
                        : "text-trading-blue-400"
                  }`}
                >
                  {datos.rsiStoch.toFixed(2)}
                </div>
                <div className="text-xs text-trading-dark-300 font-mono">
                  {datos.rsiStoch > 80 ? "Overbought" : datos.rsiStoch < 20 ? "Oversold" : "Neutral"}
                </div>
              </div>
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={rsiChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                <XAxis dataKey="name" tick={{ fill: "#a3a3a3", fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fill: "#a3a3a3", fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #404040",
                    borderRadius: "4px",
                    color: "#fff",
                  }}
                />
                <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="2 2" />
                <ReferenceLine y={30} stroke="#10b981" strokeDasharray="2 2" />
                <Line type="monotone" dataKey="rsi" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )

      case "macd":
        // Generar datos históricos basados en MACD actual
        const macdChartData = Array.from({ length: 14 }, (_, i) => {
          const macdVariation = (Math.random() - 0.5) * Math.abs(datos.macdValue) * 0.3
          const signalVariation = (Math.random() - 0.5) * Math.abs(datos.macdSignal) * 0.3
          return {
            name: `T-${13 - i}`,
            macd: datos.macdValue + macdVariation,
            signal: datos.macdSignal + signalVariation,
          }
        })
        // Asegurar que el último punto sean los valores actuales
        macdChartData[macdChartData.length - 1] = {
          name: "T-0",
          macd: datos.macdValue,
          signal: datos.macdSignal,
        }

        return (
          <div className="space-y-4">
            {/* Numerical Values */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-trading-dark-700 p-3 rounded border border-trading-dark-600">
                <div className="text-xs text-trading-dark-300 font-mono mb-1">MACD Line</div>
                <div
                  className={`text-xl font-bold font-mono ${
                    datos.macdValue > 0 ? "text-trading-green-400" : "text-trading-red-400"
                  }`}
                >
                  {datos.macdValue.toFixed(4)}
                </div>
                <div className="text-xs text-trading-dark-300 font-mono">
                  {datos.macdValue > 0 ? "Bullish" : "Bearish"}
                </div>
              </div>
              <div className="bg-trading-dark-700 p-3 rounded border border-trading-dark-600">
                <div className="text-xs text-trading-dark-300 font-mono mb-1">Signal Line</div>
                <div
                  className={`text-xl font-bold font-mono ${
                    datos.macdSignal > 0 ? "text-trading-green-400" : "text-trading-red-400"
                  }`}
                >
                  {datos.macdSignal.toFixed(4)}
                </div>
                <div className="text-xs text-trading-dark-300 font-mono">
                  Histogram: {(datos.macdValue - datos.macdSignal).toFixed(4)}
                </div>
              </div>
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={macdChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                <XAxis dataKey="name" tick={{ fill: "#a3a3a3", fontSize: 10 }} />
                <YAxis tick={{ fill: "#a3a3a3", fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #404040",
                    borderRadius: "4px",
                    color: "#fff",
                  }}
                />
                <ReferenceLine y={0} stroke="#525252" />
                <Line type="monotone" dataKey="macd" stroke="#10b981" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="signal" stroke="#ef4444" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )

      case "bollinger":
        // Generar datos históricos basados en las Bollinger Bands actuales
        const bbChartData = Array.from({ length: 14 }, (_, i) => {
          const priceVariation = (Math.random() - 0.5) * datos.precio * 0.02 // ±2% variación
          const bandVariation = (Math.random() - 0.5) * datos.precio * 0.01 // ±1% variación para bandas

          return {
            name: `T-${13 - i}`,
            upper: datos.bbUpper + bandVariation,
            middle: datos.bbMiddle + priceVariation * 0.5,
            lower: datos.bbLower + bandVariation,
            price: datos.precio + priceVariation,
          }
        })
        // Asegurar que el último punto sean los valores actuales
        bbChartData[bbChartData.length - 1] = {
          name: "T-0",
          upper: datos.bbUpper,
          middle: datos.bbMiddle,
          lower: datos.bbLower,
          price: datos.precio,
        }

        return (
          <div className="space-y-4">
            {/* Numerical Values */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-trading-red-600/20 p-2 rounded border border-trading-red-600/30">
                <div className="text-xs text-trading-red-300 font-mono mb-1">Upper</div>
                <div className="text-lg font-bold font-mono text-trading-red-400">
                  ${datos.bbUpper.toFixed(datos.decimales)}
                </div>
              </div>
              <div className="bg-trading-yellow-600/20 p-2 rounded border border-trading-yellow-600/30">
                <div className="text-xs text-trading-yellow-300 font-mono mb-1">Middle</div>
                <div className="text-lg font-bold font-mono text-trading-yellow-400">
                  ${datos.bbMiddle.toFixed(datos.decimales)}
                </div>
              </div>
              <div className="bg-trading-green-600/20 p-2 rounded border border-trading-green-600/30">
                <div className="text-xs text-trading-green-300 font-mono mb-1">Lower</div>
                <div className="text-lg font-bold font-mono text-trading-green-400">
                  ${datos.bbLower.toFixed(datos.decimales)}
                </div>
              </div>
            </div>

            <div className="bg-trading-dark-700 p-3 rounded border border-trading-dark-600">
              <div className="flex justify-between items-center">
                <span className="text-xs text-trading-dark-300 font-mono">Current Price Position:</span>
                <span
                  className={`text-sm font-bold font-mono ${
                    datos.precio > datos.bbUpper
                      ? "text-trading-red-400"
                      : datos.precio < datos.bbLower
                        ? "text-trading-green-400"
                        : "text-trading-blue-400"
                  }`}
                >
                  {datos.precio > datos.bbUpper
                    ? "Above Upper Band"
                    : datos.precio < datos.bbLower
                      ? "Below Lower Band"
                      : "Within Bands"}
                </span>
              </div>
              <div className="mt-2 text-xs text-trading-dark-300 font-mono">
                Band Width: {(((datos.bbUpper - datos.bbLower) / datos.bbMiddle) * 100).toFixed(2)}%
              </div>
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={bbChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                <XAxis dataKey="name" tick={{ fill: "#a3a3a3", fontSize: 10 }} />
                <YAxis tick={{ fill: "#a3a3a3", fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #404040",
                    borderRadius: "4px",
                    color: "#fff",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="upper"
                  stroke="#ef4444"
                  strokeWidth={1}
                  dot={false}
                  strokeDasharray="2 2"
                />
                <Line type="monotone" dataKey="middle" stroke="#f59e0b" strokeWidth={2} dot={false} />
                <Line
                  type="monotone"
                  dataKey="lower"
                  stroke="#10b981"
                  strokeWidth={1}
                  dot={false}
                  strokeDasharray="2 2"
                />
                <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )

      case "ema":
        // Generar datos históricos basados en las EMAs actuales
        const emaChartData = Array.from({ length: 14 }, (_, i) => {
          const priceVariation = (Math.random() - 0.5) * datos.precio * 0.03 // ±3% variación
          const emaVariation = (Math.random() - 0.5) * datos.precio * 0.015 // ±1.5% variación para EMAs

          return {
            name: `T-${13 - i}`,
            ema50: datos.ema50 + emaVariation,
            ema100: datos.ema100 + emaVariation * 0.8,
            ema200: datos.ema200 + emaVariation * 0.6,
            price: datos.precio + priceVariation,
          }
        })
        // Asegurar que el último punto sean los valores actuales
        emaChartData[emaChartData.length - 1] = {
          name: "T-0",
          ema50: datos.ema50,
          ema100: datos.ema100,
          ema200: datos.ema200,
          price: datos.precio,
        }

        return (
          <div className="space-y-4">
            {/* Numerical Values */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="bg-trading-dark-700 p-2 rounded border border-trading-dark-600 flex justify-between">
                  <span className="text-xs text-trading-green-300 font-mono">EMA 50:</span>
                  <span className="text-sm font-bold font-mono text-trading-green-400">
                    ${datos.ema50.toFixed(datos.decimales)}
                  </span>
                </div>
                <div className="bg-trading-dark-700 p-2 rounded border border-trading-dark-600 flex justify-between">
                  <span className="text-xs text-trading-yellow-300 font-mono">EMA 100:</span>
                  <span className="text-sm font-bold font-mono text-trading-yellow-400">
                    ${datos.ema100.toFixed(datos.decimales)}
                  </span>
                </div>
                <div className="bg-trading-dark-700 p-2 rounded border border-trading-dark-600 flex justify-between">
                  <span className="text-xs text-trading-red-300 font-mono">EMA 200:</span>
                  <span className="text-sm font-bold font-mono text-trading-red-400">
                    ${datos.ema200.toFixed(datos.decimales)}
                  </span>
                </div>
              </div>
              <div className="bg-trading-dark-700 p-3 rounded border border-trading-dark-600">
                <div className="text-xs text-trading-dark-300 font-mono mb-1">Trend Analysis</div>
                <div
                  className={`text-lg font-bold font-mono ${
                    datos.precio > datos.ema50 && datos.ema50 > datos.ema100 && datos.ema100 > datos.ema200
                      ? "text-trading-green-400"
                      : datos.precio < datos.ema50 && datos.ema50 < datos.ema100 && datos.ema100 < datos.ema200
                        ? "text-trading-red-400"
                        : "text-trading-yellow-400"
                  }`}
                >
                  {datos.precio > datos.ema50 && datos.ema50 > datos.ema100 && datos.ema100 > datos.ema200
                    ? "BULLISH"
                    : datos.precio < datos.ema50 && datos.ema50 < datos.ema100 && datos.ema100 < datos.ema200
                      ? "BEARISH"
                      : "SIDEWAYS"}
                </div>
                <div className="text-xs text-trading-dark-300 font-mono">
                  Price vs EMA50: {((datos.precio / datos.ema50 - 1) * 100).toFixed(2)}%
                </div>
                <div className="text-xs text-trading-dark-300 font-mono">
                  EMA Distance: {(((datos.ema50 - datos.ema200) / datos.ema200) * 100).toFixed(2)}%
                </div>
              </div>
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={emaChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                <XAxis dataKey="name" tick={{ fill: "#a3a3a3", fontSize: 10 }} />
                <YAxis tick={{ fill: "#a3a3a3", fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #404040",
                    borderRadius: "4px",
                    color: "#fff",
                  }}
                />
                <Line type="monotone" dataKey="ema50" stroke="#10b981" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="ema100" stroke="#f59e0b" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="ema200" stroke="#ef4444" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card className="trading-card">
      <CardHeader>
        <CardTitle className="text-white flex items-center font-mono text-sm">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="chart-container">{renderChart()}</div>
      </CardContent>
    </Card>
  )
}
