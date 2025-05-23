import IndicatorCard from "@/components/indicators/IndicatorCard"
import { Activity, Shield, Target } from "lucide-react"

export default function IndicatorGrid({ datos }) {
  return (
    <>
      {/* Indicadores Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <IndicatorCard title="📊 RSI" icon={<Activity className="h-5 w-5 mr-2" />}>
          <div className="text-2xl font-bold text-white">{datos.rsi.toFixed(2)}</div>
          <div className="text-purple-200">RSI Estocástico: {datos.rsiStoch.toFixed(2)}</div>
        </IndicatorCard>

        <IndicatorCard title="💹 Volumen">
          <div className="text-2xl font-bold text-white">{datos.volumen.toFixed(2)}</div>
        </IndicatorCard>

        <IndicatorCard title="📊 ADX">
          <div className="text-2xl font-bold text-white">{datos.adx.toFixed(2)}</div>
        </IndicatorCard>
      </div>

      {/* Bandas de Bollinger y MACD */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <IndicatorCard title="📉 Bandas de Bollinger">
          <div className="space-y-2">
            <div className="text-white">
              Superior: <span className="font-bold">{datos.bbUpper.toFixed(2)}</span>
            </div>
            <div className="text-white">
              Media: <span className="font-bold">{datos.bbMiddle.toFixed(2)}</span>
            </div>
            <div className="text-white">
              Inferior: <span className="font-bold">{datos.bbLower.toFixed(2)}</span>
            </div>
          </div>
        </IndicatorCard>

        <IndicatorCard title="📈 MACD">
          <div className="space-y-2">
            <div className="text-white">
              Valor: <span className="font-bold">{datos.macdValue.toFixed(2)}</span>
            </div>
            <div className="text-white">
              Señal: <span className="font-bold">{datos.macdSignal.toFixed(2)}</span>
            </div>
          </div>
        </IndicatorCard>
      </div>

      {/* EMAs y Estocástico */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <IndicatorCard title="📅 EMAs">
          <div className="space-y-2">
            <div className="text-white">
              EMA 50: <span className="font-bold">{datos.ema50.toFixed(2)}</span>
            </div>
            <div className="text-white">
              EMA 100: <span className="font-bold">{datos.ema100.toFixed(2)}</span>
            </div>
            <div className="text-white">
              EMA 200: <span className="font-bold">{datos.ema200.toFixed(2)}</span>
            </div>
          </div>
        </IndicatorCard>

        <IndicatorCard title="📌 Osciladores">
          <div className="space-y-2">
            <div className="text-white">
              Estocástico K: <span className="font-bold">{datos.stochK.toFixed(2)}</span>
            </div>
            <div className="text-white">
              Estocástico D: <span className="font-bold">{datos.stochD.toFixed(2)}</span>
            </div>
            <div className="text-white">
              CCI (20): <span className="font-bold">{datos.cci.toFixed(2)}</span>
            </div>
          </div>
        </IndicatorCard>
      </div>

      {/* Soportes y Resistencias */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IndicatorCard title="🛑 Soportes" icon={<Shield className="h-5 w-5 mr-2" />}>
          <div className="space-y-2">
            <div className="text-white">
              S1: <span className="font-bold">{datos.s1.toFixed(2)}</span>
            </div>
            <div className="text-white">
              S2: <span className="font-bold">{datos.s2.toFixed(2)}</span>
            </div>
            <div className="text-white">
              S3: <span className="font-bold">{datos.s3.toFixed(2)}</span>
            </div>
          </div>
        </IndicatorCard>

        <IndicatorCard title="🎯 Resistencias" icon={<Target className="h-5 w-5 mr-2" />}>
          <div className="space-y-2">
            <div className="text-white">
              R1: <span className="font-bold">{datos.r1.toFixed(2)}</span>
            </div>
            <div className="text-white">
              R2: <span className="font-bold">{datos.r2.toFixed(2)}</span>
            </div>
            <div className="text-white">
              R3: <span className="font-bold">{datos.r3.toFixed(2)}</span>
            </div>
          </div>
        </IndicatorCard>
      </div>
    </>
  )
}
