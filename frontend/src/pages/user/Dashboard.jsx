import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Zap,
  Activity,
  BarChart3,
  ChevronRight,
  Clock
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
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
import { fetchBankAccounts } from '../../services/api';
import { WrappedTriggerButton } from '../common/WrappedPage';



const assets = [
  { name: 'Bitcoin', symbol: 'BTC', price: '$46,200', change: '+4.2%', color: '#8eff71' },
  { name: 'Ethereum', symbol: 'ETH', price: '$2,450', change: '-1.8%', color: '#627eea' },
  { name: 'Solana', symbol: 'SOL', price: '$104', change: '+12.5%', color: '#14f195' },
  { name: 'Apple', symbol: 'AAPL', price: '$189', change: '+0.5%', color: '#ffffff' },
];

export function UserDashboard() {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem('clarity_user');
  const user = storedUser ? JSON.parse(storedUser) : { name: "User", email: "" };
  
  const [allData, setAllData] = useState([]);
  const [timeFilter, setTimeFilter] = useState('1M');
  const [totalBalance, setTotalBalance] = useState(0);
  const [dayPnL, setDayPnL] = useState({ value: 0, percentage: 0 });

  useEffect(() => {
    async function loadData() {
      if (!user?.email) return;
      try {
        const res = await fetchBankAccounts(user.email);
        const accounts = res.accounts || [];
        
        // Sum all current balances
        let sumBal = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
        setTotalBalance(sumBal);
        
        // Collect all transactions
        const allTxs = [];
        accounts.forEach(acc => {
          if (acc.transactions) {
            allTxs.push(...acc.transactions);
          }
        });
        
        // Group by date (YYYY-MM-DD)
        const txsByDate = {};
        allTxs.forEach(tx => {
          const d = new Date(tx.date).toISOString().split('T')[0];
          txsByDate[d] = (txsByDate[d] || 0) + tx.amount;
        });
        
        // Reconstruct balance backward for 365 days
        const days = 365;
        const fullData = [];
        let runningBal = sumBal;
        
        const todayDateStr = new Date().toISOString().split('T')[0];
        const todayNet = txsByDate[todayDateStr] || 0;
        
        for (let i = 0; i <= days; i++) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().split('T')[0];
          
          const name = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          
          fullData.unshift({
            name,
            value: runningBal,
            fullDate: dateStr
          });
          
          const dailyNet = txsByDate[dateStr] || 0;
          runningBal -= dailyNet;
        }
        
        setAllData(fullData);

        // Day PnL calculates based on today's net tx
        const prevBal = sumBal - todayNet;
        const pct = prevBal > 0 ? (todayNet / prevBal) * 100 : 0;
        setDayPnL({ value: todayNet, percentage: pct });

      } catch (err) {
        console.error("Error loading bank data:", err);
      }
    }
    loadData();
  }, [user?.email]);

  const chartData = React.useMemo(() => {
    if (!allData || allData.length === 0) return [];
    
    let daysToTake = 30; // default 1M
    if (timeFilter === '1D') daysToTake = 2; // Yesterday + Today
    else if (timeFilter === '1W') daysToTake = 7;
    else if (timeFilter === '1M') daysToTake = 30;
    else if (timeFilter === '1Y') daysToTake = 365;
    else if (timeFilter === 'ALL') daysToTake = allData.length;
    
    return allData.slice(-daysToTake);
  }, [allData, timeFilter]);

  const { t } = useTranslation();
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight mb-2">
            {t('good_morning')}, {user.name.split(' ')[0]}
          </h1>
          <p className="text-white/40 font-medium">
            Your portfolio {dayPnL.value >= 0 ? "is up" : "is down"} {Math.abs(dayPnL.percentage).toFixed(1)}% today.

          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="glass px-4 py-2 rounded-xl border border-white/10 flex items-center justify-center gap-3">
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            <span className="text-xs font-mono text-white/60 uppercase tracking-wider">{t('markets_live')}</span>
          </div>
          <button
            onClick={() => navigate('/user/profile', { state: { scrollTo: 'savings-goals' } })}
            className="bg-neon-green text-obsidian px-6 py-2 rounded-xl font-bold text-sm shadow-[0_0_20px_rgba(142,255,113,0.3)] hover:scale-105 transition-transform w-full sm:w-auto"
          >
            {t('deposit_funds')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { labelKey: 'total_balance',    value: `₹${totalBalance.toLocaleString()}`, change: 'Dynamic',       icon: TrendingUp, color: 'text-neon-green'  },
          { labelKey: 'day_pnl',          value: `${dayPnL.value >= 0 ? '+' : '-'}₹${Math.abs(dayPnL.value).toLocaleString()}`,  change: `${dayPnL.percentage >= 0 ? '+' : ''}${dayPnL.percentage.toFixed(1)}%`,        icon: Zap,        color: 'text-neon-green'  },
          { labelKey: 'active_positions', value: '12',          change: 'Stable',       icon: Activity,   color: 'text-white/60'   },
          { labelKey: 'risk_score',       value: 'Low',         change: 'Institutional',icon: BarChart3,  color: 'text-emerald-400'},
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
        <div className="text-center sm:text-left">
          <p className="text-[10px] sm:text-xs font-mono tracking-[2px] sm:tracking-[4px] text-neon-green/60 uppercase mb-1">{t('annual_review')}</p>
          <h3 className="text-lg sm:text-xl font-black text-white mb-1">{t('wrapped_title')}</h3>
          <p className="text-xs sm:text-sm text-white/40">{t('wrapped_desc')}</p>
        </div>
        <div className="mt-2 sm:mt-0">
          <WrappedTriggerButton />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bento-card flex flex-col min-h-[400px]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <h3 className="text-lg sm:text-xl font-display font-bold">{t('portfolio_performance')}</h3>
            <div className="flex items-center justify-between w-full sm:w-auto gap-4">
              <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10 w-full sm:w-auto overflow-x-auto justify-between sm:justify-start">
                {['1D', '1W', '1M', '1Y', 'ALL'].map(period => (
                  <button 
                    key={period} 
                    onClick={() => setTimeFilter(period)}
                    className={cn(
                      "px-3 py-1 rounded-md text-[10px] font-bold transition-all whitespace-nowrap",
                      period === timeFilter ? "bg-white/10 text-white" : "text-white/40 hover:text-white"
                    )}
                  >
                    {period}
                  </button>
                ))}
              </div>
              <button className="text-white/40 hover:text-neon-green transition-colors hidden sm:block">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="w-full" style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData}>
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
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Balance']}
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
            <h3 className="text-xl font-display font-bold">{t('watchlist')}</h3>
            <button onClick={() => navigate('/user/stocks')} className="text-xs font-bold text-neon-green hover:underline">{t('view_all')}</button>
          </div>
          <div className="space-y-4">
            {assets.map((asset, i) => (
              <div key={i} onClick={() => navigate('/user/stocks')} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
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
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">{t('recent_activity')}</span>
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
