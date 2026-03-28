import React, { useState, useEffect } from 'react';
import { X, GitCompare } from 'lucide-react';
import { cn } from '../../lib/utils';
import { allFunds } from '../../data/mutualFunds';
import FundSelector      from './FundSelector';
import ComparisonTable   from './ComparisonTable';
import ComparisonSummary from './ComparisonSummary';

/**
 * CompareFunds
 * A full-height slide-in modal drawer for comparing two mutual funds.
 *
 * Props:
 *  - isOpen    : boolean
 *  - onClose   : () => void
 *  - seedFundA : optional fund object to pre-seed slot A (from FundCard click)
 */
export default function CompareFunds({ isOpen, onClose, seedFundA = null }) {
  const [fundA, setFundA] = useState(null);
  const [fundB, setFundB] = useState(null);

  // Seed Fund A when prop changes
  useEffect(() => {
    if (seedFundA) setFundA(seedFundA);
  }, [seedFundA]);

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else         document.body.style.overflow = '';
    return ()   => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleSwap = () => {
    setFundA(fundB);
    setFundB(fundA);
  };

  const handleClose = () => {
    onClose();
    // Reset after animation finishes
    setTimeout(() => { setFundA(null); setFundB(null); }, 300);
  };

  const readyToCompare = fundA && fundB;

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        onClick={handleClose}
        className={cn(
          'fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      />

      {/* ── Drawer ── */}
      <div
        className={cn(
          'fixed top-0 right-0 z-50 h-full w-full max-w-2xl bg-[#080d08] border-l border-white/8',
          'shadow-2xl transition-transform duration-300 ease-in-out flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-neon-green/10 border border-neon-green/20 flex items-center justify-center">
              <GitCompare className="w-4 h-4 text-neon-green" />
            </div>
            <div>
              <h2 className="text-base font-display font-bold text-white">Compare Funds</h2>
              <p className="text-[10px] text-white/30 font-mono uppercase tracking-wider">Side-by-side analysis</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">

          {/* ── Fund Selectors ── */}
          <div className="grid grid-cols-2 gap-4">
            <FundSelector
              funds={allFunds}
              selected={fundA}
              onChange={setFundA}
              disabledId={fundB?.id}
              label="Fund A"
            />
            <FundSelector
              funds={allFunds}
              selected={fundB}
              onChange={setFundB}
              disabledId={fundA?.id}
              label="Fund B"
            />
          </div>

          {/* ── Placeholder when no funds selected ── */}
          {!readyToCompare && (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/3 border border-white/8 flex items-center justify-center">
                <GitCompare className="w-7 h-7 text-white/20" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white/40">
                  {!fundA && !fundB
                    ? 'Select two funds to compare'
                    : 'Now select a second fund'}
                </p>
                <p className="text-xs text-white/20 mt-1">
                  {!fundA && !fundB
                    ? 'Use the dropdowns above to get started'
                    : 'Pick from the dropdown on the right'}
                </p>
              </div>
            </div>
          )}

          {/* ── Comparison content ── */}
          {readyToCompare && (
            <div className="space-y-5 animate-[fadeIn_0.3s_ease]">

              {/* Smart Summary (with Swap button inside) */}
              <ComparisonSummary
                fundA={fundA}
                fundB={fundB}
                onSwap={handleSwap}
              />

              {/* Side-by-side table */}
              <ComparisonTable fundA={fundA} fundB={fundB} />
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 border-t border-white/5 flex-shrink-0 flex items-center justify-between">
          <p className="text-[10px] text-white/20 font-mono">
            Data is indicative · Past returns ≠ future performance
          </p>
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white/40 hover:text-white hover:border-white/20 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}
