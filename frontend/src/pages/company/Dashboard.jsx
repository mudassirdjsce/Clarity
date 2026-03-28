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
import ReactECharts from 'echarts-for-react';

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

const PortfolioSankeyChart = () => {
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove',
      backgroundColor: '#0b0f0b',
      borderColor: 'rgba(255,255,255,0.1)',
      textStyle: { color: '#ffffff' },
      formatter: function (params) {
        if (params.data.source) {
          return `${params.data.source} → ${params.data.target}<br/><b>$${params.data.value.toLocaleString()}</b>`;
        }
        return `${params.name}<br/><b>$${params.value ? params.value.toLocaleString() : 0}</b>`;
      },
    },
    series: [
      {
        type: 'sankey',
        left: 0,
        right: 0,
        top: 10,
        bottom: 10,
        nodeAlign: 'justify',
        draggable: true,
        data: [
          { name: 'Total Portfolio Value ($100k)', itemStyle: { color: '#39ff14' } },
          { name: 'Equities', itemStyle: { color: '#2ce60d' } },
          { name: 'Fixed Income', itemStyle: { color: '#1db305' } },
          { name: 'Alternatives', itemStyle: { color: '#138200' } },
          { name: 'US Tech', itemStyle: { color: '#8eff71' } },
          { name: 'Healthcare', itemStyle: { color: '#5eff40' } },
          { name: 'Corp Bonds', itemStyle: { color: '#43c42d' } },
          { name: 'Real Estate', itemStyle: { color: '#0a4a00' } },
        ],
        links: [
          { source: 'Total Portfolio Value ($100k)', target: 'Equities', value: 60000 },
          { source: 'Total Portfolio Value ($100k)', target: 'Fixed Income', value: 30000 },
          { source: 'Total Portfolio Value ($100k)', target: 'Alternatives', value: 10000 },
          { source: 'Equities', target: 'US Tech', value: 40000 },
          { source: 'Equities', target: 'Healthcare', value: 20000 },
          { source: 'Fixed Income', target: 'Corp Bonds', value: 30000 },
          { source: 'Alternatives', target: 'Real Estate', value: 10000 },
        ],
        lineStyle: {
          color: 'source',
          curveness: 0.5,
          opacity: 0.3,
        },
        label: {
          color: '#ffffff',
          fontFamily: 'monospace',
          fontSize: 10,
        },
        itemStyle: {
          borderWidth: 1,
          borderColor: '#ffffff20',
        },
      },
    ],
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: '350px', width: '100%' }}
      opts={{ renderer: 'canvas' }}
    />
  );
};

export function CompanyDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-extrabold tracking-tight mb-2">
            Terminal Overview
          </h1>
          <p className="text-white/40 font-medium">
            Institutional Node #482 • Real-time Liquidity Feed
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
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bento-card overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-display font-bold flex items-center gap-2">
              <Activity className="w-5 h-5 text-neon-green" />
              Portfolio Flow Summary
            </h3>
          </div>
          <div className="w-full">
            <PortfolioSankeyChart />
          </div>
        </div>
        
        <div className="bento-card bg-neon-green/5 border-neon-green/20">
          <h3 className="text-lg font-display font-bold mb-4">AI Insight</h3>
          <p className="text-sm text-white/70 leading-relaxed mb-6">
            Whale accumulation detected in the $45.8k - $46.1k range. Liquidity clusters suggest a potential breakout towards $48.5k within 24-48 hours.
          </p>
          <button className="w-full py-3 rounded-xl bg-neon-green text-obsidian font-bold text-xs uppercase tracking-widest hover:shadow-[0_0_20px_rgba(142,255,113,0.4)] transition-all">
            Execute Strategy
          </button>
        </div>
      </div>
    </div>
  );
}
