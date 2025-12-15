import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from "recharts"

export default function ChartCard({ title, icon, type, datos = {} }) {
  // HELPER: ESTILO COMÚN PARA TOOLTIP (REUTILIZADO EN LOS GRÁFICOS)
  const TOOLTIP_STYLE = {
    backgroundColor: "#1a1a1a",
    border: "1px solid #404040",
    borderRadius: "4px",
    color: "#fff",
  }

  // HELPER: OBTENER ÚLTIMOS N ÍNDICES CON VALORES NO NULOS (PRESERVA ORDEN)
  const lastIndicesWithValue = (arr, n) => {
    if (!Array.isArray(arr) || arr.length === 0) return []
    const idxs = []
    for (let i = arr.length - 1; i >= 0 && idxs.length < n; i--) {
      if (arr[i] !== null && arr[i] !== undefined) idxs.push(i)
    }
    return idxs.reverse()
  }

  // HELPER: FORMATEAR NÚMEROS DE MANERA SEGURA A STRING CON DECIMALES
  const safeToFixed = (v, d = 2) => {
    const n = Number(v)
    if (!isFinite(n)) return (0).toFixed(d)
    return n.toFixed(d)
  }

  // RENDERIZADOR PRINCIPAL: DEVUELVE EL BLOQUE DE JSX SEGÚN `type`
  const renderChart = () => {
    switch (type) {
      case "rsi":
        // BLOQUE RSI: MUESTRA VALORES NUMÉRICOS Y GRÁFICO DE RSI
        // PREFERIR SERIES HISTÓRICAS PROPORCIONADAS POR EL BACKEND
        let rsiChartData
        if (datos.history && Array.isArray(datos.history.rsi) && datos.history.rsi.length > 0) {
          const histRsi = datos.history.rsi.slice(-14)
          // preserve historical None values (do not fill with current value), then ensure last is current
          rsiChartData = histRsi.map((v, i) => ({ name: `T-${14 - histRsi.length + i}`, rsi: v }))
          // ensure last value matches current indicator
          rsiChartData[rsiChartData.length - 1].rsi = datos.rsi
        } else {
          // No historical series available; show only current value (from API)
          rsiChartData = [{ name: "T-0", rsi: datos.rsi }]
        }

        

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
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="2 2" />
                <ReferenceLine y={30} stroke="#10b981" strokeDasharray="2 2" />
                <Line type="monotone" dataKey="rsi" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )

      case "macd":
        // BLOQUE MACD: MUESTRA LÍNEAS MACD/SIGNAL, HISTOGRAMA Y GRÁFICO
        // PREFERIR SERIES HISTÓRICAS DEL BACKEND
        let macdChartData
        if (datos.history && Array.isArray(datos.history.macd) && datos.history.macd.length > 0) {
          const hmacd = datos.history.macd.slice(-14)
          const hsignal = (Array.isArray(datos.history.macd_signal) && datos.history.macd_signal.slice(-14)) || []
          // preserve historical None values; set last point explicitly to current values
          macdChartData = hmacd.map((m, i) => ({ name: `T-${14 - hmacd.length + i}`, macd: m, signal: hsignal[i] }))
          macdChartData[macdChartData.length - 1] = { name: "T-0", macd: datos.macdValue, signal: datos.macdSignal }
        } else {
          // No history available; show only current MACD/Signal (from API)
          macdChartData = [{ name: "T-0", macd: datos.macdValue, signal: datos.macdSignal }]
        }

        // compute tight y-domain so MACD small differences are visible
        const macdValues = (macdChartData || []).flatMap(d => [d.macd, d.signal].filter(v => v !== null && v !== undefined))
        let macdYDomain = ["auto", "auto"]
        if (macdValues.length > 0) {
          const min = Math.min(...macdValues)
          const max = Math.max(...macdValues)
          const pad = (max - min) * 0.08 || Math.max(1e-8, Math.abs(max) * 0.002)
          macdYDomain = [min - pad, max + pad]
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
                <YAxis domain={macdYDomain} tick={{ fill: "#a3a3a3", fontSize: 10 }} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <ReferenceLine y={0} stroke="#525252" />
                <Line type="monotone" dataKey="macd" stroke="#10b981" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="signal" stroke="#ef4444" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )

      case "bollinger":
        // BLOQUE BOLLINGER: MUESTRA BANDAS SUPERIOR/MEDIA/INFERIOR Y PRECIO
        // PREFERIR SERIES HISTÓRICAS DEL BACKEND; USAR SÓLO ÍNDICES CON VALORES REALES
        let bbChartData
        // y-domain fallback (always defined so it's safe to reference in JSX)
        let bbYDomain = ["auto", "auto"]
        if (datos.history && Array.isArray(datos.history.closes) && datos.history.closes.length > 0) {
          const indices = lastIndicesWithValue(datos.history.closes, 24)
          if (indices.length > 0) {
            bbChartData = indices.map((idx, i) => ({
              name: `T-${indices.length - i - 1}`,
              upper: (Array.isArray(datos.history.bb_upper) ? datos.history.bb_upper[idx] : null),
              middle: (Array.isArray(datos.history.bb_middle) ? datos.history.bb_middle[idx] : null),
              lower: (Array.isArray(datos.history.bb_lower) ? datos.history.bb_lower[idx] : null),
              price: datos.history.closes[idx],
            }))
            // ensure final point reflects current BB values
            bbChartData[bbChartData.length - 1] = { name: "T-0", upper: datos.bbUpper, middle: datos.bbMiddle, lower: datos.bbLower, price: datos.precio }
          } else {
            bbChartData = []
          }

        // compute y-domain for Bollinger so bands and price are visible
        const bbValues = (bbChartData || []).flatMap(d => [d.upper, d.middle, d.lower, d.price].filter(v => v !== null && v !== undefined))
        if (bbValues.length > 0) {
          const min = Math.min(...bbValues)
          const max = Math.max(...bbValues)
          const pad = (max - min) * 0.08 || Math.max(1e-8, Math.abs(max) * 0.002)
          bbYDomain = [min - pad, max + pad]
        }
        } else {
          bbChartData = []
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
                <YAxis domain={bbYDomain} tick={{ fill: "#a3a3a3", fontSize: 10 }} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
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
        // BLOQUE EMA: MUESTRA EMAs (50/100/200), ANÁLISIS DE TENDENCIA Y GRÁFICO
        // PREFERIR SERIES HISTÓRICAS DEL BACKEND (USAMOS CLOSES Y EMAS SI VIENEN)
        let emaChartData
        if (datos.history && Array.isArray(datos.history.closes) && datos.history.closes.length > 0) {
          const indices = lastIndicesWithValue(datos.history.closes, 24)
          if (indices.length > 0) {
            emaChartData = indices.map((idx, i) => ({
              name: `T-${indices.length - i - 1}`,
              ema50: (Array.isArray(datos.history.ema50) ? datos.history.ema50[idx] : null),
              ema100: (Array.isArray(datos.history.ema100) ? datos.history.ema100[idx] : null),
              ema200: (Array.isArray(datos.history.ema200) ? datos.history.ema200[idx] : null),
              price: datos.history.closes[idx],
            }))
            // ensure final point reflects current EMAs
            emaChartData[emaChartData.length - 1] = { name: "T-0", ema50: datos.ema50, ema100: datos.ema100, ema200: datos.ema200, price: datos.precio }
          } else {
            emaChartData = []
          }
        } else {
          emaChartData = []
        }

        // compute tight y-domain so small EMA differences are visible
        const emaValues = (emaChartData || []).flatMap(d => [d.ema50, d.ema100, d.ema200, d.price].filter(v => v !== null && v !== undefined))
        let yDomain = ["auto", "auto"]
        if (emaValues.length > 0) {
          const min = Math.min(...emaValues)
          const max = Math.max(...emaValues)
          const pad = (max - min) * 0.08 || Math.max(1e-8, Math.abs(max) * 0.002)
          yDomain = [min - pad, max + pad]
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
                <YAxis domain={yDomain} tick={{ fill: "#a3a3a3", fontSize: 10 }} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Line type="monotone" dataKey="ema50" stroke="#10b981" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="ema100" stroke="#f59e0b" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="ema200" stroke="#ef4444" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )

      default:
        // TIPO NO RECONOCIDO: NO RENDERIZAR NADA
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
