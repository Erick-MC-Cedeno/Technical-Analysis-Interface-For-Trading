from flask import Flask, jsonify, request
from flask_cors import CORS
from tradingview_ta import TA_Handler, Interval
import time
import threading

app = Flask(__name__)
# Allow localhost (dev) and the GH Codespace origin — adjust as needed for production
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:3000",
            "http://localhost:3001",
            "https://curly-xylophone-69g4ggwwqq4cwgg-3000.app.github.dev"
        ],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# Simple in-memory cache and locks to avoid repeated heavy TA_Handler calls
CACHE_TTL = 15  # seconds
cache = {}  # symbol -> {data, ts}
locks = {}  # symbol -> threading.Lock()
cache_lock = threading.Lock()

# Simple per-IP rate limiter (sliding window)
RATE_WINDOW = 60  # seconds
RATE_LIMIT = 60   # max requests per window per IP
ip_requests = {}  # ip -> [timestamps]
ip_lock = threading.Lock()

def rate_limited(ip):
    now = time.time()
    with ip_lock:
        arr = ip_requests.get(ip)
        if not arr:
            ip_requests[ip] = [now]
            return False
        # keep only timestamps within window
        arr = [t for t in arr if now - t <= RATE_WINDOW]
        arr.append(now)
        ip_requests[ip] = arr
        if len(arr) > RATE_LIMIT:
            return True
        return False

def get_symbol_lock(symbol):
    with cache_lock:
        if symbol not in locks:
            locks[symbol] = threading.Lock()
        return locks[symbol]

def fetch_from_ta(symbol):
    handler = TA_Handler(
        symbol=symbol,
        screener="crypto",
        exchange="BINANCE",
        interval=Interval.INTERVAL_15_MINUTES
    )
    analysis = handler.get_analysis()
    indicators = analysis.indicators

    return {
        'precio': indicators.get('close'),
        'decimales': 8 if 'PEPE' in symbol else 2,
        'rsi': indicators.get('RSI'),
        'rsiStoch': indicators.get('Stoch.RSI.K'),
        'volumen': indicators.get('volume'),
        'bbUpper': indicators.get('BB.upper'),
        'bbMiddle': indicators.get('SMA20') or indicators.get('BB.middle'),
        'bbLower': indicators.get('BB.lower'),
        'macdValue': indicators.get('MACD.macd'),
        'macdSignal': indicators.get('MACD.signal'),
        'adx': indicators.get('ADX'),
        'stochK': indicators.get('Stoch.K'),
        'stochD': indicators.get('Stoch.D'),
        'cci': indicators.get('CCI20'),
        'ema50': indicators.get('EMA50'),
        'ema100': indicators.get('EMA100'),
        'ema200': indicators.get('EMA200'),
        's1': indicators.get('Pivot.M.Classic.S1'),
        's2': indicators.get('Pivot.M.Classic.S2'),
        's3': indicators.get('Pivot.M.Classic.S3'),
        'r1': indicators.get('Pivot.M.Classic.R1'),
        'r2': indicators.get('Pivot.M.Classic.R2'),
        'r3': indicators.get('Pivot.M.Classic.R3'),
        'buySignals': analysis.summary.get('BUY'),
        'sellSignals': analysis.summary.get('SELL'),
        'neutralSignals': analysis.summary.get('NEUTRAL')
    }

def get_trading_cached(symbol):
    now = time.time()
    # fast path: return cached if fresh
    entry = cache.get(symbol)
    if entry and now - entry['ts'] <= CACHE_TTL:
        return entry['data']

    # acquire symbol-specific lock to avoid duplicate TA calls
    lock = get_symbol_lock(symbol)
    with lock:
        # re-check cache after acquiring lock
        entry = cache.get(symbol)
        if entry and now - entry['ts'] <= CACHE_TTL:
            return entry['data']

        # fetch new data (may be slow) and store
        data = fetch_from_ta(symbol)
        cache[symbol] = {'data': data, 'ts': time.time()}
        return data


@app.route('/api/trading/<symbol>')
def get_trading_data(symbol):
    # basic rate limiting per IP
    ip = request.remote_addr or 'unknown'
    if rate_limited(ip):
        return jsonify({'error': 'Too many requests'}), 429

    try:
        data = get_trading_cached(symbol)
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    # threaded=True allows concurrent requests handled by Flask dev server
    app.run(port=5000, debug=True, threaded=True)
