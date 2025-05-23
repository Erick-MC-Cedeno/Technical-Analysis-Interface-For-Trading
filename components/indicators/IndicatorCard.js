import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function IndicatorCard({ title, icon, children }) {
  return (
    <Card className="bg-white/10 backdrop-blur-sm border-purple-300/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
