from flask import Flask, jsonify
from flask_cors import CORS
from tradingview_ta import TA_Handler, Interval
import time

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "https://curly-xylophone-69g4ggwwqq4cwgg-3000.app.github.dev"
        ],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

@app.route('/api/trading/<symbol>')
def get_trading_data(symbol):
    try:
        handler = TA_Handler(
            symbol=symbol,
            screener="crypto",
            exchange="BINANCE",
            interval=Interval.INTERVAL_15_MINUTES
        )

        analysis = handler.get_analysis()
        indicators = analysis.indicators
        
        return jsonify({
            'precio': indicators['close'],
            'decimales': 8 if 'PEPE' in symbol else 2,
            'rsi': indicators['RSI'],
            'rsiStoch': indicators['Stoch.RSI.K'],
            'volumen': indicators['volume'],
            'bbUpper': indicators['BB.upper'],
            'bbMiddle': indicators['SMA20'],  # Cambiado de BB.middle a SMA20
            'bbLower': indicators['BB.lower'],
            'macdValue': indicators['MACD.macd'],
            'macdSignal': indicators['MACD.signal'],
            'adx': indicators['ADX'],
            'stochK': indicators['Stoch.K'],
            'stochD': indicators['Stoch.D'],
            'cci': indicators['CCI20'],
            'ema50': indicators['EMA50'],
            'ema100': indicators['EMA100'],
            'ema200': indicators['EMA200'],
            's1': indicators['Pivot.M.Classic.S1'],
            's2': indicators['Pivot.M.Classic.S2'],
            's3': indicators['Pivot.M.Classic.S3'],
            'r1': indicators['Pivot.M.Classic.R1'],
            'r2': indicators['Pivot.M.Classic.R2'],
            'r3': indicators['Pivot.M.Classic.R3'],
            'buySignals': analysis.summary['BUY'],
            'sellSignals': analysis.summary['SELL'],
            'neutralSignals': analysis.summary['NEUTRAL']
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
