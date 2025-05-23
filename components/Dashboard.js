import Header from "@/components/Header"
import PriceCard from "@/components/indicators/PriceCard"
import RecommendationCard from "@/components/indicators/RecommendationCard"
import IndicatorGrid from "@/components/indicators/IndicatorGrid"
import { getRecommendation } from "@/utils/dataUtils"
import { fetchTradingData } from "@/utils/apiService"
import { useState, useEffect } from "react"

export default function Dashboard({ moneda, ultimaActualizacion, onActualizar, onCambiarMoneda }) {
  const [datos, setDatos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const nuevoDatos = await fetchTradingData(moneda.symbol);
      console.log('Nuevos datos recibidos:', nuevoDatos);
      setDatos(nuevoDatos);
      setError(null);
    } catch (err) {
      console.error('Error:', err);
      setError('Error al obtener datos de trading');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Iniciando carga de datos para:', moneda.symbol);
    setLoading(true);
    fetchData();
  }, [moneda.symbol]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 p-4 flex items-center justify-center">
        <div className="text-white text-xl">Cargando datos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 p-4 flex items-center justify-center">
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    );
  }

  if (!datos) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 p-4 flex items-center justify-center">
        <div className="text-white text-xl">No hay datos disponibles</div>
      </div>
    );
  }

  const recomendacion = getRecommendation(datos);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 p-4">
      <div className="max-w-7xl mx-auto">
        <Header
          moneda={moneda}
          ultimaActualizacion={ultimaActualizacion}
          onActualizar={fetchData}
          onCambiarMoneda={onCambiarMoneda}
        />

        {/* Precio y Recomendación */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <PriceCard precio={datos.precio} decimales={datos.decimales} symbol={moneda.symbol} />
          <RecommendationCard
            recomendacion={recomendacion}
            buySignals={datos.buySignals}
            sellSignals={datos.sellSignals}
            neutralSignals={datos.neutralSignals}
          />
        </div>

        {/* Indicadores Técnicos */}
        <IndicatorGrid datos={datos} />
      </div>
    </div>
  )
}
