import React from 'react';
import {
  TrendingUp,
  Zap,
  Activity,
  BarChart3,
  ChevronRight,
  Clock
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { cn } from '../../lib/utils';
import { WrappedTriggerButton } from '../common/WrappedPage';

const data = [
  { name: '00:00', value: 42000 },
  { name: '04:00', value: 43500 },
  { name: '08:00', value: 41800 },
  { name: '12:00', value: 44200 },
  { name: '16:00', value: 45100 },
  { name: '20:00', value: 44800 },
  { name: '23:59', value: 46200 },
];

const assets = [
  { name: 'Bitcoin', symbol: 'BTC', price: '$46,200', change: '+4.2%', color: '#8eff71' },
  { name: 'Ethereum', symbol: 'ETH', price: '$2,450', change: '-1.8%', color: '#627eea' },
  { name: 'Solana', symbol: 'SOL', price: '$104', change: '+12.5%', color: '#14f195' },
  { name: 'Apple', symbol: 'AAPL', price: '$189', change: '+0.5%', color: '#ffffff' },
];

export function UserDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-extrabold tracking-tight mb-2">
            Good Morning, Alex
          </h1>
          <p className="text-white/40 font-medium">
            Your portfolio is up 4.2% today. Bitcoin is leading the rally.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="glass px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></div>
            <span className="text-xs font-mono text-white/60 uppercase tracking-wider">Markets Live</span>
          </div>
          <button className="bg-neon-green text-obsidian px-6 py-2 rounded-xl font-bold text-sm shadow-[0_0_20px_rgba(142,255,113,0.3)] hover:scale-105 transition-transform">
            Deposit Funds
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Balance', value: '$124,502.42', change: '+12.5%', icon: TrendingUp, color: 'text-neon-green' },
          { label: 'Day P&L', value: '+$4,204.12', change: '+4.2%', icon: Zap, color: 'text-neon-green' },
          { label: 'Active Positions', value: '12', change: 'Stable', icon: Activity, color: 'text-white/60' },
          { label: 'Risk Score', value: 'Low', change: 'Institutional', icon: BarChart3, color: 'text-emerald-400' },
        ].map((stat, i) => (
          <div key={i} className="bento-card group">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-mono text-white/40 uppercase tracking-widest">{stat.label}</p>
              <stat.icon className={cn("w-4 h-4", stat.color)} />
            </div>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-mono font-bold tracking-tight">{stat.value}</h3>
              <span className={cn("text-xs font-bold", stat.color)}>{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Financial Wrapped Banner ─────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{
          background: "linear-gradient(120deg, #0a1a0a 0%, #0b1a1a 100%)",
          border: "1px solid rgba(57,255,20,0.18)",
          boxShadow: "0 0 40px rgba(57,255,20,0.04)",
        }}
      >
        {/* Glow blob */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-neon-green/5 blur-[80px] pointer-events-none" />
        <div>
          <p className="text-xs font-mono tracking-[4px] text-neon-green/60 uppercase mb-1">New · Annual Review</p>
          <h3 className="text-xl font-black text-white mb-1">Your Financial Wrapped 2026 is here ✦</h3>
          <p className="text-sm text-white/40">See your top sectors, risk profile, and AI-powered insights.</p>
        </div>
        <WrappedTriggerButton />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bento-card flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-display font-bold">Portfolio Performance</h3>
              <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
                {['1D', '1W', '1M', '1Y', 'ALL'].map(t => (
                  <button key={t} className={cn(
                    "px-3 py-1 rounded-md text-[10px] font-bold transition-all",
                    t === '1D' ? "bg-white/10 text-white" : "text-white/40 hover:text-white"
                  )}>{t}</button>
                ))}
              </div>
            </div>
            <button className="text-white/40 hover:text-neon-green transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="w-full" style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8eff71" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8eff71" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#ffffff20" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fill: '#ffffff40' }}
                />
                <YAxis 
                  stroke="#ffffff20" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fill: '#ffffff40' }}
                  tickFormatter={(v) => `$${v/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0b0f0b', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                  itemStyle={{ color: '#8eff71' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8eff71" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bento-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-display font-bold">Watchlist</h3>
            <button className="text-xs font-bold text-neon-green hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {assets.map((asset, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-neon-green/30 transition-colors">
                    <span className="font-mono font-bold text-xs" style={{ color: asset.color }}>{asset.symbol[0]}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold">{asset.name}</p>
                    <p className="text-[10px] font-mono text-white/40">{asset.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono font-bold">{asset.price}</p>
                  <p className={cn(
                    "text-[10px] font-bold",
                    asset.change.startsWith('+') ? "text-neon-green" : "text-red-500"
                  )}>{asset.change}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-white/40" />
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Recent Activity</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-white/60">Bought 0.04 BTC</span>
                <span className="text-white/30">2h ago</span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-white/60">Sold 12.5 SOL</span>
                <span className="text-white/30">5h ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
