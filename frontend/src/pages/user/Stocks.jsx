import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, BarChart3, ChevronRight, Briefcase, Rocket, BadgeDollarSign, Smartphone } from 'lucide-react';
import { cn } from '../../lib/utils';

// ── Mock Data ─────────────────────────────────────────────────────────────────
const indices = [
  { name: 'NIFTY 50',    value: '22,514.65', change: '+142.20', pct: '+0.64%', isPositive: true  },
  { name: 'SENSEX',      value: '74,227.63', change: '+350.81', pct: '+0.47%', isPositive: true  },
  { name: 'BANKNIFTY',   value: '48,061.30', change: '-42.10',  pct: '-0.09%', isPositive: false },
  { name: 'MIDCAPNIFTY', value: '21,418.90', change: '+89.50',  pct: '+0.42%', isPositive: true  },
];

const topStocks = [
  { name: 'Reliance Ind.', ticker: 'RELIANCE', price: '₹2,950.40', change: '+1.2%',  isPositive: true  },
  { name: 'TCS',           ticker: 'TCS',      price: '₹3,840.10', change: '+0.8%',  isPositive: true  },
  { name: 'HDFC Bank',     ticker: 'HDFCBANK', price: '₹1,440.50', change: '-0.5%',  isPositive: false },
  { name: 'Infosys',       ticker: 'INFY',     price: '₹1,480.20', change: '+2.1%',  isPositive: true  },
];

const moversData = {
  Gainers: [
    { name: 'Tata Motors',   ticker: 'TATAMOTORS', price: '₹1,023.50', change: '+4.5%', vol: '24.5M', isPositive: true  },
    { name: 'Zomato',        ticker: 'ZOMATO',     price: '₹188.40',   change: '+3.2%', vol: '68.2M', isPositive: true  },
    { name: 'ITC',           ticker: 'ITC',        price: '₹428.90',   change: '+2.1%', vol: '18.4M', isPositive: true  },
    { name: 'State Bank',    ticker: 'SBIN',       price: '₹812.30',   change: '+1.8%', vol: '12.1M', isPositive: true  },
    { name: 'HDFC Life',     ticker: 'HDFCLIFE',   price: '₹612.70',   change: '+1.3%', vol: '9.8M',  isPositive: true  },
  ],
  Losers: [
    { name: 'Wipro',         ticker: 'WIPRO',      price: '₹478.20',   change: '-2.8%', vol: '14.1M', isPositive: false },
    { name: 'HCL Tech',      ticker: 'HCLTECH',    price: '₹1,389.60', change: '-1.9%', vol: '8.3M',  isPositive: false },
    { name: 'BPCL',          ticker: 'BPCL',       price: '₹622.40',   change: '-1.5%', vol: '11.2M', isPositive: false },
    { name: 'Bajaj Finance', ticker: 'BAJFINANCE', price: '₹7,241.00', change: '-1.2%', vol: '3.4M',  isPositive: false },
    { name: 'Coal India',    ticker: 'COALINDIA',  price: '₹441.80',   change: '-0.9%', vol: '7.6M',  isPositive: false },
  ],
  'Volume Shockers': [
    { name: 'Adani Ports',   ticker: 'ADANIPORTS', price: '₹1,221.50', change: '+0.4%', vol: '112M',  isPositive: true  },
    { name: 'Yes Bank',      ticker: 'YESBANK',    price: '₹22.45',    change: '+5.1%', vol: '284M',  isPositive: true  },
    { name: 'Vodafone Idea', ticker: 'IDEA',       price: '₹14.20',    change: '+3.6%', vol: '319M',  isPositive: true  },
    { name: 'ONGC',          ticker: 'ONGC',       price: '₹282.30',   change: '-0.3%', vol: '98.7M', isPositive: false },
    { name: 'IRCTC',         ticker: 'IRCTC',      price: '₹816.50',   change: '-0.7%', vol: '76.3M', isPositive: false },
  ],
};

const tools = [
  { name: 'IPO', desc: 'Apply for upcoming IPOs', icon: Rocket, badge: '2 open', badgeColor: 'text-orange-400 bg-orange-400/10 border-orange-400/20', iconColor: 'text-orange-400', iconBg: 'bg-orange-400/10' },
  { name: 'Bonds', desc: 'Government & corporate bonds', icon: BadgeDollarSign, badge: null, iconColor: 'text-blue-400', iconBg: 'bg-blue-400/10' },
  { name: 'Clarity Pay', desc: 'Invest directly via UPI', icon: Smartphone, badge: 'New', badgeColor: 'text-neon-green bg-neon-green/10 border-neon-green/20', iconColor: 'text-neon-green', iconBg: 'bg-neon-green/10' },
];

const TABS = ['Gainers', 'Losers', 'Volume Shockers'];

// ── Components ─────────────────────────────────────────────────────────────────
function StockMiniCard({ name, ticker, price, change, isPositive }) {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/user/stock/${ticker}`)}
      className="bento-card group cursor-pointer hover:scale-[1.02] transition-transform duration-200"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-sm text-white/60 group-hover:border-neon-green/30 group-hover:text-neon-green transition-colors">
          {name[0]}
        </div>
        <span className={cn('text-xs font-bold', isPositive ? 'text-neon-green' : 'text-red-400')}>
          {change}
        </span>
      </div>
      <p className="font-bold text-sm text-white mb-0.5 truncate">{name}</p>
      <p className="text-[10px] font-mono text-white/30 mb-2">{ticker}</p>
      <p className="font-mono font-bold text-base text-white">{price}</p>
    </div>
  );
}

function MoversTable() {
  const [activeTab, setActiveTab] = useState('Gainers');
  const rows = moversData[activeTab] || [];

  return (
    <div className="bento-card">
      {/* Tab strip */}
      <div className="flex items-center gap-1 mb-6 bg-white/5 rounded-xl p-1 w-fit border border-white/10">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap',
              activeTab === tab
                ? 'bg-neon-green text-obsidian shadow-[0_0_12px_rgba(57,255,20,0.3)]'
                : 'text-white/40 hover:text-white'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] text-white/30 uppercase tracking-widest border-b border-white/5">
              <th className="font-semibold pb-3">Company</th>
              <th className="font-semibold pb-3">Market Price</th>
              <th className="font-semibold pb-3">Change</th>
              <th className="font-semibold pb-3 text-right">Volume</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((s, i) => (
              <tr key={i} className="group hover:bg-white/3 cursor-pointer transition-colors">
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-white/50 group-hover:border-neon-green/20 transition-colors">
                      {s.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white leading-tight">{s.name}</p>
                      <p className="text-[10px] font-mono text-white/30">{s.ticker}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 font-mono font-semibold text-sm text-white">{s.price}</td>
                <td className="py-3">
                  <span className={cn(
                    'inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold',
                    s.isPositive ? 'bg-neon-green/10 text-neon-green' : 'bg-red-500/10 text-red-400'
                  )}>
                    {s.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {s.change}
                  </span>
                </td>
                <td className="py-3 text-right font-mono text-sm text-white/40">{s.vol}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 pt-4 border-t border-white/5 text-center">
        <button className="text-xs font-bold text-neon-green hover:underline">View All →</button>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export function Stocks() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-extrabold tracking-tight mb-2">Stocks</h1>
          <p className="text-white/40 font-medium">Real-time market data and trending stocks</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></div>
            <span className="text-xs font-mono text-white/60 uppercase tracking-wider">Markets Live</span>
          </div>
          <select className="glass border border-white/10 rounded-xl px-4 py-2 text-sm text-white/60 bg-transparent focus:outline-none focus:border-neon-green/40 transition cursor-pointer">
            <option className="bg-obsidian">NIFTY 100</option>
            <option className="bg-obsidian">NIFTY 50</option>
            <option className="bg-obsidian">NIFTY 200</option>
          </select>
        </div>
      </div>

      {/* Market Indices */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {indices.map((idx, i) => (
          <div key={i} className="bento-card cursor-pointer">
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-2">{idx.name}</p>
            <p className="text-lg font-mono font-bold text-white mb-1">{idx.value}</p>
            <p className={cn('text-xs font-bold', idx.isPositive ? 'text-neon-green' : 'text-red-400')}>
              {idx.change} <span className="opacity-60">({idx.pct})</span>
            </p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">

        {/* LEFT: Most Bought + Movers */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-bold">Most Searched on Clarity</h2>
              <button className="text-xs font-bold text-neon-green hover:underline">View All</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {topStocks.map((s, i) => <StockMiniCard key={i} {...s} />)}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold mb-4">Top Movers Today</h2>
            <MoversTable />
          </section>
        </div>

        {/* RIGHT: Investments + Tools */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Investment Card (empty state) */}
          <div className="bento-card text-center">
            <h2 className="text-base font-display font-bold text-white mb-1 text-left">Your Investments</h2>
            <p className="text-xs text-white/30 text-left mb-6">Track your stock portfolio</p>
            <div className="py-6 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-neon-green/10 border border-neon-green/20 flex items-center justify-center mb-4">
                <Briefcase className="w-7 h-7 text-neon-green" />
              </div>
              <p className="font-bold text-white mb-1">You haven't invested yet</p>
              <p className="text-xs text-white/40 mb-6 max-w-[180px] leading-relaxed">
                Start your investment journey to build wealth for tomorrow.
              </p>
              <a
                href="https://groww.in"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block text-center bg-neon-green text-obsidian font-bold py-2.5 px-6 rounded-xl shadow-[0_0_20px_rgba(57,255,20,0.2)] hover:scale-105 transition-transform text-sm"
              >
                Start Investing
              </a>
            </div>
          </div>

          {/* Tools Panel */}
          <div className="bento-card">
            <h2 className="text-base font-display font-bold text-white mb-1">Products &amp; Tools</h2>
            <p className="text-xs text-white/30 mb-4">Explore more market options</p>
            <div className="space-y-1">
              {tools.map((tool, i) => {
                const Icon = tool.icon;
                return (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0', tool.iconBg)}>
                        <Icon className={cn('w-4 h-4', tool.iconColor)} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white leading-tight">{tool.name}</p>
                        <p className="text-[10px] text-white/30">{tool.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {tool.badge && (
                        <span className={cn('text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border', tool.badgeColor)}>
                          {tool.badge}
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// also support default export for routing
export default Stocks;
