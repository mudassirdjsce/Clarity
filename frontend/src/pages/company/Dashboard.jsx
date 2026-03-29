import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RadarSection from '../../components/radar/RadarSection';
import {
  TrendingUp,
  Zap,
  Activity,
  BarChart3,
  ChevronRight,
} from 'lucide-react';
import { ResponsiveContainer } from 'recharts';
import { cn } from '../../lib/utils';
import ReactECharts from 'echarts-for-react';
import RiskExposureMetrics from './RiskExposureMetrics';
import { useTranslation } from 'react-i18next';

// ── Mock candlestick OHLC data (30-min candles, today's session) ──────────────
// Format: [open, close, low, high]
const rawCandles = [
  ['09:00', 41200, 41800, 40900, 42100],
  ['09:30', 41800, 41400, 41100, 42000],
  ['10:00', 41400, 42300, 41200, 42500],
  ['10:30', 42300, 43100, 42100, 43400],
  ['11:00', 43100, 42700, 42400, 43300],
  ['11:30', 42700, 43500, 42500, 43700],
  ['12:00', 43500, 43100, 42800, 43800],
  ['12:30', 43100, 43800, 42900, 44000],
  ['13:00', 43800, 44500, 43600, 44700],
  ['13:30', 44500, 44100, 43800, 44600],
  ['14:00', 44100, 44900, 43900, 45100],
  ['14:30', 44900, 44400, 44100, 45000],
  ['15:00', 44400, 45200, 44200, 45400],
  ['15:30', 45200, 44800, 44600, 45500],
  ['16:00', 44800, 45600, 44500, 45800],
  ['16:30', 45600, 46200, 45300, 46400],
];

const times   = rawCandles.map(d => d[0]);
const candles = rawCandles.map(d => [d[1], d[2], d[3], d[4]]); // [open,close,low,high]
const volumes = rawCandles.map((d, i) => ({
  value: Math.abs(d[2] - d[1]) * 80 + 12000,
  itemStyle: { color: d[2] >= d[1] ? '#39ff1466' : '#ff444466' },
}));


const assets = [
  { name: 'Bitcoin', symbol: 'BTC', price: '₹46,200', change: '+4.2%', color: '#8eff71' },
  { name: 'Ethereum', symbol: 'ETH', price: '₹2,450', change: '-1.8%', color: '#627eea' },
  { name: 'Solana', symbol: 'SOL', price: '₹104', change: '+12.5%', color: '#14f195' },
  { name: 'Apple', symbol: 'AAPL', price: '₹189', change: '+0.5%', color: '#ffffff' },
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
          return `${params.data.source} → ${params.data.target}<br/><b>₹${params.data.value.toLocaleString()}</b>`;
        }
        return `${params.name}<br/><b>₹${params.value ? params.value.toLocaleString() : 0}</b>`;
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
          { name: 'Total Portfolio Value (₹100k)', itemStyle: { color: '#39ff14' } },
          { name: 'Equities', itemStyle: { color: '#2ce60d' } },
          { name: 'Fixed Income', itemStyle: { color: '#ef4444' } },
          { name: 'Alternatives', itemStyle: { color: '#138200' } },
          { name: 'US Tech', itemStyle: { color: '#8eff71' } },
          { name: 'Healthcare', itemStyle: { color: '#5eff40' } },
          { name: 'Corp Bonds', itemStyle: { color: '#dc2626' } },
          { name: 'Real Estate', itemStyle: { color: '#0a4a00' } },
        ],
        links: [
          { source: 'Total Portfolio Value (₹100k)', target: 'Equities', value: 60000 },
          { source: 'Total Portfolio Value (₹100k)', target: 'Fixed Income', value: 30000 },
          { source: 'Total Portfolio Value (₹100k)', target: 'Alternatives', value: 10000 },
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
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight mb-2">
            {t('terminal_overview')}
          </h1>
          <p className="text-white/40 font-medium">
            {t('institutional_node')}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="glass px-4 py-2 rounded-xl border border-white/10 flex items-center justify-center gap-3">
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            <span className="text-xs font-mono text-white/60 uppercase tracking-wider">{t('markets_live')}</span>
          </div>
          <button className="bg-neon-green text-obsidian px-6 py-2 rounded-xl font-bold text-sm shadow-[0_0_20px_rgba(142,255,113,0.3)] hover:scale-105 transition-transform w-full sm:w-auto">
            {t('deposit_funds')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { labelKey: 'total_balance',    value: '₹1,24,502.42', change: '+12.5%', icon: TrendingUp, color: 'text-neon-green' },
          { labelKey: 'day_pnl',          value: '+₹4,204.12',   change: '+4.2%', icon: Zap,        color: 'text-neon-green' },
          { labelKey: 'active_positions', value: '12',           change: 'Stable', icon: Activity,   color: 'text-white/60'   },
          { labelKey: 'risk_score',       value: 'Low',          change: 'Institutional', icon: BarChart3, color: 'text-emerald-400' },
        ].map((stat, i) => (
          <div key={i} className="bento-card group">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-mono text-white/40 uppercase tracking-widest">{t(stat.labelKey)}</p>
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <h3 className="text-lg sm:text-xl font-display font-bold">Portfolio Performance</h3>
            <div className="flex items-center justify-between w-full sm:w-auto gap-4">
              <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10 w-full sm:w-auto overflow-x-auto justify-between sm:justify-start">
                {['1D', '1W', '1M', '1Y', 'ALL'].map(t => (
                  <button key={t} className={cn(
                    "px-3 py-1 rounded-md text-[10px] font-bold transition-all whitespace-nowrap",
                    t === '1D' ? "bg-white/10 text-white" : "text-white/40 hover:text-white"
                  )}>{t}</button>
                ))}
              </div>
              <button className="text-white/40 hover:text-neon-green transition-colors hidden sm:block">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="w-full" style={{ height: 300 }}>
            <ReactECharts
              style={{ height: '100%', width: '100%' }}
              opts={{ renderer: 'canvas' }}
              option={{
                backgroundColor: 'transparent',
                animation: true,
                grid: [
                  { left: 60, right: 12, top: 8, height: '62%' },
                  { left: 60, right: 12, top: '74%', height: '18%' },
                ],
                xAxis: [
                  {
                    type: 'category', data: times, gridIndex: 0,
                    axisLine: { lineStyle: { color: '#ffffff10' } },
                    axisTick: { show: false },
                    axisLabel: { color: '#ffffff40', fontSize: 9, fontFamily: 'monospace' },
                    splitLine: { show: false },
                  },
                  {
                    type: 'category', data: times, gridIndex: 1,
                    axisLine: { lineStyle: { color: '#ffffff10' } },
                    axisTick: { show: false },
                    axisLabel: { show: false },
                    splitLine: { show: false },
                  },
                ],
                yAxis: [
                  {
                    scale: true, gridIndex: 0,
                    axisLine: { show: false },
                    axisTick: { show: false },
                    splitLine: { lineStyle: { color: '#ffffff06', type: 'dashed' } },
                    axisLabel: { color: '#ffffff40', fontSize: 9, fontFamily: 'monospace',
                      formatter: v => `₹${(v/1000).toFixed(1)}k` },
                  },
                  {
                    scale: true, gridIndex: 1,
                    axisLine: { show: false },
                    axisTick: { show: false },
                    splitLine: { show: false },
                    axisLabel: { show: false },
                  },
                ],
                tooltip: {
                  trigger: 'axis',
                  axisPointer: { type: 'cross', crossStyle: { color: '#ffffff20' },
                    lineStyle: { color: '#ffffff20', type: 'dashed' } },
                  backgroundColor: '#0b0f0b',
                  borderColor: 'rgba(255,255,255,0.1)',
                  textStyle: { color: '#fff', fontSize: 11, fontFamily: 'monospace' },
                  formatter: params => {
                    const c = params.find(p => p.seriesName === 'OHLC');
                    const v = params.find(p => p.seriesName === 'Volume');
                    if (!c) return '';
                    const [o, cl, l, h] = c.value;
                    const up = cl >= o;
                    return [
                      `<b style="color:#ffffff88">${c.name}</b>`,
                      `O: <b style="color:${up?'#39ff14':'#ff4444'}">${o.toLocaleString()}</b>`,
                      `H: <b style="color:#ffffff">${h.toLocaleString()}</b>`,
                      `L: <b style="color:#ffffff">${l.toLocaleString()}</b>`,
                      `C: <b style="color:${up?'#39ff14':'#ff4444'}">${cl.toLocaleString()}</b>`,
                      v ? `Vol: <b style="color:#ffffff60">${(v.value/1000).toFixed(1)}k</b>` : '',
                    ].join('&nbsp;&nbsp;');
                  },
                },
                series: [
                  {
                    name: 'OHLC', type: 'candlestick',
                    xAxisIndex: 0, yAxisIndex: 0,
                    data: candles,
                    itemStyle: {
                      color: '#39ff14',        // bullish fill
                      color0: '#ff4444',       // bearish fill
                      borderColor: '#39ff14',
                      borderColor0: '#ff4444',
                    },
                  },
                  {
                    name: 'Volume', type: 'bar',
                    xAxisIndex: 1, yAxisIndex: 1,
                    data: volumes,
                    barMaxWidth: 14,
                  },
                ],
              }}
            />
          </div>
        </div>

        <div className="bento-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-display font-bold">{t('watchlist')}</h3>
            <button onClick={() => navigate('/company/stocks')} className="text-xs font-bold text-neon-green hover:underline">{t('view_all')}</button>
          </div>
          <div className="space-y-4">
            {assets.map((asset, i) => (
              <div onClick={() => navigate('/company/stocks')} key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
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
              {t('portfolio_flow')}
            </h3>
          </div>
          <div className="w-full">
            <PortfolioSankeyChart />
          </div>
        </div>
        
        <div className="h-full">
          <RiskExposureMetrics />
        </div>
      </div>

      {/* ── Multi-Radar Comparison ── */}
      <RadarSection />
    </div>
  );
}
