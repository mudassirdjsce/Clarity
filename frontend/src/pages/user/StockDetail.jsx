import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, Activity, BarChart2, Clock, Star } from 'lucide-react';

// ── Mock Stock Data ─────────────────────────────────────────────────────────
const STOCK_DATA = {
  RELIANCE: {
    name: 'Reliance Industries Ltd.',
    ticker: 'RELIANCE',
    exchange: 'NSE',
    price: 2950.40,
    change: +35.60,
    changePct: +1.22,
    open: 2915.00,
    high: 2968.80,
    low: 2908.30,
    prevClose: 2914.80,
    volume: '18.4M',
    marketCap: '19.97L Cr',
    pe: 28.4,
    week52High: 3217.90,
    week52Low: 2220.30,
    sector: 'Energy & Petrochemicals',
  },
  TCS: {
    name: 'Tata Consultancy Services',
    ticker: 'TCS',
    exchange: 'NSE',
    price: 3840.10,
    change: +30.40,
    changePct: +0.80,
    open: 3810.00,
    high: 3858.00,
    low: 3798.50,
    prevClose: 3809.70,
    volume: '6.2M',
    marketCap: '13.92L Cr',
    pe: 31.2,
    week52High: 4592.25,
    week52Low: 3311.00,
    sector: 'Information Technology',
  },
  HDFCBANK: {
    name: 'HDFC Bank Ltd.',
    ticker: 'HDFCBANK',
    exchange: 'NSE',
    price: 1440.50,
    change: -7.20,
    changePct: -0.50,
    open: 1448.00,
    high: 1455.90,
    low: 1432.10,
    prevClose: 1447.70,
    volume: '11.8M',
    marketCap: '10.93L Cr',
    pe: 18.9,
    week52High: 1880.00,
    week52Low: 1363.55,
    sector: 'Banking & Finance',
  },
  INFY: {
    name: 'Infosys Ltd.',
    ticker: 'INFY',
    exchange: 'NSE',
    price: 1480.20,
    change: +30.50,
    changePct: +2.10,
    open: 1450.00,
    high: 1492.70,
    low: 1445.00,
    prevClose: 1449.70,
    volume: '14.3M',
    marketCap: '6.16L Cr',
    pe: 24.1,
    week52High: 1903.35,
    week52Low: 1318.30,
    sector: 'Information Technology',
  },
  TATAMOTORS: {
    name: 'Tata Motors Ltd.',
    ticker: 'TATAMOTORS',
    exchange: 'NSE',
    price: 1023.50,
    change: +44.10,
    changePct: +4.50,
    open: 980.00,
    high: 1031.00,
    low: 975.40,
    prevClose: 979.40,
    volume: '24.5M',
    marketCap: '3.78L Cr',
    pe: 12.3,
    week52High: 1179.05,
    week52Low: 643.05,
    sector: 'Automobile',
  },
};

const DEFAULT_STOCK = {
  name: 'Unknown Stock',
  ticker: 'N/A',
  exchange: 'NSE',
  price: 1000.00,
  change: 0,
  changePct: 0,
  open: 1000.00,
  high: 1010.00,
  low: 990.00,
  prevClose: 1000.00,
  volume: '0',
  marketCap: '0',
  pe: 0,
  week52High: 0,
  week52Low: 0,
  sector: 'Unknown',
};

// ── Candlestick Chart (SVG-based) ────────────────────────────────────────────
function generateCandles(basePrice, count = 60) {
  const candles = [];
  let price = basePrice * 0.92;
  for (let i = 0; i < count; i++) {
    const open = price;
    const move = (Math.random() - 0.46) * price * 0.018;
    const close = open + move;
    const high = Math.max(open, close) + Math.random() * price * 0.008;
    const low = Math.min(open, close) - Math.random() * price * 0.008;
    candles.push({ open, close, high, low });
    price = close;
  }
  return candles;
}

function CandlestickChart({ basePrice, isPositive }) {
  const candles = useRef(generateCandles(basePrice)).current;
  const W = 680, H = 220;
  const PAD = { top: 16, right: 8, bottom: 24, left: 56 };
  const cW = (W - PAD.left - PAD.right) / candles.length;
  const bodyW = Math.max(cW * 0.55, 2);

  const allPrices = candles.flatMap(c => [c.high, c.low]);
  const minP = Math.min(...allPrices);
  const maxP = Math.max(...allPrices);
  const range = maxP - minP;

  const toY = (p) => PAD.top + ((maxP - p) / range) * (H - PAD.top - PAD.bottom);
  const toX = (i) => PAD.left + i * cW + cW / 2;

  // Volume bars
  const maxVol = 100;
  const volumes = candles.map(() => 20 + Math.random() * 80);

  // Price labels
  const priceSteps = 5;
  const priceLabels = Array.from({ length: priceSteps }, (_, i) =>
    minP + (range / (priceSteps - 1)) * i
  ).reverse();

  // Time labels
  const timeLabels = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '15:30'];
  const accent = isPositive ? '#39ff14' : '#ef4444';

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 220 }}>
      {/* Grid lines */}
      {priceLabels.map((p, i) => {
        const y = toY(p);
        return (
          <g key={i}>
            <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth={1} strokeDasharray="4,4" />
            <text x={PAD.left - 6} y={y + 4} textAnchor="end" fontSize={9} fill="rgba(255,255,255,0.25)" fontFamily="monospace">
              {p.toFixed(0)}
            </text>
          </g>
        );
      })}

      {/* Volume bars (at bottom, 30px tall max) */}
      {candles.map((c, i) => {
        const x = toX(i);
        const barH = (volumes[i] / maxVol) * 30;
        const isPos = c.close >= c.open;
        return (
          <rect
            key={`vol-${i}`}
            x={x - bodyW / 2}
            y={H - PAD.bottom - barH}
            width={bodyW}
            height={barH}
            fill={isPos ? 'rgba(57,255,20,0.12)' : 'rgba(239,68,68,0.12)'}
          />
        );
      })}

      {/* Candles */}
      {candles.map((c, i) => {
        const x = toX(i);
        const isPos = c.close >= c.open;
        const color = isPos ? '#39ff14' : '#ef4444';
        const openY = toY(c.open);
        const closeY = toY(c.close);
        const highY = toY(c.high);
        const lowY = toY(c.low);
        const bodyTop = Math.min(openY, closeY);
        const bodyH = Math.max(Math.abs(closeY - openY), 1);

        return (
          <g key={i}>
            {/* Wick */}
            <line x1={x} y1={highY} x2={x} y2={lowY} stroke={color} strokeWidth={0.8} opacity={0.6} />
            {/* Body */}
            <rect
              x={x - bodyW / 2}
              y={bodyTop}
              width={bodyW}
              height={bodyH}
              fill={isPos ? color : color}
              opacity={isPos ? 0.85 : 0.7}
              rx={0.5}
            />
          </g>
        );
      })}

      {/* Bottom time axis */}
      {timeLabels.map((t, i) => {
        const x = PAD.left + (i / (timeLabels.length - 1)) * (W - PAD.left - PAD.right);
        return (
          <text key={i} x={x} y={H - 4} textAnchor="middle" fontSize={9} fill="rgba(255,255,255,0.2)" fontFamily="monospace">
            {t}
          </text>
        );
      })}

      {/* Last price line */}
      {(() => {
        const lastClose = candles[candles.length - 1].close;
        const y = toY(lastClose);
        return (
          <g>
            <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke={accent} strokeWidth={0.8} strokeDasharray="3,3" opacity={0.5} />
          </g>
        );
      })()}
    </svg>
  );
}

// ── Order Book ───────────────────────────────────────────────────────────────
function generateOrderBook(basePrice) {
  const asks = Array.from({ length: 8 }, (_, i) => ({
    price: (basePrice + (i + 1) * basePrice * 0.001).toFixed(2),
    qty: (Math.random() * 500 + 50).toFixed(0),
    total: ((Math.random() * 500 + 50) * basePrice * 0.001).toFixed(0),
    width: Math.random() * 80 + 10,
  })).reverse();

  const bids = Array.from({ length: 8 }, (_, i) => ({
    price: (basePrice - (i + 1) * basePrice * 0.001).toFixed(2),
    qty: (Math.random() * 500 + 50).toFixed(0),
    total: ((Math.random() * 500 + 50) * basePrice * 0.001).toFixed(0),
    width: Math.random() * 80 + 10,
  }));

  return { asks, bids };
}

function OrderBook({ basePrice, isPositive }) {
  const { asks, bids } = useRef(generateOrderBook(basePrice)).current;
  const accent = isPositive ? '#39ff14' : '#ef4444';

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-white/50 uppercase tracking-widest">Order Book</span>
        <div className="flex gap-1">
          {['All', 'Buy', 'Sell'].map(t => (
            <button key={t} className={`text-[9px] px-2 py-0.5 rounded font-bold transition-colors ${t === 'All' ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white'}`}>{t}</button>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="grid grid-cols-3 text-[9px] text-white/25 uppercase tracking-widest font-bold mb-1 px-1">
        <span>Price (₹)</span>
        <span className="text-center">Qty</span>
        <span className="text-right">Total</span>
      </div>

      {/* Asks (sell) */}
      <div className="space-y-0.5 mb-1">
        {asks.map((a, i) => (
          <div key={i} className="relative grid grid-cols-3 text-[10px] font-mono px-1 py-[3px] rounded overflow-hidden cursor-pointer hover:bg-white/5">
            <div className="absolute right-0 top-0 bottom-0 bg-red-500/8 rounded" style={{ width: `${a.width}%` }} />
            <span className="text-red-400 font-semibold relative z-10">{a.price}</span>
            <span className="text-white/50 text-center relative z-10">{a.qty}</span>
            <span className="text-white/30 text-right relative z-10">{a.total}</span>
          </div>
        ))}
      </div>

      {/* Spread / Last price */}
      <div className="flex items-center justify-between bg-white/5 rounded px-2 py-1.5 my-1 border border-white/10">
        <span className="font-mono font-black text-sm" style={{ color: accent }}>₹{basePrice.toFixed(2)}</span>
        <span className="text-[9px] text-white/30 font-mono">Spread: {(basePrice * 0.001).toFixed(2)}</span>
      </div>

      {/* Bids (buy) */}
      <div className="space-y-0.5">
        {bids.map((b, i) => (
          <div key={i} className="relative grid grid-cols-3 text-[10px] font-mono px-1 py-[3px] rounded overflow-hidden cursor-pointer hover:bg-white/5">
            <div className="absolute right-0 top-0 bottom-0 bg-green-500/8 rounded" style={{ width: `${b.width}%` }} />
            <span className="text-green-400 font-semibold relative z-10">{b.price}</span>
            <span className="text-white/50 text-center relative z-10">{b.qty}</span>
            <span className="text-white/30 text-right relative z-10">{b.total}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Recent Trades ────────────────────────────────────────────────────────────
function generateTrades(basePrice) {
  const now = new Date();
  return Array.from({ length: 14 }, (_, i) => {
    const isBuy = Math.random() > 0.48;
    const price = basePrice + (Math.random() - 0.5) * basePrice * 0.003;
    const qty = Math.floor(Math.random() * 200 + 1);
    const time = new Date(now.getTime() - i * 8000);
    return {
      time: `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')}`,
      price: price.toFixed(2),
      qty,
      isBuy,
    };
  });
}

function RecentTrades({ basePrice }) {
  const trades = useRef(generateTrades(basePrice)).current;
  return (
    <div>
      <span className="text-xs font-bold text-white/50 uppercase tracking-widest block mb-3">Recent Trades</span>
      <div className="grid grid-cols-3 text-[9px] text-white/25 uppercase tracking-widest font-bold mb-2 px-1">
        <span>Time</span>
        <span className="text-center">Price (₹)</span>
        <span className="text-right">Qty</span>
      </div>
      <div className="space-y-0.5 overflow-hidden">
        {trades.map((t, i) => (
          <div key={i} className="grid grid-cols-3 text-[10px] font-mono px-1 py-[3px] hover:bg-white/5 rounded cursor-pointer">
            <span className="text-white/30">{t.time}</span>
            <span className={`text-center font-semibold ${t.isBuy ? 'text-green-400' : 'text-red-400'}`}>{t.price}</span>
            <span className="text-white/50 text-right">{t.qty}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Trade Panel ──────────────────────────────────────────────────────────────
const ORDER_TABS = ['Limit', 'Market', 'Stop Limit'];
const BOTTOM_TABS = ['Open Orders', 'Order History', 'Holdings', 'P&L'];

function TradePanel({ stock }) {
  const [orderTab, setOrderTab] = useState('Limit');
  const [buyPrice, setBuyPrice] = useState(stock.price.toFixed(2));
  const [buyQty, setBuyQty] = useState('');
  const [sellPrice, setSellPrice] = useState(stock.price.toFixed(2));
  const [sellQty, setSellQty] = useState('');

  return (
    <div className="bento-card p-4 space-y-4">
      {/* Tab strip */}
      <div className="flex gap-1 bg-white/5 rounded-xl p-1 border border-white/10 w-fit">
        {ORDER_TABS.map(t => (
          <button
            key={t}
            onClick={() => setOrderTab(t)}
            className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap ${orderTab === t ? 'bg-white/15 text-white' : 'text-white/30 hover:text-white'}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Buy side */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-white/30 uppercase tracking-widest font-bold">Buy {stock.ticker}</span>
          </div>
          <div className="relative">
            <input
              type="text"
              value={buyPrice}
              onChange={e => setBuyPrice(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-white placeholder-white/20 focus:outline-none focus:border-green-500/40 transition"
              placeholder="Price"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-white/30 font-mono">₹</span>
          </div>
          <div className="relative">
            <input
              type="text"
              value={buyQty}
              onChange={e => setBuyQty(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-white placeholder-white/20 focus:outline-none focus:border-green-500/40 transition"
              placeholder="Quantity"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-white/30 font-mono">QTY</span>
          </div>
          <div className="flex gap-1">
            {['25%', '50%', '75%', '100%'].map(p => (
              <button key={p} className="flex-1 text-[9px] font-bold py-1 rounded-lg bg-white/5 hover:bg-green-500/10 hover:text-green-400 text-white/40 border border-white/10 hover:border-green-500/20 transition">{p}</button>
            ))}
          </div>
          <div className="space-y-1 text-[10px] font-mono">
            <div className="flex justify-between text-white/30"><span>Available</span><span>₹1,24,500.00</span></div>
            <div className="flex justify-between text-white/30"><span>Order Value</span><span>{buyQty ? `₹${(parseFloat(buyPrice || 0) * parseFloat(buyQty || 0)).toFixed(2)}` : '₹0.00'}</span></div>
            <div className="flex justify-between text-white/30"><span>Brokerage</span><span>₹20.00</span></div>
          </div>
          <button className="w-full py-2.5 rounded-xl font-black text-sm tracking-wide bg-green-500 hover:bg-green-400 text-black transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_28px_rgba(34,197,94,0.5)] active:scale-95">
            BUY
          </button>
        </div>

        {/* Sell side */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-white/30 uppercase tracking-widest font-bold">Sell {stock.ticker}</span>
          </div>
          <div className="relative">
            <input
              type="text"
              value={sellPrice}
              onChange={e => setSellPrice(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-white placeholder-white/20 focus:outline-none focus:border-red-500/40 transition"
              placeholder="Price"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-white/30 font-mono">₹</span>
          </div>
          <div className="relative">
            <input
              type="text"
              value={sellQty}
              onChange={e => setSellQty(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-white placeholder-white/20 focus:outline-none focus:border-red-500/40 transition"
              placeholder="Quantity"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-white/30 font-mono">QTY</span>
          </div>
          <div className="flex gap-1">
            {['25%', '50%', '75%', '100%'].map(p => (
              <button key={p} className="flex-1 text-[9px] font-bold py-1 rounded-lg bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-white/40 border border-white/10 hover:border-red-500/20 transition">{p}</button>
            ))}
          </div>
          <div className="space-y-1 text-[10px] font-mono">
            <div className="flex justify-between text-white/30"><span>Holdings</span><span>25 shares</span></div>
            <div className="flex justify-between text-white/30"><span>Order Value</span><span>{sellQty ? `₹${(parseFloat(sellPrice || 0) * parseFloat(sellQty || 0)).toFixed(2)}` : '₹0.00'}</span></div>
            <div className="flex justify-between text-white/30"><span>Brokerage</span><span>₹20.00</span></div>
          </div>
          <button className="w-full py-2.5 rounded-xl font-black text-sm tracking-wide bg-red-500 hover:bg-red-400 text-white transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_28px_rgba(239,68,68,0.5)] active:scale-95">
            SELL
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Timeframe Selector ────────────────────────────────────────────────────────
const TIMEFRAMES = ['1m', '5m', '15m', '30m', '1h', '1D', '1W'];

// ── Main Page ────────────────────────────────────────────────────────────────
export function StockDetail() {
  const { ticker } = useParams();
  const navigate = useNavigate();
  const stock = STOCK_DATA[ticker?.toUpperCase()] || { ...DEFAULT_STOCK, ticker: ticker || 'N/A' };
  const isPositive = stock.change >= 0;
  const accent = isPositive ? '#39ff14' : '#ef4444';
  const [activeTimeframe, setActiveTimeframe] = useState('1h');
  const [bottomTab, setBottomTab] = useState('Open Orders');
  const [watchlisted, setWatchlisted] = useState(false);

  return (
    <div className="space-y-4">
      {/* ── Header ── */}
      <div className="flex items-center gap-4 flex-wrap">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-base text-white/70">
            {stock.name[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-display font-extrabold text-white leading-tight">{stock.ticker}</h1>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/10 border border-white/10 text-white/40 uppercase tracking-widest">{stock.exchange}</span>
            </div>
            <p className="text-xs text-white/30 leading-tight truncate">{stock.name}</p>
          </div>
        </div>

        {/* Price */}
        <div className="text-right">
          <p className="text-2xl font-mono font-black text-white leading-none">₹{stock.price.toFixed(2)}</p>
          <p className={`text-xs font-bold font-mono mt-0.5 flex items-center justify-end gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePct.toFixed(2)}%)
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setWatchlisted(w => !w)}
            className={`p-2 rounded-xl border transition-all ${watchlisted ? 'border-yellow-500/40 bg-yellow-500/10 text-yellow-400' : 'border-white/10 bg-white/5 text-white/30 hover:text-white'}`}
          >
            <Star className="w-4 h-4" fill={watchlisted ? 'currentColor' : 'none'} />
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5">
            <Activity className="w-3 h-3 text-green-400" />
            <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider">Live</span>
          </div>
        </div>
      </div>

      {/* ── Stat Pills ── */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
        {[
          { label: 'Open', value: `₹${stock.open.toFixed(2)}` },
          { label: 'High', value: `₹${stock.high.toFixed(2)}` },
          { label: 'Low', value: `₹${stock.low.toFixed(2)}` },
          { label: 'Prev Close', value: `₹${stock.prevClose.toFixed(2)}` },
          { label: 'Volume', value: stock.volume },
          { label: 'Market Cap', value: stock.marketCap },
          { label: 'P/E Ratio', value: stock.pe },
          { label: '52W High', value: `₹${stock.week52High}` },
        ].map((s, i) => (
          <div key={i} className="bento-card !p-3 text-center">
            <p className="text-[8px] text-white/25 uppercase tracking-widest font-bold mb-1">{s.label}</p>
            <p className="text-xs font-mono font-bold text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-12 gap-4">

        {/* ── LEFT: Chart + Trade Panel ── */}
        <div className="col-span-12 lg:col-span-8 space-y-4">

          {/* Chart Card */}
          <div className="bento-card !p-0 overflow-hidden">
            {/* Chart toolbar */}
            <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-white/5">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-white">{stock.ticker} / INR</span>
                <span className="text-[9px] text-white/30 font-mono border border-white/10 px-2 py-0.5 rounded">NSE</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[9px] font-mono text-white/40">LIVE</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {TIMEFRAMES.map(tf => (
                  <button
                    key={tf}
                    onClick={() => setActiveTimeframe(tf)}
                    className={`px-2 py-0.5 rounded text-[9px] font-bold transition-all ${activeTimeframe === tf ? 'text-white' : 'text-white/25 hover:text-white/60'}`}
                    style={activeTimeframe === tf ? { color: accent } : {}}
                  >
                    {tf}
                  </button>
                ))}
                <div className="w-px h-3 bg-white/10 mx-1" />
                <button className="text-[9px] text-white/30 hover:text-white flex items-center gap-1 transition-colors">
                  <BarChart2 className="w-3 h-3" /> Indicators
                </button>
              </div>
            </div>

            {/* Candlestick chart */}
            <div className="px-2 pt-2 pb-1">
              <CandlestickChart basePrice={stock.price} isPositive={isPositive} />
            </div>
          </div>

          {/* Trade Panel */}
          <TradePanel stock={stock} />

          {/* Bottom tabs: orders */}
          <div className="bento-card !p-0 overflow-hidden">
            <div className="flex items-center gap-0 border-b border-white/5">
              {BOTTOM_TABS.map(t => (
                <button
                  key={t}
                  onClick={() => setBottomTab(t)}
                  className={`px-4 py-3 text-xs font-bold transition-colors border-b-2 ${bottomTab === t ? 'text-white border-current' : 'text-white/30 border-transparent hover:text-white/60'}`}
                  style={bottomTab === t ? { borderColor: accent, color: accent } : {}}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="p-4">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                  <Clock className="w-5 h-5 text-white/20" />
                </div>
                <p className="text-sm text-white/20 font-semibold">No {bottomTab.toLowerCase()} yet</p>
                <p className="text-xs text-white/10 mt-1">Your {bottomTab.toLowerCase()} will appear here</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Order Book + Recent Trades ── */}
        <div className="col-span-12 lg:col-span-4 space-y-4">

          {/* Order Book */}
          <div className="bento-card !p-4">
            <OrderBook basePrice={stock.price} isPositive={isPositive} />
          </div>

          {/* Recent Trades */}
          <div className="bento-card !p-4">
            <RecentTrades basePrice={stock.price} />
          </div>

          {/* Stock Info */}
          <div className="bento-card !p-4 space-y-3">
            <span className="text-xs font-bold text-white/50 uppercase tracking-widest block">Stock Info</span>
            {[
              { label: 'Sector', value: stock.sector },
              { label: '52W Low', value: `₹${stock.week52Low}` },
              { label: '52W High', value: `₹${stock.week52High}` },
              { label: 'P/E', value: stock.pe },
              { label: 'Market Cap', value: stock.marketCap },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between border-b border-white/5 pb-2 last:border-0 last:pb-0">
                <span className="text-[10px] text-white/30 font-mono uppercase tracking-widest">{item.label}</span>
                <span className="text-xs font-mono font-semibold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StockDetail;