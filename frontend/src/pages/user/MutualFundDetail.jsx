import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, Activity, BarChart2, Star, ShieldCheck } from 'lucide-react';

// ── Master Fund Database ─────────────────────────────────────────────────────
const FUND_DB = {
  'quant-small-cap-fund-direct': {
    name: 'Quant Small Cap Fund Direct - Growth',
    shortName: 'Quant Small Cap',
    slug: 'quant-small-cap-fund-direct',
    category: 'Equity · Small Cap',
    amc: 'Quant Mutual Fund',
    nav: 312.45,
    navChange: +4.12,
    navChangePct: +1.34,
    ret1y: '+68.2%',
    ret3y: '+42.5%',
    ret5y: '+31.8%',
    minSip: '₹500',
    expenseRatio: '0.62%',
    aum: '₹22,048 Cr',
    risk: 'Very High',
    rating: 5,
    fundManager: 'Ankit Pande',
    launchDate: 'Jan 2013',
    exitLoad: '1% if redeemed within 1 year',
    benchmark: 'BSE 250 SmallCap TRI',
    holdings: [
      { stock: 'Reliance Industries', sector: 'Energy', weight: '9.2%', change: '+1.8%' },
      { stock: 'HDFC Bank',           sector: 'Banking', weight: '7.4%', change: '-0.3%' },
      { stock: 'Infosys',             sector: 'IT',      weight: '6.8%', change: '+2.1%' },
      { stock: 'ITC Ltd',             sector: 'FMCG',   weight: '5.9%', change: '+0.6%' },
      { stock: 'Tata Motors',         sector: 'Auto',    weight: '4.7%', change: '+4.5%' },
    ],
    navHistory: [280, 285, 275, 290, 295, 288, 302, 308, 305, 312, 298, 315, 312],
  },
  'nippon-india-small-cap-fund': {
    name: 'Nippon India Small Cap Fund - Growth',
    shortName: 'Nippon Small Cap',
    slug: 'nippon-india-small-cap-fund',
    category: 'Equity · Small Cap',
    amc: 'Nippon India Mutual Fund',
    nav: 158.30,
    navChange: +2.10,
    navChangePct: +1.34,
    ret1y: '+55.4%',
    ret3y: '+38.1%',
    ret5y: '+28.9%',
    minSip: '₹100',
    expenseRatio: '0.74%',
    aum: '₹54,904 Cr',
    risk: 'Very High',
    rating: 5,
    fundManager: 'Samir Rachh',
    launchDate: 'Sep 2010',
    exitLoad: '1% if redeemed within 1 year',
    benchmark: 'S&P BSE 250 SmallCap TRI',
    holdings: [
      { stock: 'KPIT Technologies',   sector: 'IT',       weight: '3.4%', change: '+2.3%' },
      { stock: 'Tube Investments',    sector: 'Auto Anc', weight: '2.9%', change: '+1.1%' },
      { stock: 'Karur Vysya Bank',    sector: 'Banking',  weight: '2.7%', change: '-0.5%' },
      { stock: 'Bharat Electronics',  sector: 'Defence',  weight: '2.5%', change: '+0.8%' },
      { stock: 'Cams Services',       sector: 'Finance',  weight: '2.2%', change: '+1.4%' },
    ],
    navHistory: [138, 142, 135, 148, 151, 145, 153, 158, 154, 160, 155, 162, 158],
  },
  'parag-parikh-flexi-cap-fund': {
    name: 'Parag Parikh Flexi Cap Fund Direct - Growth',
    shortName: 'PPFAS Flexi Cap',
    slug: 'parag-parikh-flexi-cap-fund',
    category: 'Equity · Flexi Cap',
    amc: 'PPFAS Mutual Fund',
    nav: 84.60,
    navChange: +1.20,
    navChangePct: +1.44,
    ret1y: '+38.9%',
    ret3y: '+24.2%',
    ret5y: '+22.1%',
    minSip: '₹1000',
    expenseRatio: '0.55%',
    aum: '₹79,640 Cr',
    risk: 'Moderate',
    rating: 5,
    fundManager: 'Rajeev Thakkar',
    launchDate: 'May 2013',
    exitLoad: '2% if redeemed within 1 year',
    benchmark: 'BSE 500 TRI',
    holdings: [
      { stock: 'Bajaj Holdings',      sector: 'Finance',  weight: '8.8%', change: '+1.2%' },
      { stock: 'ITC Ltd',             sector: 'FMCG',     weight: '7.6%', change: '+0.6%' },
      { stock: 'Alphabet (Google)',   sector: 'Tech',     weight: '6.4%', change: '+1.9%' },
      { stock: 'Meta Platforms',      sector: 'Tech',     weight: '5.7%', change: '+2.4%' },
      { stock: 'HCL Technologies',    sector: 'IT',       weight: '5.1%', change: '+0.9%' },
    ],
    navHistory: [72, 74, 70, 76, 79, 77, 81, 83, 80, 85, 82, 86, 84],
  },
  'hdfc-mid-cap-opportunities-fund': {
    name: 'HDFC Mid-Cap Opportunities Fund - Growth',
    shortName: 'HDFC Mid Cap',
    slug: 'hdfc-mid-cap-opportunities-fund',
    category: 'Equity · Mid Cap',
    amc: 'HDFC Mutual Fund',
    nav: 96.18,
    navChange: -0.82,
    navChangePct: -0.85,
    ret1y: '+49.8%',
    ret3y: '+31.4%',
    ret5y: '+25.6%',
    minSip: '₹100',
    expenseRatio: '0.79%',
    aum: '₹72,114 Cr',
    risk: 'High',
    rating: 4,
    fundManager: 'Chirag Setalvad',
    launchDate: 'Jun 2007',
    exitLoad: '1% if redeemed within 1 year',
    benchmark: 'S&P BSE 150 MidCap TRI',
    holdings: [
      { stock: 'Cholamandalam Finance', sector: 'NBFC',    weight: '4.2%', change: '+1.5%' },
      { stock: 'Indian Hotels',         sector: 'Hotels',  weight: '3.8%', change: '+2.1%' },
      { stock: 'Page Industries',       sector: 'Textile', weight: '3.5%', change: '-0.4%' },
      { stock: 'Max Healthcare',        sector: 'Health',  weight: '3.1%', change: '+0.8%' },
      { stock: 'Mphasis',               sector: 'IT',      weight: '2.9%', change: '+1.2%' },
    ],
    navHistory: [82, 85, 80, 88, 91, 87, 93, 96, 92, 98, 95, 99, 96],
  },
  'mirae-asset-large-cap-fund': {
    name: 'Mirae Asset Large Cap Fund - Growth',
    shortName: 'Mirae Large Cap',
    slug: 'mirae-asset-large-cap-fund',
    category: 'Equity · Large Cap',
    amc: 'Mirae Asset Mutual Fund',
    nav: 118.45,
    navChange: +1.05,
    navChangePct: +0.89,
    ret1y: '+28.3%',
    ret3y: '+19.1%',
    ret5y: '+17.4%',
    minSip: '₹1000',
    expenseRatio: '0.51%',
    aum: '₹40,228 Cr',
    risk: 'Moderate',
    rating: 5,
    fundManager: 'Gaurav Misra',
    launchDate: 'Apr 2008',
    exitLoad: '1% if redeemed within 1 year',
    benchmark: 'BSE 100 TRI',
    holdings: [
      { stock: 'HDFC Bank',        sector: 'Banking',  weight: '10.1%', change: '-0.5%' },
      { stock: 'Reliance Ind.',    sector: 'Energy',   weight: '9.3%',  change: '+1.2%' },
      { stock: 'Infosys',          sector: 'IT',       weight: '7.8%',  change: '+2.1%' },
      { stock: 'ICICI Bank',       sector: 'Banking',  weight: '6.9%',  change: '+0.7%' },
      { stock: 'TCS',              sector: 'IT',       weight: '5.4%',  change: '+0.8%' },
    ],
    navHistory: [104, 107, 101, 109, 112, 108, 114, 117, 113, 119, 116, 120, 118],
  },
};

const DEFAULT_FUND = {
  name: 'Unknown Fund',
  shortName: 'N/A',
  category: 'Equity',
  amc: 'N/A',
  nav: 100.00,
  navChange: 0,
  navChangePct: 0,
  ret1y: 'N/A', ret3y: 'N/A', ret5y: 'N/A',
  minSip: 'N/A', expenseRatio: 'N/A', aum: 'N/A',
  risk: 'Moderate', rating: 0,
  fundManager: 'N/A', launchDate: 'N/A', exitLoad: 'N/A', benchmark: 'N/A',
  holdings: [],
  navHistory: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
};

// ── Candlestick Chart (SVG-based) — identical to StockDetail ─────────────────
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
              fill={color}
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

// ── Risk badge ────────────────────────────────────────────────────────────────
function RiskBadge({ risk }) {
  const colors = {
    'Very High': 'text-red-400 bg-red-400/10 border-red-400/20',
    'High':      'text-orange-400 bg-orange-400/10 border-orange-400/20',
    'Moderate':  'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    'Low':       'text-green-400 bg-green-400/10 border-green-400/20',
  };
  return (
    <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${colors[risk] || colors['Moderate']}`}>
      {risk}
    </span>
  );
}

// ── Rating Stars ──────────────────────────────────────────────────────────────
function RatingStars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={`w-3 h-3 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-white/15'}`} />
      ))}
    </div>
  );
}

// ── Timeframes ────────────────────────────────────────────────────────────────
const TIMEFRAMES = ['1M', '3M', '6M', '1Y', '3Y', '5Y', 'MAX'];

// ── Main Page ─────────────────────────────────────────────────────────────────
export function MutualFundDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const fund = FUND_DB[slug] || { ...DEFAULT_FUND, name: slug || 'Unknown Fund' };
  const isPositive = fund.navChange >= 0;
  const accent = isPositive ? '#39ff14' : '#ef4444';
  const [activeTimeframe, setActiveTimeframe] = useState('1Y');
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
            {fund.name[0]}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-display font-extrabold text-white leading-tight">{fund.shortName}</h1>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/10 border border-white/10 text-white/40 uppercase tracking-widest">{fund.amc}</span>
              <RiskBadge risk={fund.risk} />
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-xs text-white/30 leading-tight truncate">{fund.category}</p>
              <RatingStars rating={fund.rating} />
            </div>
          </div>
        </div>

        {/* NAV */}
        <div className="text-right">
          <p className="text-2xl font-mono font-black text-white leading-none">₹{fund.nav.toFixed(2)}</p>
          <p className={`text-xs font-bold font-mono mt-0.5 flex items-center justify-end gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {isPositive ? '+' : ''}{fund.navChange.toFixed(2)} ({isPositive ? '+' : ''}{fund.navChangePct.toFixed(2)}%)
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
            <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider">Live NAV</span>
          </div>
        </div>
      </div>

      {/* ── Stat Pills ── */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
        {[
          { label: '1Y Return',   value: fund.ret1y },
          { label: '3Y Return',   value: fund.ret3y },
          { label: '5Y Return',   value: fund.ret5y },
          { label: 'Min SIP',     value: fund.minSip },
          { label: 'Expense',     value: fund.expenseRatio },
          { label: 'AUM',         value: fund.aum },
          { label: 'Risk',        value: fund.risk },
          { label: 'Rating',      value: `${fund.rating}/5 ★` },
        ].map((s, i) => (
          <div key={i} className="bento-card !p-3 text-center">
            <p className="text-[8px] text-white/25 uppercase tracking-widest font-bold mb-1">{s.label}</p>
            <p className={`text-xs font-mono font-bold ${s.label.includes('Return') ? (isPositive ? 'text-green-400' : 'text-red-400') : 'text-white'}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Top Row: NAV Chart + Fund Info ── */}
      <div className="grid grid-cols-12 gap-4">

        {/* NAV Chart */}
        <div className="col-span-12 lg:col-span-8">
          <div className="bento-card !p-0 overflow-hidden">
            {/* Chart toolbar */}
            <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-white/5">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-white">{fund.shortName} NAV</span>
                <span className="text-[9px] text-white/30 font-mono border border-white/10 px-2 py-0.5 rounded">AMFI</span>
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
                  <BarChart2 className="w-3 h-3" /> Benchmark
                </button>
              </div>
            </div>
            {/* Candlestick chart */}
            <div className="px-2 pt-2 pb-1">
              <CandlestickChart basePrice={fund.nav} isPositive={isPositive} />
            </div>
          </div>
        </div>

        {/* Fund Info — right of chart */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bento-card !p-4 space-y-3 h-full">
            <span className="text-xs font-bold text-white/50 uppercase tracking-widest block">Fund Info</span>
            {[
              { label: 'Fund Manager',    value: fund.fundManager },
              { label: 'Launch Date',     value: fund.launchDate },
              { label: 'Benchmark',       value: fund.benchmark },
              { label: 'Exit Load',       value: fund.exitLoad },
              { label: 'Expense Ratio',   value: fund.expenseRatio },
            ].map((item, i) => (
              <div key={i} className="flex items-start justify-between border-b border-white/5 pb-2 last:border-0 last:pb-0 gap-2">
                <span className="text-[10px] text-white/30 font-mono uppercase tracking-widest flex-shrink-0">{item.label}</span>
                <span className="text-xs font-mono font-semibold text-white text-right leading-tight">{item.value}</span>
              </div>
            ))}
            {/* Shield badge */}
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
              <ShieldCheck className="w-4 h-4 text-green-400 flex-shrink-0" />
              <span className="text-[10px] text-white/30">SEBI Registered · AMFI Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Row: Top Holdings + NAV History ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Top Holdings */}
        <div className="bento-card !p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-white/50 uppercase tracking-widest">Top Holdings</span>
            <span className="text-[9px] text-white/25 font-mono">% of Portfolio</span>
          </div>
          {/* Column headers */}
          <div className="grid grid-cols-12 text-[9px] font-bold uppercase tracking-widest text-white/20 mb-2 px-1">
            <span className="col-span-5">Stock</span>
            <span className="col-span-3">Sector</span>
            <span className="col-span-2 text-right">Weight</span>
            <span className="col-span-2 text-right">1D</span>
          </div>
          <div className="space-y-0.5">
            {fund.holdings.map((h, i) => (
              <div key={i} className="grid grid-cols-12 items-center px-1 py-2 rounded hover:bg-white/[0.03] transition-colors cursor-pointer group">
                <div className="col-span-5 flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-white/5 border border-white/10 flex items-center justify-center text-[9px] font-bold text-white/40 group-hover:border-white/20 transition-colors flex-shrink-0">
                    {i + 1}
                  </div>
                  <span className="text-[10px] font-semibold text-white truncate">{h.stock}</span>
                </div>
                <span className="col-span-3 text-[9px] text-white/35 font-mono truncate pl-1">{h.sector}</span>
                <span className="col-span-2 text-[10px] font-mono font-bold text-white text-right">{h.weight}</span>
                <span className={`col-span-2 text-[10px] font-mono font-bold text-right ${h.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                  {h.change}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* NAV History Table */}
        <div className="bento-card !p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-white/50 uppercase tracking-widest">NAV History</span>
            <span className="text-[9px] text-white/25 font-mono uppercase tracking-widest">Last 12 months</span>
          </div>
          {/* Column headers */}
          <div className="grid grid-cols-3 text-[9px] font-bold uppercase tracking-widest text-white/20 mb-2 px-1">
            <span>Month</span>
            <span className="text-center">NAV (₹)</span>
            <span className="text-right">Change</span>
          </div>
          <div className="space-y-0.5">
            {fund.navHistory.slice().reverse().slice(0, 10).map((nav, i, arr) => {
              const prev = arr[i + 1];
              const change = prev != null ? nav - prev : 0;
              const pct = prev != null ? ((change / prev) * 100).toFixed(2) : '0.00';
              const month = ['Dec','Nov','Oct','Sep','Aug','Jul','Jun','May','Apr','Mar','Feb','Jan'][i] || `M${i+1}`;
              return (
                <div key={i} className="grid grid-cols-3 items-center px-1 py-2 rounded hover:bg-white/[0.03] transition-colors">
                  <span className="text-[10px] text-white/40 font-mono">{month}</span>
                  <span className="text-[10px] font-mono font-bold text-white text-center">₹{nav.toFixed(2)}</span>
                  <span className={`text-[10px] font-mono font-bold text-right ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {change >= 0 ? '+' : ''}{pct}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

export default MutualFundDetail;
