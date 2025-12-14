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
