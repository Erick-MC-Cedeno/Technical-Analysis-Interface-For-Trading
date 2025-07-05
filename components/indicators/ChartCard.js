import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from "recharts"

export default function ChartCard({ title, icon, data, type, currentValue, datos }) {
  const renderChart = () => {
    switch (type) {
      case "rsi":
        const rsiChartData = Array.from({ length: 14 }, (_, i) => ({
          name: `T-${13 - i}`,
          rsi: Math.max(0, Math.min(100, currentValue + (Math.random() - 0.5) * 20)),
        }))

        return (
          <div className="space-y-4">
            {/* Numerical Values */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-trading-dark-700 p-3 rounded border border-trading-dark-600">
                <div className="text-xs text-trading-dark-300 font-mono mb-1">RSI (14)</div>
                <div
                  className={`text-xl font-bold font-mono ${
                    currentValue > 70
                      ? "text-trading-red-400"
                      : currentValue < 30
                        ? "text-trading-green-400"
                        : "text-trading-blue-400"
                  }`}
                >
                  {currentValue.toFixed(2)}
                </div>
                <div className="text-xs text-trading-dark-300 font-mono">
                  {currentValue > 70 ? "Overbought" : currentValue < 30 ? "Oversold" : "Neutral"}
                </div>
              </div>
              <div className="bg-trading-dark-700 p-3 rounded border border-trading-dark-600">
                <div className="text-xs text-trading-dark-300 font-mono mb-1">Stoch RSI</div>
                <div
                  className={`text-xl font-bold font-mono ${
                    datos?.rsiStoch > 80
                      ? "text-trading-red-400"
                      : datos?.rsiStoch < 20
                        ? "text-trading-green-400"
                        : "text-trading-blue-400"
                  }`}
                >
                  {datos?.rsiStoch?.toFixed(2) || "0.00"}
                </div>
                <div className="text-xs text-trading-dark-300 font-mono">
                  {datos?.rsiStoch > 80 ? "Overbought" : datos?.rsiStoch < 20 ? "Oversold" : "Neutral"}
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
        const macdChartData = Array.from({ length: 14 }, (_, i) => ({
          name: `T-${13 - i}`,
          macd: currentValue + (Math.random() - 0.5) * 5,
          signal: (currentValue + (Math.random() - 0.5) * 5) * 0.8,
        }))

        return (
          <div className="space-y-4">
            {/* Numerical Values */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-trading-dark-700 p-3 rounded border border-trading-dark-600">
                <div className="text-xs text-trading-dark-300 font-mono mb-1">MACD Line</div>
                <div
                  className={`text-xl font-bold font-mono ${
                    datos?.macdValue > 0 ? "text-trading-green-400" : "text-trading-red-400"
                  }`}
                >
                  {datos?.macdValue?.toFixed(4) || "0.0000"}
                </div>
                <div className="text-xs text-trading-dark-300 font-mono">
                  {datos?.macdValue > 0 ? "Bullish" : "Bearish"}
                </div>
              </div>
              <div className="bg-trading-dark-700 p-3 rounded border border-trading-dark-600">
                <div className="text-xs text-trading-dark-300 font-mono mb-1">Signal Line</div>
                <div
                  className={`text-xl font-bold font-mono ${
                    datos?.macdSignal > 0 ? "text-trading-green-400" : "text-trading-red-400"
                  }`}
                >
                  {datos?.macdSignal?.toFixed(4) || "0.0000"}
                </div>
                <div className="text-xs text-trading-dark-300 font-mono">
                  Histogram: {((datos?.macdValue || 0) - (datos?.macdSignal || 0)).toFixed(4)}
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
        const bbChartData = Array.from({ length: 14 }, (_, i) => ({
          name: `T-${13 - i}`,
          upper: data[0].upper + (Math.random() - 0.5) * 10,
          middle: data[0].middle + (Math.random() - 0.5) * 5,
          lower: data[0].lower + (Math.random() - 0.5) * 10,
          price: currentValue + (Math.random() - 0.5) * 15,
        }))

        return (
          <div className="space-y-4">
            {/* Numerical Values */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-trading-red-600/20 p-2 rounded border border-trading-red-600/30">
                <div className="text-xs text-trading-red-300 font-mono mb-1">Upper</div>
                <div className="text-lg font-bold font-mono text-trading-red-400">
                  ${datos?.bbUpper?.toFixed(2) || "0.00"}
                </div>
              </div>
              <div className="bg-trading-yellow-600/20 p-2 rounded border border-trading-yellow-600/30">
                <div className="text-xs text-trading-yellow-300 font-mono mb-1">Middle</div>
                <div className="text-lg font-bold font-mono text-trading-yellow-400">
                  ${datos?.bbMiddle?.toFixed(2) || "0.00"}
                </div>
              </div>
              <div className="bg-trading-green-600/20 p-2 rounded border border-trading-green-600/30">
                <div className="text-xs text-trading-green-300 font-mono mb-1">Lower</div>
                <div className="text-lg font-bold font-mono text-trading-green-400">
                  ${datos?.bbLower?.toFixed(2) || "0.00"}
                </div>
              </div>
            </div>

            <div className="bg-trading-dark-700 p-3 rounded border border-trading-dark-600">
              <div className="flex justify-between items-center">
                <span className="text-xs text-trading-dark-300 font-mono">Current Price Position:</span>
                <span
                  className={`text-sm font-bold font-mono ${
                    currentValue > datos?.bbUpper
                      ? "text-trading-red-400"
                      : currentValue < datos?.bbLower
                        ? "text-trading-green-400"
                        : "text-trading-blue-400"
                  }`}
                >
                  {currentValue > datos?.bbUpper
                    ? "Above Upper Band"
                    : currentValue < datos?.bbLower
                      ? "Below Lower Band"
                      : "Within Bands"}
                </span>
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
        const emaChartData = Array.from({ length: 14 }, (_, i) => ({
          name: `T-${13 - i}`,
          ema50: data[0].value + (Math.random() - 0.5) * 10,
          ema100: data[1].value + (Math.random() - 0.5) * 15,
          ema200: data[2].value + (Math.random() - 0.5) * 20,
          price: currentValue + (Math.random() - 0.5) * 25,
        }))

        return (
          <div className="space-y-4">
            {/* Numerical Values */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="bg-trading-dark-700 p-2 rounded border border-trading-dark-600 flex justify-between">
                  <span className="text-xs text-trading-green-300 font-mono">EMA 50:</span>
                  <span className="text-sm font-bold font-mono text-trading-green-400">
                    ${datos?.ema50?.toFixed(2) || "0.00"}
                  </span>
                </div>
                <div className="bg-trading-dark-700 p-2 rounded border border-trading-dark-600 flex justify-between">
                  <span className="text-xs text-trading-yellow-300 font-mono">EMA 100:</span>
                  <span className="text-sm font-bold font-mono text-trading-yellow-400">
                    ${datos?.ema100?.toFixed(2) || "0.00"}
                  </span>
                </div>
                <div className="bg-trading-dark-700 p-2 rounded border border-trading-dark-600 flex justify-between">
                  <span className="text-xs text-trading-red-300 font-mono">EMA 200:</span>
                  <span className="text-sm font-bold font-mono text-trading-red-400">
                    ${datos?.ema200?.toFixed(2) || "0.00"}
                  </span>
                </div>
              </div>
              <div className="bg-trading-dark-700 p-3 rounded border border-trading-dark-600">
                <div className="text-xs text-trading-dark-300 font-mono mb-1">Trend Analysis</div>
                <div
                  className={`text-lg font-bold font-mono ${
                    currentValue > datos?.ema50 && datos?.ema50 > datos?.ema100 && datos?.ema100 > datos?.ema200
                      ? "text-trading-green-400"
                      : currentValue < datos?.ema50 && datos?.ema50 < datos?.ema100 && datos?.ema100 < datos?.ema200
                        ? "text-trading-red-400"
                        : "text-trading-yellow-400"
                  }`}
                >
                  {currentValue > datos?.ema50 && datos?.ema50 > datos?.ema100 && datos?.ema100 > datos?.ema200
                    ? "BULLISH"
                    : currentValue < datos?.ema50 && datos?.ema50 < datos?.ema100 && datos?.ema100 < datos?.ema200
                      ? "BEARISH"
                      : "SIDEWAYS"}
                </div>
                <div className="text-xs text-trading-dark-300 font-mono">
                  Price vs EMA50: {((currentValue / (datos?.ema50 || 1) - 1) * 100).toFixed(2)}%
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
