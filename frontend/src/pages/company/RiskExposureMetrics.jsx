import React from 'react';
import { cn } from '../../lib/utils';

export default function RiskExposureMetrics() {
  const data = [
    { label: "Market Volatility Exposure", status: "High", value: "0.84 β", progress: 84 },
    { label: "Liquidity Concentration Risk", status: "Medium", value: "0.42", progress: 42 },
    { label: "USD/EUR Currency Divergence Risk", status: "Low", value: "0.12", progress: 12 },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'High': return 'bg-red-500/10 text-red-500 border border-red-500/20';
      case 'Medium': return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
      case 'Low': return 'bg-neon-green/10 text-neon-green border border-neon-green/20';
      default: return 'bg-white/10 text-white border border-white/20';
    }
  };

  const getBarColor = (status) => {
    switch(status) {
      case 'High': return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]';
      case 'Medium': return 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]';
      case 'Low': return 'bg-neon-green shadow-[0_0_10px_rgba(57,255,20,0.5)]';
      default: return 'bg-white/40';
    }
  };

  return (
    <div className="bento-card flex flex-col h-full">
      <h2 className="text-xl font-display font-bold tracking-tight mb-6">
        Risk Exposure Metrics
      </h2>
      
      <div className="flex-1 space-y-6">
        {data.map((item, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-sm font-semibold text-white/80">{item.label}</span>
              <div className="flex items-center gap-3">
                <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm", getStatusColor(item.status))}>
                  {item.status}
                </span>
                <span className="text-sm font-mono font-bold text-white w-12 text-right">{item.value}</span>
              </div>
            </div>
            
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10 shadow-inner">
              <div 
                className={cn("h-full rounded-full transition-all duration-1000 ease-out", getBarColor(item.status))}
                style={{ width: `${item.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-5 border-t border-white/10">
        <p className="text-xs text-white/40 leading-relaxed font-medium">
          Current exposure correlates strongly with tech-heavy benchmarks. Market volatility is the primary driver of variance for 14M AUM.
        </p>
      </div>
    </div>
  );
}
