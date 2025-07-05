// Función para simular datos de trading (en producción conectarías con una API real)
export const generarDatosMock = (symbol) => {
  const basePrice = {
    ETHUSDT: 2300,
    PEPEUSDT: 0.00001234,
    SOLUSDT: 95,
    BTCUSDT: 43000,
  }

  const price = basePrice[symbol] * (0.95 + Math.random() * 0.1)
  const decimales = symbol === "PEPEUSDT" ? 8 : 2

  return {
    precio: price,
    decimales,
    rsi: 30 + Math.random() * 40,
    rsiStoch: 20 + Math.random() * 60,
    volumen: Math.random() * 1000000,
    bbUpper: price * 1.02,
    bbMiddle: price,
    bbLower: price * 0.98,
    macdValue: (Math.random() - 0.5) * 10,
    macdSignal: (Math.random() - 0.5) * 8,
    adx: 20 + Math.random() * 60,
    stochK: Math.random() * 100,
    stochD: Math.random() * 100,
    cci: (Math.random() - 0.5) * 200,
    ema50: price * 0.99,
    ema100: price * 0.98,
    ema200: price * 0.97,
    s1: price * 0.95,
    s2: price * 0.92,
    s3: price * 0.89,
    r1: price * 1.05,
    r2: price * 1.08,
    r3: price * 1.11,
    buySignals: Math.floor(Math.random() * 10),
    sellSignals: Math.floor(Math.random() * 10),
    neutralSignals: Math.floor(Math.random() * 5),
  }
}

export const getRecommendation = (data) => {
  if (data.buySignals > data.sellSignals) return "COMPRA"
  if (data.sellSignals > data.buySignals) return "VENTA"
  return "NEUTRAL"
}

export const getRecommendationColor = (rec) => {
  switch (rec) {
    case "COMPRA":
      return "bg-trading-green-600"
    case "VENTA":
      return "bg-trading-red-600"
    default:
      return "bg-trading-dark-600"
  }
}
