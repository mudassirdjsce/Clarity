import React from 'react';
import { ArrowLeftRight, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

const riskRank = { Moderate: 1, High: 2, 'Very High': 3 };

/**
 * Higher = true means bigger value wins; false means smaller wins.
 */
const metrics = [
  { key: '1Y Return',      get: (f) => f.returns.oneYear,    higher: true },
  { key: '3Y Return',      get: (f) => f.returns.threeYear,  higher: true },
  { key: 'NAV',            get: (f) => f.nav,                higher: true },
  { key: 'Expense Ratio',  get: (f) => f.expenseRatio,       higher: false },
  { key: 'Min Investment', get: (f) => f.minInvestment,      higher: false },
  { key: 'AUM',            get: (f) => f.aum,                higher: true  },
];

function buildSummary(fundA, fundB) {
  let aWins = 0;
  let bWins = 0;
  const aAdvantages = [];
  const bAdvantages = [];

  metrics.forEach(({ key, get, higher }) => {
    const aVal = get(fundA);
    const bVal = get(fundB);
    if (aVal === bVal) return;
    const aIsBetter = higher ? aVal > bVal : aVal < bVal;
    if (aIsBetter) { aWins++; aAdvantages.push(key.toLowerCase()); }
    else           { bWins++; bAdvantages.push(key.toLowerCase()); }
  });

  // Risk commentary
  const aRisk = riskRank[fundA.risk] ?? 1;
  const bRisk = riskRank[fundB.risk] ?? 1;
  const riskNote =
    aRisk < bRisk
      ? `${shortName(fundA)} carries lower risk`
      : aRisk > bRisk
      ? `${shortName(fundB)} carries lower risk`
      : 'both carry similar risk';

  // Headline
  let headline;
  if (aWins === bWins) {
    headline = `It's a close call — ${shortName(fundA)} and ${shortName(fundB)} are nearly evenly matched.`;
  } else {
    const winner = aWins > bWins ? fundA : fundB;
    const loser  = aWins > bWins ? fundB : fundA;
    headline = `${shortName(winner)} leads overall with ${Math.max(aWins, bWins)} metric wins vs ${Math.min(aWins, bWins)}.`;
  }

  // Detail sentence
  const detail = `${shortName(fundA)} excels in ${listify(aAdvantages) || 'no metrics'}, while ${shortName(fundB)} excels in ${listify(bAdvantages) || 'no metrics'}. Overall, ${riskNote}.`;

  return { headline, detail, aWins, bWins };
}

function shortName(fund) {
  // Use first two words of fund name for brevity
  return fund.name.split(' ').slice(0, 3).join(' ');
}

function listify(arr) {
  if (!arr.length) return '';
  if (arr.length === 1) return arr[0];
  return arr.slice(0, -1).join(', ') + ' & ' + arr.at(-1);
}

/**
 * ComparisonSummary
 *
 * Props:
 *  - fundA, fundB : fund objects
 *  - onSwap       : () => void — swaps the two fund positions
 */
export default function ComparisonSummary({ fundA, fundB, onSwap }) {
  if (!fundA || !fundB) return null;

  const { headline, detail, aWins, bWins } = buildSummary(fundA, fundB);

  return (
    <div className="rounded-2xl border border-neon-green/10 bg-neon-green/[0.03] p-5 space-y-4">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-neon-green/10 border border-neon-green/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-neon-green" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-neon-green/70">Smart Summary</p>
        </div>

        {/* Swap button */}
        <button
          onClick={onSwap}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white hover:border-white/20 hover:bg-white/[0.08] transition-all duration-200 text-xs font-semibold"
        >
          <ArrowLeftRight className="w-3 h-3" />
          Swap
        </button>
      </div>

      {/* Win bar */}
      <div>
        <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest mb-1.5">
          <span className={cn(aWins >= bWins ? 'text-neon-green' : 'text-white/30')}>
            {fundA.name.split(' ')[0]} · {aWins} wins
          </span>
          <span className="text-white/20">vs</span>
          <span className={cn(bWins >= aWins ? 'text-neon-green' : 'text-white/30')}>
            {bWins} wins · {fundB.name.split(' ')[0]}
          </span>
        </div>
        <div className="flex gap-1 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-neon-green rounded-full transition-all duration-500"
            style={{ width: `${(aWins / (aWins + bWins)) * 100}%` }}
          />
          <div
            className="bg-blue-400 rounded-full transition-all duration-500"
            style={{ width: `${(bWins / (aWins + bWins)) * 100}%` }}
          />
        </div>
      </div>

      {/* Summary text */}
      <div className="space-y-1.5">
        <p className="text-sm font-semibold text-white leading-snug">{headline}</p>
        <p className="text-xs text-white/40 leading-relaxed">{detail}</p>
      </div>
    </div>
  );
}
