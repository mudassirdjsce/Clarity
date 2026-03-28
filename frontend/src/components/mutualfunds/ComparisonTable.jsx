import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../../lib/utils';
import { riskColor } from '../../data/mutualFunds';

/**
 * Determine winner direction for a numeric metric.
 * higher = true  → bigger number wins (returns, NAV, AUM)
 * higher = false → smaller number wins (expenseRatio)
 */
function winnerOf(aVal, bVal, higher = true) {
  if (aVal === bVal) return 'tie';
  if (higher) return aVal > bVal ? 'a' : 'b';
  return aVal < bVal ? 'a' : 'b';
}

/** Tiny indicator arrow element */
function WinBadge({ winner, side }) {
  if (winner === 'tie') return <Minus className="w-3 h-3 text-white/20 inline ml-1" />;
  if (winner === side) return <TrendingUp className="w-3 h-3 text-neon-green inline ml-1" />;
  return <TrendingDown className="w-3 h-3 text-red-400 inline ml-1" />;
}

/** Mini horizontal progress bar */
function MiniBar({ value, maxValue, winner, side }) {
  const pct = maxValue > 0 ? Math.min((value / maxValue) * 100, 100) : 0;
  const isWinner = winner === side;
  return (
    <div className="w-full bg-white/5 rounded-full h-1 mt-1.5">
      <div
        className={cn('h-1 rounded-full transition-all duration-500', isWinner ? 'bg-neon-green' : 'bg-red-400/50')}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/** Single metric row */
function MetricRow({ label, aVal, bVal, display, higher = true, showBar = false }) {
  const winner = winnerOf(aVal, bVal, higher);
  const maxVal = Math.max(aVal, bVal);

  const cellClass = (side) =>
    cn(
      'flex-1 text-right px-4 py-3',
      winner === side   && 'text-neon-green',
      winner !== side && winner !== 'tie' && 'text-red-400/70',
      winner === 'tie'  && 'text-white/60'
    );

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] border-b border-white/[0.04] last:border-none">
      {/* Fund A value */}
      <div className={cn(cellClass('a'), 'text-left pl-4 pr-2')}>
        <span className="text-xs font-mono font-bold">
          {display(aVal)}
          <WinBadge winner={winner} side="a" />
        </span>
        {showBar && <MiniBar value={aVal} maxValue={maxVal} winner={winner} side="a" />}
      </div>

      {/* Metric label (centre) */}
      <div className="flex items-center justify-center px-3 py-3 min-w-[110px]">
        <span className="text-[9px] font-bold uppercase tracking-widest text-white/25 text-center leading-tight">
          {label}
        </span>
      </div>

      {/* Fund B value */}
      <div className={cn(cellClass('b'), 'text-right pr-4 pl-2')}>
        <span className="text-xs font-mono font-bold">
          {display(bVal)}
          <WinBadge winner={winner} side="b" />
        </span>
        {showBar && <MiniBar value={bVal} maxValue={maxVal} winner={winner} side="b" />}
      </div>
    </div>
  );
}

/**
 * ComparisonTable
 * Side-by-side bento card table for two mutual funds.
 *
 * Props:
 *  - fundA, fundB : fund objects from allFunds
 */
export default function ComparisonTable({ fundA, fundB }) {
  if (!fundA || !fundB) return null;

  const riskRank = { 'Moderate': 1, 'High': 2, 'Very High': 3 };

  return (
    <div className="rounded-2xl border border-white/8 overflow-hidden bg-white/[0.02]">

      {/* ── Fund Header Cards ── */}
      <div className="grid grid-cols-2 divide-x divide-white/5">
        {[fundA, fundB].map((fund, idx) => (
          <div key={fund.id} className={cn('p-5 flex flex-col gap-3', idx === 0 ? 'items-start' : 'items-end text-right')}>
            {/* Avatar + name */}
            <div className={cn('flex items-center gap-3', idx === 1 && 'flex-row-reverse')}>
              <div className="w-10 h-10 rounded-xl bg-neon-green/10 border border-neon-green/20 flex items-center justify-center text-sm font-bold text-neon-green flex-shrink-0">
                {fund.name[0]}
              </div>
              <div>
                <p className="text-sm font-display font-bold text-white leading-tight line-clamp-2">{fund.name}</p>
                <p className="text-[10px] text-white/40 font-mono mt-0.5">{fund.category}</p>
              </div>
            </div>

            {/* Risk + NAV row */}
            <div className={cn('flex items-center gap-2', idx === 1 && 'flex-row-reverse')}>
              <span className={cn('text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border', riskColor(fund.risk))}>
                {fund.risk}
              </span>
              <span className="text-[10px] font-mono text-white/40">NAV ₹{fund.nav.toLocaleString('en-IN')}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Section: Returns ── */}
      <div className="border-t border-white/5">
        <div className="px-4 py-2 bg-white/[0.02]">
          <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/20 text-center">Performance Returns</p>
        </div>
        <MetricRow
          label="1-Year Return"
          aVal={fundA.returns.oneYear}
          bVal={fundB.returns.oneYear}
          display={(v) => `+${v}%`}
          showBar
        />
        <MetricRow
          label="3-Year Return"
          aVal={fundA.returns.threeYear}
          bVal={fundB.returns.threeYear}
          display={(v) => `+${v}%`}
          showBar
        />
      </div>

      {/* ── Section: Investment Metrics ── */}
      <div className="border-t border-white/5">
        <div className="px-4 py-2 bg-white/[0.02]">
          <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/20 text-center">Investment Metrics</p>
        </div>
        <MetricRow
          label="NAV"
          aVal={fundA.nav}
          bVal={fundB.nav}
          display={(v) => `₹${v.toLocaleString('en-IN')}`}
        />
        <MetricRow
          label="Expense Ratio"
          aVal={fundA.expenseRatio}
          bVal={fundB.expenseRatio}
          display={(v) => `${v}%`}
          higher={false}
        />
        <MetricRow
          label="Min. Investment"
          aVal={fundA.minInvestment}
          bVal={fundB.minInvestment}
          display={(v) => `₹${v.toLocaleString('en-IN')}`}
          higher={false}
        />
        <MetricRow
          label="AUM (₹ Cr)"
          aVal={fundA.aum}
          bVal={fundB.aum}
          display={(v) => `₹${v.toLocaleString('en-IN')} Cr`}
          showBar
        />

        {/* ── Risk row — custom render (text-based, not numeric) ── */}
        {(() => {
          const aRank = riskRank[fundA.risk] ?? 1;
          const bRank = riskRank[fundB.risk] ?? 1;
          const winner = aRank < bRank ? 'a' : aRank > bRank ? 'b' : 'tie';
          return (
            <div className="grid grid-cols-[1fr_auto_1fr]">
              <div className="text-left pl-4 pr-2 py-3">
                <span className={cn('text-xs font-mono font-bold',
                  winner === 'a' ? 'text-neon-green' : winner === 'tie' ? 'text-white/60' : 'text-red-400/70'
                )}>
                  {fundA.risk}
                  {winner === 'a' && <TrendingUp className="w-3 h-3 text-neon-green inline ml-1" />}
                  {winner === 'b' && <TrendingDown className="w-3 h-3 text-red-400 inline ml-1" />}
                  {winner === 'tie' && <Minus className="w-3 h-3 text-white/20 inline ml-1" />}
                </span>
              </div>
              <div className="flex items-center justify-center px-3 py-3 min-w-[110px]">
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/25 text-center leading-tight">Risk Level</span>
              </div>
              <div className="text-right pr-4 pl-2 py-3">
                <span className={cn('text-xs font-mono font-bold',
                  winner === 'b' ? 'text-neon-green' : winner === 'tie' ? 'text-white/60' : 'text-red-400/70'
                )}>
                  {winner === 'b' && <TrendingUp className="w-3 h-3 text-neon-green inline mr-1" />}
                  {winner === 'a' && <TrendingDown className="w-3 h-3 text-red-400 inline mr-1" />}
                  {winner === 'tie' && <Minus className="w-3 h-3 text-white/20 inline mr-1" />}
                  {fundB.risk}
                </span>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
