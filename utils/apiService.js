// Servicio para obtener datos de TradingView
const API_BASE_URL = 'https://bookish-journey-v9g6vrvg5xp2w5r6-5000.app.github.dev/api';

export const fetchTradingData = async (symbol) => {
  try {
    console.log(`Fetching data for ${symbol}...`);
    const response = await fetch(`${API_BASE_URL}/trading/${symbol}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Received data:', data);
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching trading data:', error);
    throw error;
  }
};

// Función de respaldo usando Binance
async function fetchBinanceData(symbol) {
  const binanceResponse = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
  const binanceData = await binanceResponse.json();

  const klineResponse = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1h&limit=200`);
  const klineData = await klineResponse.json();
  
  const prices = klineData.map(candle => parseFloat(candle[4]));
  const volume = parseFloat(binanceData.volume);

  // Calcular indicadores técnicos localmente
  const rsi = calculateRSI(prices, 14);
  const bb = calculateBollingerBands(prices, 20, 2);
  const macd = calculateMACD(prices);
  const stoch = calculateStochastic(prices);
  const adx = calculateADX(prices, 14); // Calculado
  const cci = calculateCCI(prices, 20); // Agregado
  
  return {
    precio: parseFloat(binanceData.lastPrice),
    decimales: getDecimales(symbol),
    rsi,
    rsiStoch: calculateStochRSI(prices, 14),
    volumen: volume,
    bbUpper: bb.upper,
    bbMiddle: bb.middle,
    bbLower: bb.lower,
    macdValue: macd.macdLine,
    macdSignal: macd.signalLine,
    adx, // Agregado
    stochK: stoch.k,
    stochD: stoch.d,
    ema50: calculateEMA(prices, 50),
    ema100: calculateEMA(prices, 100),
    ema200: calculateEMA(prices, 200),
    cci, // Agregado
    // Niveles de soporte y resistencia aproximados
    s1: parseFloat(binanceData.lastPrice) * 0.99,
    s2: parseFloat(binanceData.lastPrice) * 0.98,
    s3: parseFloat(binanceData.lastPrice) * 0.97,
    r1: parseFloat(binanceData.lastPrice) * 1.01,
    r2: parseFloat(binanceData.lastPrice) * 1.02,
    r3: parseFloat(binanceData.lastPrice) * 1.03,
    buySignals: 0,
    sellSignals: 0,
    neutralSignals: 5
  };
}

// Función para calcular señales de trading
function calculateSignals(rsi, macd, bb, price, stoch) {
  let buySignals = 0;
  let sellSignals = 0;
  
  // RSI
  if (rsi < 30) buySignals++;
  if (rsi > 70) sellSignals++;
  
  // MACD
  if (macd.macdLine > macd.signalLine) buySignals++;
  if (macd.macdLine < macd.signalLine) sellSignals++;
  
  // Bollinger Bands
  if (price <= bb.lower) buySignals++;
  if (price >= bb.upper) sellSignals++;
  
  // Estocástico
  if (stoch.k < 20 && stoch.d < 20) buySignals++;
  if (stoch.k > 80 && stoch.d > 80) sellSignals++;
  
  const totalSignals = 4; // número total de indicadores
  const neutralSignals = totalSignals - (buySignals + sellSignals);
  
  return { buySignals, sellSignals, neutralSignals };
}

// Función auxiliar para determinar decimales según el par de trading
function getDecimales(symbol) {
  if (symbol.includes('USDT')) {
    if (symbol === 'BTCUSDT') return 2;
    if (symbol === 'ETHUSDT') return 2;
    if (symbol === 'PEPEUSDT') return 8;
    return 4;
  }
  return 8;
}

// Función para calcular el RSI
function calculateRSI(prices, period = 14) {
  let gains = 0;
  let losses = 0;

  for (let i = 1; i < period + 1; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  for (let i = period + 1; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff >= 0) {
      avgGain = (avgGain * (period - 1) + diff) / period;
      avgLoss = (avgLoss * (period - 1)) / period;
    } else {
      avgGain = (avgGain * (period - 1)) / period;
      avgLoss = (avgLoss * (period - 1) - diff) / period;
    }
  }

  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

// Función para calcular las Bandas de Bollinger
function calculateBollingerBands(prices, period = 20, stdDev = 2) {
  const sma = prices.slice(-period).reduce((a, b) => a + b) / period;
  const squaredDiffs = prices.slice(-period).map(p => Math.pow(p - sma, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b) / period;
  const std = Math.sqrt(variance);

  return {
    upper: sma + stdDev * std,
    middle: sma,
    lower: sma - stdDev * std,
  };
}

// Función para calcular el MACD
function calculateMACD(prices, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
  const fastEMA = calculateEMA(prices, fastPeriod);
  const slowEMA = calculateEMA(prices, slowPeriod);
  const macdLine = fastEMA - slowEMA;
  const signalLine = calculateEMA([...Array(prices.length - slowPeriod).fill(0), macdLine], signalPeriod);

  return { macdLine, signalLine };
}

// Función para calcular el EMA
function calculateEMA(prices, period) {
  const multiplier = 2 / (period + 1);
  let ema = prices.slice(0, period).reduce((a, b) => a + b) / period;

  for (let i = period; i < prices.length; i++) {
    ema = (prices[i] - ema) * multiplier + ema;
  }

  return ema;
}

// Función para calcular el Estocástico
function calculateStochastic(prices, period = 14) {
  const currentClose = prices[prices.length - 1];
  const relevantPrices = prices.slice(-period);
  const lowestLow = Math.min(...relevantPrices);
  const highestHigh = Math.max(...relevantPrices);

  const k = ((currentClose - lowestLow) / (highestHigh - lowestLow)) * 100;
  const d = calculateSMA([k], 3); // 3-period SMA of %K

  return { k, d };
}

// Función para calcular el SMA
function calculateSMA(values, period) {
  return values.slice(-period).reduce((a, b) => a + b) / period;
}

// Función para calcular el StochRSI
function calculateStochRSI(prices, period = 14) {
  const rsiValues = [];
  for (let i = period; i < prices.length; i++) {
    rsiValues.push(calculateRSI(prices.slice(0, i + 1), period));
  }

  const currentRSI = rsiValues[rsiValues.length - 1];
  const lowestRSI = Math.min(...rsiValues.slice(-period));
  const highestRSI = Math.max(...rsiValues.slice(-period));

  return ((currentRSI - lowestRSI) / (highestRSI - lowestRSI)) * 100;
}

// Función para calcular el ADX
function calculateADX(prices, period = 14) {
  if (prices.length < period + 1) return 50; // Valor por defecto si no hay suficientes datos
  
  let dmPlus = 0;
  let dmMinus = 0;
  let trueRange = 0;
  
  for (let i = 1; i < period + 1; i++) {
    const high = prices[i];
    const low = prices[i - 1];
    const prevHigh = prices[i - 1];
    const prevLow = prices[i - 1];
    
    const tr = Math.max(high - low, Math.abs(high - prevLow), Math.abs(low - prevHigh));
    trueRange += tr;
    
    const upMove = high - prevHigh;
    const downMove = prevLow - low;
    
    if (upMove > downMove && upMove > 0) {
      dmPlus += upMove;
    }
    if (downMove > upMove && downMove > 0) {
      dmMinus += downMove;
    }
  }
  
  const diPlus = 100 * (dmPlus / trueRange);
  const diMinus = 100 * (dmMinus / trueRange);
  
  return 100 * Math.abs(diPlus - diMinus) / (diPlus + diMinus);
}

// Función para calcular el CCI (Commodity Channel Index)
function calculateCCI(prices, period = 20) {
  if (prices.length < period) return 0;
  
  const typicalPrices = prices.slice(-period);
  const sma = typicalPrices.reduce((a, b) => a + b) / period;
  const meanDeviation = typicalPrices.reduce((a, b) => a + Math.abs(b - sma), 0) / period;
  
  if (meanDeviation === 0) return 0;
  return (typicalPrices[typicalPrices.length - 1] - sma) / (0.015 * meanDeviation);
}
