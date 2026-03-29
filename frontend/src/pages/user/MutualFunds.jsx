import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, Star, Coins, Building2, Briefcase, Sprout,
  ChevronRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { allFunds, riskColor } from '../../data/mutualFunds';
import CompareFunds from '../../components/mutualfunds/CompareFunds';
import { useTranslation } from 'react-i18next';

// ── Popular Funds (top 4 from data file) ──────────────────────────────────────
const popularFunds = allFunds.slice(0, 4);

// ── Collections ───────────────────────────────────────────────────────────────
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
  'High Return':  allFunds.filter(f => f.returns.oneYear > 40).slice(0, 5),
  'Gold & Silver':allFunds.filter(f => f.category.includes('Gold') || f.category.includes('Silver')),
  '5 Star Funds': allFunds.filter(f => f.risk === 'Moderate').slice(0, 5),
  'Large Cap':    allFunds.filter(f => f.category.includes('Large Cap')).slice(0, 5),
  'Mid Cap':      allFunds.filter(f => f.category.includes('Mid Cap')).slice(0, 5),
  'Small Cap':    allFunds.filter(f => f.category.includes('Small Cap')).slice(0, 5),
};

// ── Tools (only Compare Funds remains) ────────────────────────────────────────
import { CodeSquare } from 'lucide-react';

const tools = [
  { name: 'Compare Funds', desc: 'Compare funds side by side', icon: CodeSquare, badge: null, iconColor: 'text-neon-green', iconBg: 'bg-neon-green/10' },
];

// ── FundCard ──────────────────────────────────────────────────────────────────
function FundCard({ name, type, returns, duration, isPositive, onClick, onCompare }) {
  const { t } = useTranslation();
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
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-1.5">
          <span className={cn('font-mono font-bold text-sm', isPositive ? 'text-neon-green' : 'text-red-400')}>
            {returns}
          </span>
          <span className="text-[10px] text-white/30">({duration})</span>
        </div>
        {onCompare && (
          <button
            onClick={(e) => { e.stopPropagation(); onCompare(); }}
            className="text-[9px] font-bold text-neon-green/60 hover:text-neon-green border border-neon-green/20 hover:border-neon-green/40 px-2 py-0.5 rounded-lg transition-colors"
          >
            {t('compare')}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export function MutualFunds() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeCollection, setActiveCollection] = useState(null);
  const [compareOpen, setCompareOpen]           = useState(false);
  const [seedFund, setSeedFund]                 = useState(null);

  const basePath = window.location.pathname.startsWith('/company') ? '/company' : '/user';

  const openCompare = (fund = null) => {
    setSeedFund(fund);
    setCompareOpen(true);
  };

  return (
    <>
      {/* ── Compare Modal ── */}
      <CompareFunds
        isOpen={compareOpen}
        onClose={() => setCompareOpen(false)}
        seedFundA={seedFund}
      />

      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-display font-extrabold tracking-tight mb-2">{t('mutual_funds_title')}</h1>
            <p className="text-white/40 font-medium">{t('mutual_funds_sub')}</p>
          </div>
          <div className="glass px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></div>
            <span className="text-xs font-mono text-white/60 uppercase tracking-wider">{t('nav_updated')}</span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-6">

          {/* LEFT (col-span-8) */}
          <div className="col-span-12 lg:col-span-8 space-y-8">

            {/* Popular Funds */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-display font-bold">{t('popular_funds')}</h2>
                <button className="text-xs font-bold text-neon-green hover:underline">{t('view_all')}</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {popularFunds.map((fund, i) => (
                  <FundCard
                    key={i}
                    name={fund.name}
                    type={fund.type}
                    returns={`+${fund.returns.threeYear}%`}
                    duration="3Y"
                    isPositive={true}
                    onClick={() => navigate(`${basePath}/mutualfund/${fund.slug}`)}
                    onCompare={() => openCompare(fund)}
                  />
                ))}
              </div>
            </section>

            {/* Collections */}
            <section>
              <h2 className="text-xl font-display font-bold mb-4">{t('collections')}</h2>
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

              {/* Collection Fund Table */}
              {activeCollection && (() => {
                const funds = collectionFunds[activeCollection] || [];
                const col   = collections.find(c => c.label === activeCollection);
                return (
                  <div className="mt-6 bento-card !p-0 overflow-hidden animate-fade-in">
                    {/* Table header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        {col && <col.icon className={cn('w-4 h-4', col.color)} />}
                        <span className="text-sm font-bold text-white">{activeCollection}</span>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-white/30 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">{t('top_5')}</span>
                      </div>
                      <button
                        onClick={() => setActiveCollection(null)}
                        className="text-xs text-white/30 hover:text-white transition-colors"
                      >
                        {t('close')}
                      </button>
                    </div>

                    {/* Column labels */}
                    <div className="grid grid-cols-12 text-[9px] font-bold uppercase tracking-widest text-white/25 px-5 py-2 border-b border-white/5">
                      <span className="col-span-4">{t('fund_name')}</span>
                      <span className="col-span-3">{t('category')}</span>
                      <span className="col-span-1 text-right">{t('nav')}</span>
                      <span className="col-span-2 text-right">{t('one_yr_return')}</span>
                      <span className="col-span-2 text-right">{t('three_yr_return')}</span>
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
                          <span className="col-span-1 text-[10px] font-mono text-white/60 text-right">₹{fund.nav}</span>
                          {/* 1Y */}
                          <span className="col-span-2 text-xs font-mono font-bold text-neon-green text-right">+{fund.returns.oneYear}%</span>
                          {/* 3Y */}
                          <span className="col-span-1 text-xs font-mono font-bold text-neon-green text-right">+{fund.returns.threeYear}%</span>
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
                        {t('view_all_funds')} <ChevronRight className="w-3 h-3" />
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
              <h2 className="text-base font-display font-bold text-white mb-1">{t('your_investments')}</h2>
              <p className="text-xs text-white/30 mb-6">{t('mf_portfolio_overview')}</p>

              <div className="mb-4">
                <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">{t('current_value')}</p>
                <p className="text-3xl font-mono font-bold text-white">₹42,50,000</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="glass rounded-xl p-3 border border-white/5">
                  <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-1">{t('one_d_returns')}</p>
                  <p className="text-sm font-mono font-bold text-neon-green">+₹12,450</p>
                  <p className="text-[10px] text-neon-green/60">+0.30%</p>
                </div>
                <div className="glass rounded-xl p-3 border border-white/5">
                  <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-1">{t('total_returns')}</p>
                  <p className="text-sm font-mono font-bold text-neon-green">+₹8,25,000</p>
                  <p className="text-[10px] text-neon-green/60">+24.1%</p>
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-white/40 font-medium">{t('invested_value')}</span>
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
              <h2 className="text-base font-display font-bold text-white mb-1">{t('products_tools')}</h2>
              <p className="text-xs text-white/30 mb-4">{t('enhance_mf')}</p>
              <div className="space-y-1">
                {tools.map((tool, i) => {
                  const Icon = tool.icon;
                  return (
                    <div
                      key={i}
                      onClick={() => openCompare()}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group"
                    >
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
    </>
  );
}

export default MutualFunds;
