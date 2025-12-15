import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign } from "lucide-react"

export default function PriceCard({ precio, decimales = 2, symbol }) {
  const parsePrecio = (p) => {
    if (typeof p === 'number' && Number.isFinite(p)) return p
    if (typeof p !== 'string') return Number(p) || 0

    let s = p.trim()
    const hasComma = s.indexOf(',') !== -1
    const hasDot = s.indexOf('.') !== -1

    if (hasComma && hasDot) {
      const lastComma = s.lastIndexOf(',')
      const lastDot = s.lastIndexOf('.')
      if (lastComma > lastDot) {
        // comma is decimal, dots are thousands
        s = s.replace(/\./g, '')
        s = s.replace(/,/g, '.')
      } else {
        // dot is decimal, commas are thousands
        s = s.replace(/,/g, '')
      }
    } else if (hasComma) {
      const parts = s.split(',')
      if (parts.length > 1) {
        const last = parts[parts.length - 1]
        if (last.length === 3) {
          // commas are thousands
          s = parts.join('')
        } else {
          // last comma is decimal, remove other commas
          const intPart = parts.slice(0, -1).join('')
          s = `${intPart}.${last}`
        }
      }
    } else if (hasDot) {
      const parts = s.split('.')
      if (parts.length > 1) {
        const last = parts[parts.length - 1]
        if (last.length === 3) {
          // dots are thousands
          s = parts.join('')
        } else {
          // dot is decimal -> keep as-is
        }
      }
    }

    const n = Number(s)
    return Number.isFinite(n) ? n : 0
  }

  const formatWithDots = (n, d) => {
    const fixed = Number(n).toFixed(d)
    const [intPart, decPart] = fixed.split('.')
    const intWithDots = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    return `${intWithDots}.${decPart}`
  }

  const value = parsePrecio(precio)
  const formatted = formatWithDots(value, decimales)

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
          <div className="text-3xl font-bold text-white font-mono">${formatted}</div>
          <div className="text-xs text-trading-dark-300 font-mono">{symbol}</div>
        </div>
      </CardContent>
    </Card>
  )
}
