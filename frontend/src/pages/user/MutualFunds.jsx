import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, Star, Coins, Building2, Briefcase, Sprout,
  Layers, DownloadCloud, CodeSquare, ChevronRight
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ── Mock Data ─────────────────────────────────────────────────────────────────
const popularFunds = [
  { name: 'Quant Small Cap Fund Direct - Growth', type: 'Equity',  returns: '+42.50%', duration: '3Y', isPositive: true, slug: 'quant-small-cap-fund-direct'       },
  { name: 'Nippon India Small Cap Fund - Growth',  type: 'Equity',  returns: '+38.10%', duration: '3Y', isPositive: true, slug: 'nippon-india-small-cap-fund'         },
  { name: 'Parag Parikh Flexi Cap Fund Direct',    type: 'Hybrid',  returns: '+24.20%', duration: '3Y', isPositive: true, slug: 'parag-parikh-flexi-cap-fund'         },
  { name: 'HDFC Mid-Cap Opportunities Fund',       type: 'Equity',  returns: '+31.40%', duration: '3Y', isPositive: true, slug: 'hdfc-mid-cap-opportunities-fund'     },
];

const collections = [
  { label: 'High Return',  icon: TrendingUp,  color: 'text-neon-green',  bg: 'bg-neon-green/10' },
  { label: 'Gold & Silver', icon: Coins,      color: 'text-yellow-400',  bg: 'bg-yellow-400/10' },
  { label: '5 Star Funds', icon: Star,        color: 'text-amber-400',   bg: 'bg-amber-400/10'  },
  { label: 'Large Cap',    icon: Building2,   color: 'text-blue-400',    bg: 'bg-blue-400/10'   },
  { label: 'Mid Cap',      icon: Briefcase,   color: 'text-purple-400',  bg: 'bg-purple-400/10' },
  { label: 'Small Cap',    icon: Sprout,      color: 'text-emerald-400', bg: 'bg-emerald-400/10'},
];

// ── Collection Fund Tables ────────────────────────────────────────────────────
const collectionFunds = {
  'High Return': [
    { name: 'Quant Small Cap Fund Direct',        category: 'Equity · Small Cap',  nav: '₹312.45', ret1y: '+68.2%', ret3y: '+42.5%', risk: 'Very High', slug: 'quant-small-cap-fund-direct'       },
    { name: 'Nippon India Small Cap Fund',         category: 'Equity · Small Cap',  nav: '₹158.30', ret1y: '+55.4%', ret3y: '+38.1%', risk: 'Very High', slug: 'nippon-india-small-cap-fund'         },
    { name: 'HDFC Mid-Cap Opportunities Fund',     category: 'Equity · Mid Cap',    nav: '₹96.18',  ret1y: '+49.8%', ret3y: '+31.4%', risk: 'High',      slug: 'hdfc-mid-cap-opportunities-fund'     },
    { name: 'Motilal Oswal Midcap 150 Index Fund', category: 'Equity · Mid Cap',    nav: '₹43.72',  ret1y: '+46.1%', ret3y: '+29.7%', risk: 'High',      slug: 'hdfc-mid-cap-opportunities-fund'     },
    { name: 'Parag Parikh Flexi Cap Fund',         category: 'Equity · Flexi Cap',  nav: '₹84.60',  ret1y: '+38.9%', ret3y: '+24.2%', risk: 'Moderate',  slug: 'parag-parikh-flexi-cap-fund'         },
  ],
  'Gold & Silver': [
    { name: 'Nippon India Gold ETF FoF',           category: 'Gold Fund',           nav: '₹28.41',  ret1y: '+18.4%', ret3y: '+14.2%', risk: 'Moderate'  },
    { name: 'SBI Gold Fund Direct - Growth',       category: 'Gold Fund',           nav: '₹22.15',  ret1y: '+17.9%', ret3y: '+13.8%', risk: 'Moderate'  },
    { name: 'HDFC Gold Fund Direct - Growth',      category: 'Gold Fund',           nav: '₹21.80',  ret1y: '+17.5%', ret3y: '+13.5%', risk: 'Moderate'  },
    { name: 'Kotak Gold Fund Direct - Growth',     category: 'Gold Fund',           nav: '₹30.55',  ret1y: '+17.2%', ret3y: '+13.2%', risk: 'Moderate'  },
    { name: 'Mirae Asset Silver ETF FoF',          category: 'Silver Fund',         nav: '₹12.88',  ret1y: '+22.1%', ret3y: '+16.7%', risk: 'High'      },
  ],
  '5 Star Funds': [
    { name: 'Parag Parikh Flexi Cap Fund',         category: 'Equity · Flexi Cap',  nav: '₹84.60',  ret1y: '+38.9%', ret3y: '+24.2%', risk: 'Moderate',  slug: 'parag-parikh-flexi-cap-fund'         },
    { name: 'Mirae Asset Large Cap Fund',          category: 'Equity · Large Cap',  nav: '₹118.45', ret1y: '+28.3%', ret3y: '+19.1%', risk: 'Moderate',  slug: 'mirae-asset-large-cap-fund'          },
    { name: 'Axis Bluechip Fund Direct - Growth',  category: 'Equity · Large Cap',  nav: '₹56.72',  ret1y: '+22.6%', ret3y: '+16.4%', risk: 'Moderate',  slug: 'mirae-asset-large-cap-fund'          },
    { name: 'SBI Equity Hybrid Fund Direct',       category: 'Hybrid · Aggressive', nav: '₹305.20', ret1y: '+25.3%', ret3y: '+17.8%', risk: 'Moderate',  slug: 'hdfc-mid-cap-opportunities-fund'     },
    { name: 'HDFC Balanced Advantage Fund',        category: 'Hybrid · BAF',        nav: '₹432.10', ret1y: '+23.7%', ret3y: '+16.9%', risk: 'Moderate',  slug: 'hdfc-mid-cap-opportunities-fund'     },
  ],
  'Large Cap': [
    { name: 'Mirae Asset Large Cap Fund',          category: 'Equity · Large Cap',  nav: '₹118.45', ret1y: '+28.3%', ret3y: '+19.1%', risk: 'Moderate',  slug: 'mirae-asset-large-cap-fund'          },
    { name: 'Axis Bluechip Fund Direct - Growth',  category: 'Equity · Large Cap',  nav: '₹56.72',  ret1y: '+22.6%', ret3y: '+16.4%', risk: 'Moderate',  slug: 'mirae-asset-large-cap-fund'          },
    { name: 'ICICI Pru Bluechip Fund Direct',      category: 'Equity · Large Cap',  nav: '₹98.30',  ret1y: '+26.1%', ret3y: '+18.2%', risk: 'Moderate',  slug: 'mirae-asset-large-cap-fund'          },
    { name: 'Nippon India Large Cap Fund',         category: 'Equity · Large Cap',  nav: '₹82.55',  ret1y: '+24.9%', ret3y: '+17.5%', risk: 'Moderate',  slug: 'mirae-asset-large-cap-fund'          },
    { name: 'Kotak Bluechip Fund Direct - Growth', category: 'Equity · Large Cap',  nav: '₹64.20',  ret1y: '+21.8%', ret3y: '+15.9%', risk: 'Moderate',  slug: 'mirae-asset-large-cap-fund'          },
  ],
  'Mid Cap': [
    { name: 'HDFC Mid-Cap Opportunities Fund',     category: 'Equity · Mid Cap',    nav: '₹96.18',  ret1y: '+49.8%', ret3y: '+31.4%', risk: 'High',      slug: 'hdfc-mid-cap-opportunities-fund'     },
    { name: 'Motilal Oswal Midcap 150 Index Fund', category: 'Equity · Mid Cap',    nav: '₹43.72',  ret1y: '+46.1%', ret3y: '+29.7%', risk: 'High',      slug: 'hdfc-mid-cap-opportunities-fund'     },
    { name: 'Kotak Emerging Equity Fund Direct',   category: 'Equity · Mid Cap',    nav: '₹128.40', ret1y: '+44.3%', ret3y: '+28.6%', risk: 'High',      slug: 'hdfc-mid-cap-opportunities-fund'     },
    { name: 'Nippon India Growth Fund Direct',     category: 'Equity · Mid Cap',    nav: '₹4218.30',ret1y: '+42.7%', ret3y: '+27.1%', risk: 'High',      slug: 'hdfc-mid-cap-opportunities-fund'     },
    { name: 'Axis Midcap Fund Direct - Growth',    category: 'Equity · Mid Cap',    nav: '₹108.55', ret1y: '+36.2%', ret3y: '+22.8%', risk: 'High',      slug: 'hdfc-mid-cap-opportunities-fund'     },
  ],
  'Small Cap': [
    { name: 'Quant Small Cap Fund Direct',         category: 'Equity · Small Cap',  nav: '₹312.45', ret1y: '+68.2%', ret3y: '+42.5%', risk: 'Very High', slug: 'quant-small-cap-fund-direct'         },
    { name: 'Nippon India Small Cap Fund',          category: 'Equity · Small Cap',  nav: '₹158.30', ret1y: '+55.4%', ret3y: '+38.1%', risk: 'Very High', slug: 'nippon-india-small-cap-fund'          },
    { name: 'SBI Small Cap Fund Direct - Growth',  category: 'Equity · Small Cap',  nav: '₹188.70', ret1y: '+48.6%', ret3y: '+32.4%', risk: 'Very High', slug: 'quant-small-cap-fund-direct'         },
    { name: 'Axis Small Cap Fund Direct - Growth', category: 'Equity · Small Cap',  nav: '₹96.45',  ret1y: '+44.1%', ret3y: '+28.9%', risk: 'Very High', slug: 'nippon-india-small-cap-fund'         },
    { name: 'Kotak Small Cap Fund Direct - Growth',category: 'Equity · Small Cap',  nav: '₹284.60', ret1y: '+41.3%', ret3y: '+26.7%', risk: 'Very High', slug: 'quant-small-cap-fund-direct'         },
  ],
};

// Risk badge color helper
const riskColor = (risk) => {
  if (risk === 'Very High') return 'text-red-400 bg-red-400/10 border-red-400/20';
  if (risk === 'High')      return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
  return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
};

const tools = [
  { name: 'NFO Live',      desc: 'Invest in New Fund Offers',           icon: Layers,       badge: '5 open', badgeColor: 'text-purple-400 bg-purple-400/10 border-purple-400/20', iconColor: 'text-purple-400', iconBg: 'bg-purple-400/10' },
  { name: 'Import Funds',  desc: 'Track all mutual funds in one place',  icon: DownloadCloud, badge: null,    iconColor: 'text-blue-400',                                           iconBg: 'bg-blue-400/10'   },
  { name: 'Compare Funds', desc: 'Compare funds side by side',           icon: CodeSquare,   badge: null,    iconColor: 'text-neon-green',                                         iconBg: 'bg-neon-green/10' },
];

// ── Components ─────────────────────────────────────────────────────────────────
function FundCard({ name, type, returns, duration, isPositive, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bento-card group cursor-pointer hover:scale-[1.02] transition-transform duration-200 flex flex-col justify-between min-h-[150px]"
    >
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
  const navigate = useNavigate();
  const [activeCollection, setActiveCollection] = useState(null);

  // Detect if we're in user or company context from the current path
  const basePath = window.location.pathname.startsWith('/company') ? '/company' : '/user';
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-extrabold tracking-tight mb-2">Mutual Funds</h1>
          <p className="text-white/40 font-medium">Discover, compare and invest in top mutual funds</p>
        </div>
        <div className="glass px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></div>
          <span className="text-xs font-mono text-white/60 uppercase tracking-wider">NAV Updated</span>
        </div>
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
              {popularFunds.map((fund, i) => (
                <FundCard
                  key={i}
                  {...fund}
                  onClick={() => navigate(`${basePath}/mutualfund/${fund.slug}`)}
                />
              ))}
            </div>
          </section>

          {/* Collections */}
          <section>
            <h2 className="text-xl font-display font-bold mb-4">Collections</h2>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {collections.map((item, i) => {
                const Icon = item.icon;
                const isActive = activeCollection === item.label;
                return (
                  <div
                    key={i}
                    onClick={() => setActiveCollection(isActive ? null : item.label)}
                    className={cn(
                      'bento-card group flex flex-col items-center justify-center gap-3 py-5 cursor-pointer transition-all duration-200',
                      isActive
                        ? `ring-2 scale-[1.04] ${item.color.replace('text-', 'ring-')}/40`
                        : 'hover:scale-[1.04]'
                    )}
                  >
                    <div className={cn('w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform', item.bg)}>
                      <Icon className={cn('w-5 h-5', item.color)} />
                    </div>
                    <span className={cn('text-[11px] font-semibold text-center leading-tight transition-colors', isActive ? 'text-white' : 'text-white/70 group-hover:text-white')}>
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* ── Collection Fund Table ── */}
            {activeCollection && (() => {
              const funds = collectionFunds[activeCollection] || [];
              const col = collections.find(c => c.label === activeCollection);
              return (
                <div className="mt-6 bento-card !p-0 overflow-hidden animate-fade-in">
                  {/* Table header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      {col && <col.icon className={cn('w-4 h-4', col.color)} />}
                      <span className="text-sm font-bold text-white">{activeCollection}</span>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-white/30 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">Top 5</span>
                    </div>
                    <button
                      onClick={() => setActiveCollection(null)}
                      className="text-xs text-white/30 hover:text-white transition-colors"
                    >
                      ✕ Close
                    </button>
                  </div>

                  {/* Column labels */}
                  <div className="grid grid-cols-12 text-[9px] font-bold uppercase tracking-widest text-white/25 px-5 py-2 border-b border-white/5">
                    <span className="col-span-4">Fund Name</span>
                    <span className="col-span-3">Category</span>
                    <span className="col-span-1 text-right">NAV</span>
                    <span className="col-span-2 text-right">1Y Return</span>
                    <span className="col-span-2 text-right">3Y Return</span>
                  </div>

                  {/* Rows */}
                  <div className="divide-y divide-white/5">
                    {funds.map((fund, idx) => (
                      <div
                        key={idx}
                        onClick={() => fund.slug && navigate(`${basePath}/mutualfund/${fund.slug}`)}
                        className="grid grid-cols-12 items-center px-5 py-3 hover:bg-white/[0.03] transition-colors group cursor-pointer"
                      >
                        {/* Name + risk */}
                        <div className="col-span-4 flex items-center gap-3 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-white/50 group-hover:border-white/20 transition-colors">
                            {idx + 1}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-white leading-tight truncate group-hover:text-neon-green transition-colors">{fund.name}</p>
                            <span className={cn('text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border', riskColor(fund.risk))}>{fund.risk}</span>
                          </div>
                        </div>
                        {/* Category */}
                        <span className="col-span-3 text-[10px] text-white/40 font-mono truncate pl-2">{fund.category}</span>
                        {/* NAV */}
                        <span className="col-span-1 text-[10px] font-mono text-white/60 text-right">{fund.nav}</span>
                        {/* 1Y */}
                        <span className="col-span-2 text-xs font-mono font-bold text-neon-green text-right">{fund.ret1y}</span>
                        {/* 3Y */}
                        <span className="col-span-1 text-xs font-mono font-bold text-neon-green text-right">{fund.ret3y}</span>
                        {/* Arrow */}
                        <span className="col-span-1 flex justify-end">
                          <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/60 transition-colors" />
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="px-5 py-3 border-t border-white/5 flex justify-end">
                    <button className="text-[10px] font-bold text-neon-green hover:underline flex items-center gap-1">
                      View All Funds <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })()}
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
