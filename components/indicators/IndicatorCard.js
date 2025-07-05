import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function IndicatorCard({ title, icon, children }) {
  return (
    <Card className="trading-card">
      <CardHeader>
        <CardTitle className="text-white flex items-center font-mono text-sm">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
