import React, { useState } from 'react';
import { 
  TrendingUp, Star, Coins, Building2, Briefcase, Sprout,
  Layers, DownloadCloud, CodeSquare, ChevronRight
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ── Mock Data ─────────────────────────────────────────────────────────────────
const popularFunds = [
  { name: 'Quant Small Cap Fund Direct - Growth', type: 'Equity',  returns: '+42.50%', duration: '3Y', isPositive: true  },
  { name: 'Nippon India Small Cap Fund - Growth',  type: 'Equity',  returns: '+38.10%', duration: '3Y', isPositive: true  },
  { name: 'Parag Parikh Flexi Cap Fund Direct',    type: 'Hybrid',  returns: '+24.20%', duration: '3Y', isPositive: true  },
  { name: 'HDFC Mid-Cap Opportunities Fund',       type: 'Equity',  returns: '+31.40%', duration: '3Y', isPositive: true  },
];

const collections = [
  { label: 'High Return',  icon: TrendingUp,  color: 'text-neon-green',  bg: 'bg-neon-green/10' },
  { label: 'Gold & Silver', icon: Coins,      color: 'text-yellow-400',  bg: 'bg-yellow-400/10' },
  { label: '5 Star Funds', icon: Star,        color: 'text-amber-400',   bg: 'bg-amber-400/10'  },
  { label: 'Large Cap',    icon: Building2,   color: 'text-blue-400',    bg: 'bg-blue-400/10'   },
  { label: 'Mid Cap',      icon: Briefcase,   color: 'text-purple-400',  bg: 'bg-purple-400/10' },
  { label: 'Small Cap',    icon: Sprout,      color: 'text-emerald-400', bg: 'bg-emerald-400/10'},
];

const tools = [
  { name: 'NFO Live',      desc: 'Invest in New Fund Offers',           icon: Layers,       badge: '5 open', badgeColor: 'text-purple-400 bg-purple-400/10 border-purple-400/20', iconColor: 'text-purple-400', iconBg: 'bg-purple-400/10' },
  { name: 'Import Funds',  desc: 'Track all mutual funds in one place',  icon: DownloadCloud, badge: null,    iconColor: 'text-blue-400',                                           iconBg: 'bg-blue-400/10'   },
  { name: 'Compare Funds', desc: 'Compare funds side by side',           icon: CodeSquare,   badge: null,    iconColor: 'text-neon-green',                                         iconBg: 'bg-neon-green/10' },
];

// ── Components ─────────────────────────────────────────────────────────────────
function FundCard({ name, type, returns, duration, isPositive }) {
  return (
    <div className="bento-card group cursor-pointer hover:scale-[1.02] transition-transform duration-200 flex flex-col justify-between min-h-[150px]">
      <div className="flex justify-between items-start mb-3">
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-sm text-white/50 group-hover:border-neon-green/30 group-hover:text-neon-green transition-colors">
          {name[0]}
        </div>
        <span className="text-[9px] font-bold uppercase tracking-wider text-white/30 bg-white/5 px-2 py-0.5 rounded border border-white/10">
          {type}
        </span>
      </div>
      <p className="font-semibold text-sm text-white leading-tight mb-3 line-clamp-2">{name}</p>
      <div className="flex items-center gap-1.5 mt-auto">
        <span className={cn('font-mono font-bold text-sm', isPositive ? 'text-neon-green' : 'text-red-400')}>{returns}</span>
        <span className="text-[10px] text-white/30">({duration})</span>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export function MutualFunds() {
  const [activeSubNav, setActiveSubNav] = useState('Explore');

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-extrabold tracking-tight mb-2">Mutual Funds</h1>
          <p className="text-white/40 font-medium">Discover, compare and invest in top mutual funds</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></div>
            <span className="text-xs font-mono text-white/60 uppercase tracking-wider">NAV Updated</span>
          </div>
          <button className="bg-neon-green text-obsidian px-6 py-2 rounded-xl font-bold text-sm shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:scale-105 transition-transform">
            Start SIP
          </button>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1 w-fit border border-white/10">
        {['Explore', 'Dashboard', 'SIPs', 'Watchlist'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveSubNav(tab)}
            className={cn(
              'px-4 py-1.5 rounded-lg text-xs font-bold transition-all',
              activeSubNav === tab
                ? 'bg-neon-green text-obsidian shadow-[0_0_12px_rgba(57,255,20,0.3)]'
                : 'text-white/40 hover:text-white'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">

        {/* LEFT (col-span-8) */}
        <div className="col-span-12 lg:col-span-8 space-y-8">

          {/* Popular Funds */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-bold">Popular Funds</h2>
              <button className="text-xs font-bold text-neon-green hover:underline">View All</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {popularFunds.map((fund, i) => <FundCard key={i} {...fund} />)}
            </div>
          </section>

          {/* Collections */}
          <section>
            <h2 className="text-xl font-display font-bold mb-4">Collections</h2>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {collections.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="bento-card group flex flex-col items-center justify-center gap-3 py-5 cursor-pointer hover:scale-[1.04] transition-transform duration-200">
                    <div className={cn('w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform', item.bg)}>
                      <Icon className={cn('w-5 h-5', item.color)} />
                    </div>
                    <span className="text-[11px] font-semibold text-white/70 text-center leading-tight group-hover:text-white transition-colors">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

        </div>

        {/* RIGHT (col-span-4) */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          
          {/* Investment Summary */}
          <div className="bento-card">
            <h2 className="text-base font-display font-bold text-white mb-1">Your Investments</h2>
            <p className="text-xs text-white/30 mb-6">Mutual funds portfolio overview</p>

            <div className="mb-4">
              <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">Current Value</p>
              <p className="text-3xl font-mono font-bold text-white">₹42,50,000</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="glass rounded-xl p-3 border border-white/5">
                <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-1">1D Returns</p>
                <p className="text-sm font-mono font-bold text-neon-green">+₹12,450</p>
                <p className="text-[10px] text-neon-green/60">+0.30%</p>
              </div>
              <div className="glass rounded-xl p-3 border border-white/5">
                <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-1">Total Returns</p>
                <p className="text-sm font-mono font-bold text-neon-green">+₹8,25,000</p>
                <p className="text-[10px] text-neon-green/60">+24.1%</p>
              </div>
            </div>

            <div className="border-t border-white/5 pt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-white/40 font-medium">Invested Value</span>
                <span className="text-sm font-mono font-bold text-white">₹34,25,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-white/40 font-medium">XIRR</span>
                <span className="text-sm font-mono font-bold text-neon-green">18.4%</span>
              </div>
            </div>
          </div>

          {/* Tools Panel */}
          <div className="bento-card">
            <h2 className="text-base font-display font-bold text-white mb-1">Products &amp; Tools</h2>
            <p className="text-xs text-white/30 mb-4">Enhance your MF journey</p>
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

export default MutualFunds;
