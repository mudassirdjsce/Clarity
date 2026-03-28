import React from 'react';
import { 
  PieChart as PieChartIcon, 
  Filter, 
  Download,
  Plus,
  MoreHorizontal,
  History,
  ShieldCheck
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip
} from 'recharts';
import { cn } from '../../lib/utils';

const portfolioData = [
  { name: 'Bitcoin', value: 45, color: '#8eff71' },
  { name: 'Ethereum', symbol: 'ETH', value: 25, color: '#627eea' },
  { name: 'Solana', symbol: 'SOL', value: 15, color: '#14f195' },
  { name: 'USDC', symbol: 'USDC', value: 10, color: '#2775ca' },
  { name: 'Others', symbol: 'ALT', value: 5, color: '#ffffff' },
];

const holdings = [
  { name: 'Bitcoin', symbol: 'BTC', amount: '1.24 BTC', value: '$57,288.00', pnl: '+$12,402', pnlPct: '+27.5%', icon: '₿' },
  { name: 'Ethereum', symbol: 'ETH', amount: '12.50 ETH', value: '$30,625.00', pnl: '+$4,120', pnlPct: '+15.5%', icon: 'Ξ' },
  { name: 'Solana', symbol: 'SOL', amount: '240.00 SOL', value: '$24,960.00', pnl: '-$1,200', pnlPct: '-4.5%', icon: 'S' },
  { name: 'USDC', symbol: 'USDC', amount: '10,000.00 USDC', value: '$10,000.00', pnl: '$0', pnlPct: '0.0%', icon: '$' },
];

export function Portfolio() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-extrabold tracking-tight mb-2">Institutional Portfolio</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-neon-green" />
              <span className="text-xs font-bold text-neon-green uppercase tracking-wider">Verified Assets</span>
            </div>
            <div className="h-4 w-px bg-white/10"></div>
            <span className="text-xs text-white/40 font-mono">Last Sync: 2 mins ago</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="glass px-4 py-2 rounded-xl border border-white/10 text-sm font-bold flex items-center gap-2 hover:bg-white/5 transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="bg-neon-green text-obsidian px-6 py-2 rounded-xl font-bold text-sm shadow-[0_0_20px_rgba(142,255,113,0.3)] flex items-center gap-2 hover:scale-105 transition-transform">
            <Plus className="w-4 h-4" /> Add Asset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bento-card flex flex-col items-center justify-center min-h-[400px]">
          <h3 className="text-xl font-display font-bold self-start mb-8">Asset Allocation</h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={portfolioData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {portfolioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0b0f0b', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bento-card">
              <p className="text-xs font-mono text-white/40 uppercase tracking-widest mb-4">Risk Exposure</p>
              <div className="flex items-end justify-between mb-4">
                <h3 className="text-3xl font-display font-bold">Institutional</h3>
                <span className="text-xs font-bold text-yellow-400">Beta: 1.12</span>
              </div>
            </div>
            <div className="bento-card">
              <p className="text-xs font-mono text-white/40 uppercase tracking-widest mb-4">Projected Yield</p>
              <div className="flex items-end justify-between">
                <h3 className="text-3xl font-display font-bold">14.2%</h3>
                <span className="text-xs font-bold text-neon-green">APY</span>
              </div>
            </div>
          </div>

          <div className="bento-card flex-1">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-display font-bold">Institutional Holdings</h3>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-white/5 rounded-lg transition-colors"><Filter className="w-4 h-4 text-white/40" /></button>
                <button className="p-2 hover:bg-white/5 rounded-lg transition-colors"><History className="w-4 h-4 text-white/40" /></button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
                    <th className="px-4 py-2">Asset</th>
                    <th className="px-4 py-2">Balance</th>
                    <th className="px-4 py-2">Value</th>
                    <th className="px-4 py-2">P&L</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {holdings.map((item, i) => (
                    <tr key={i} className="group cursor-pointer">
                      <td className="px-4 py-3 bg-white/5 first:rounded-l-xl border-y border-l border-white/5 group-hover:border-neon-green/30 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-obsidian flex items-center justify-center border border-white/10 font-mono text-sm">
                            {item.icon}
                          </div>
                          <div>
                            <p className="text-sm font-bold">{item.name}</p>
                            <p className="text-[10px] font-mono text-white/40">{item.symbol}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 bg-white/5 border-y border-white/5 group-hover:border-neon-green/30 transition-all">
                        <p className="text-sm font-mono">{item.amount}</p>
                      </td>
                      <td className="px-4 py-3 bg-white/5 border-y border-white/5 group-hover:border-neon-green/30 transition-all">
                        <p className="text-sm font-mono font-bold">{item.value}</p>
                      </td>
                      <td className="px-4 py-3 bg-white/5 border-y border-white/5 group-hover:border-neon-green/30 transition-all">
                        <div className="flex items-center gap-1">
                          <p className={cn(
                            "text-sm font-mono font-bold",
                            item.pnlPct.startsWith('+') ? "text-neon-green" : item.pnlPct === '0.0%' ? "text-white/40" : "text-red-500"
                          )}>{item.pnl}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 bg-white/5 last:rounded-r-xl border-y border-r border-white/5 group-hover:border-neon-green/30 transition-all">
                        <button className="p-1 hover:bg-white/10 rounded transition-colors">
                          <MoreHorizontal className="w-4 h-4 text-white/40" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
