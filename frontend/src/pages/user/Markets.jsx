import React, { useState } from 'react';
import { 
  Globe, 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Filter, 
  MessageSquare,
  Zap,
  Newspaper
} from 'lucide-react';
import { cn } from '../../lib/utils';

const news = [
  {
    title: "Fed Signals Potential Rate Cut in Q3 as Inflation Cools Faster Than Expected",
    source: "Market Intelligence",
    time: "12m ago",
    impact: "High",
    category: "Macro",
    image: "https://picsum.photos/seed/finance1/400/200"
  },
  {
    title: "Ethereum Layer 2 Adoption Hits All-Time High; Total Value Locked Exceeds $20B",
    source: "Crypto Pulse",
    time: "45m ago",
    impact: "Medium",
    category: "Crypto",
    image: "https://picsum.photos/seed/finance2/400/200"
  },
  {
    title: "NVIDIA Q1 Earnings Preview: Analysts Expect Record Data Center Revenue",
    source: "Tech Insights",
    time: "2h ago",
    impact: "High",
    category: "Equities",
    image: "https://picsum.photos/seed/finance3/400/200"
  }
];

const marketStats = [
  { name: 'S&P 500', value: '5,024.12', change: '+0.85%', trend: 'up' },
  { name: 'Nasdaq', value: '16,274.92', change: '+1.24%', trend: 'up' },
  { name: 'Bitcoin', value: '46,204.10', change: '+4.20%', trend: 'up' },
  { name: 'Gold', value: '2,042.50', change: '-0.15%', trend: 'down' },
  { name: 'USD Index', value: '103.42', change: '-0.42%', trend: 'down' },
];

export function Markets() {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="space-y-8">
      <div className="glass border border-white/10 rounded-2xl p-4 overflow-hidden">
        <div className="flex items-center gap-8 animate-marquee whitespace-nowrap">
          {[...marketStats, ...marketStats].map((stat, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs font-bold text-white/60">{stat.name}</span>
              <span className="text-xs font-mono font-bold">{stat.value}</span>
              <span className={cn(
                "text-[10px] font-bold flex items-center gap-0.5",
                stat.trend === 'up' ? "text-neon-green" : "text-red-500"
              )}>
                {stat.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stat.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-extrabold tracking-tight mb-2">Market Intelligence</h1>
          <p className="text-white/40 font-medium">Real-time global market data and insights.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
          {['Overview', 'Equities', 'Crypto', 'Forex', 'Commodities'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                activeTab === tab ? "bg-neon-green text-obsidian shadow-lg" : "text-white/40 hover:text-white"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-display font-bold flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-neon-green" />
              Latest Intelligence
            </h3>
          </div>

          <div className="space-y-4">
            {news.map((item, i) => (
              <div key={i} className="bento-card group cursor-pointer overflow-hidden flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden shrink-0">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] font-bold text-neon-green uppercase tracking-widest">{item.category}</span>
                      <span className="text-[10px] text-white/30 font-mono">• {item.time}</span>
                    </div>
                    <h4 className="text-lg font-display font-bold leading-tight group-hover:text-neon-green transition-colors">{item.title}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bento-card bg-neon-green/5 border-neon-green/20">
            <h3 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-neon-green" />
              Market Sentiment
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white/60">Fear & Greed Index</span>
                  <span className="text-xs font-mono font-bold text-neon-green">74 (Greed)</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-neon-green w-[74%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
