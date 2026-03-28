import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { riskColor } from '../../data/mutualFunds';

/**
 * FundSelector
 * A searchable dropdown to pick one mutual fund.
 *
 * Props:
 *  - funds       : allFunds array
 *  - selected    : currently selected fund object (or null)
 *  - onChange    : (fund) => void
 *  - disabledId  : id of the fund selected in the OTHER slot (prevent duplicates)
 *  - label       : "Fund A" | "Fund B"
 */
export default function FundSelector({ funds, selected, onChange, disabledId, label }) {
  const [open, setOpen]       = useState(false);
  const [query, setQuery]     = useState('');
  const containerRef          = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = funds.filter((f) =>
    f.name.toLowerCase().includes(query.toLowerCase()) ||
    f.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (fund) => {
    onChange(fund);
    setOpen(false);
    setQuery('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange(null);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Label */}
      <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">{label}</p>

      {/* Trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border transition-all duration-200 text-left',
          open
            ? 'bg-neon-green/5 border-neon-green/30 shadow-[0_0_15px_rgba(57,255,20,0.07)]'
            : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.07]'
        )}
      >
        {selected ? (
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Avatar */}
            <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-white/60">
              {selected.name[0]}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate leading-tight">{selected.name}</p>
              <p className="text-[10px] text-white/40 font-mono truncate">{selected.category}</p>
            </div>
          </div>
        ) : (
          <span className="text-sm text-white/30 flex-1">Select a fund…</span>
        )}

        <div className="flex items-center gap-1 flex-shrink-0">
          {selected && (
            <span
              onClick={handleClear}
              className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-red-400/20 hover:text-red-400 text-white/30 transition-colors"
            >
              <X className="w-3 h-3" />
            </span>
          )}
          <ChevronDown className={cn('w-4 h-4 text-white/30 transition-transform duration-200', open && 'rotate-180')} />
        </div>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-2 rounded-xl border border-white/10 bg-[#0d120d] backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-white/5">
            <Search className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or category…"
              className="flex-1 bg-transparent text-sm text-white placeholder-white/20 outline-none"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-white/20 hover:text-white/60">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Fund list */}
          <div className="max-h-64 overflow-y-auto scrollbar-thin">
            {filtered.length === 0 ? (
              <p className="text-center text-xs text-white/20 py-6">No funds found</p>
            ) : (
              filtered.map((fund) => {
                const isDisabled = fund.id === disabledId;
                const isSelected = selected?.id === fund.id;
                return (
                  <button
                    key={fund.id}
                    disabled={isDisabled}
                    onClick={() => handleSelect(fund)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
                      isDisabled  && 'opacity-30 cursor-not-allowed',
                      isSelected  && 'bg-neon-green/5',
                      !isDisabled && !isSelected && 'hover:bg-white/5'
                    )}
                  >
                    <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-white/50">
                      {fund.name[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-white truncate leading-tight">{fund.name}</p>
                      <p className="text-[10px] text-white/30 font-mono">{fund.category}</p>
                    </div>
                    <span className={cn('text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border flex-shrink-0', riskColor(fund.risk))}>
                      {fund.risk}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
