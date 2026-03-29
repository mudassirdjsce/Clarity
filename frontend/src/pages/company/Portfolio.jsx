import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Area, AreaChart, CartesianGrid
} from 'recharts';
import { 
  ShieldCheck, Activity, AlertTriangle, 
  RefreshCcw, Filter, Download, Plus, LayoutGrid, Zap, Trash2, X
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { fetchInstitutionalHoldings, addInstitutionalHolding, deleteInstitutionalHolding } from '../../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const COLORS = ['#8eff71', '#627eea', '#14f195', '#2775ca', '#c3a634', '#a855f7'];

function calcPnl(holding) {
  const invested = holding.amount * holding.buyPrice;
  const current  = holding.amount * holding.currentPrice;
  const pnl      = current - invested;
  const pct      = invested > 0 ? ((pnl / invested) * 100).toFixed(2) : '0.00';
  return { pnl, pct: parseFloat(pct), current };
}

function fmt(n) {
  return '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-obsidian-soft border border-white/10 p-3 rounded-xl shadow-2xl z-50">
        <p className="text-xs text-white/40 font-mono mb-2">{label}</p>
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-3 text-sm font-bold">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
            <span className="text-white/80">{entry.name}:</span>
            <span style={{ color: entry.color }}>
              {String(entry.value).includes('%') ? entry.value : fmt(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// ── Add holding modal ─────────────────────────────────────────────────────────
const EMPTY_FORM = { name: '', symbol: '', icon: '', amount: '', buyPrice: '', currentPrice: '', color: '#8eff71', risk: 'Medium' };

function AddAssetModal({ onClose, onSave }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const valid = form.name && form.symbol && form.amount && form.buyPrice && form.currentPrice;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!valid) return;
    setSaving(true);
    try { await onSave(form); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-obsidian-soft border border-white/10 rounded-3xl p-8 w-full max-w-md mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold">Add Institutional Asset</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
            <X className="w-5 h-5 text-white/40" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 mb-1 block">Asset Name *</label>
              <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Bitcoin"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#8eff71]/50 placeholder:text-white/20" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 mb-1 block">Symbol *</label>
              <input value={form.symbol} onChange={e => set('symbol', e.target.value.toUpperCase())} placeholder="e.g. BTC"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#8eff71]/50 placeholder:text-white/20" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 mb-1 block">Icon</label>
              <input value={form.icon} onChange={e => set('icon', e.target.value.slice(0,2))} placeholder="₿"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#8eff71]/50 placeholder:text-white/20 text-center" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 mb-1 block">Color</label>
              <input type="color" value={form.color} onChange={e => set('color', e.target.value)}
                className="w-full h-9 rounded-xl border border-white/10 bg-transparent cursor-pointer p-1" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 mb-1 block">Risk</label>
              <select value={form.risk} onChange={e => set('risk', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-2 py-2 text-sm outline-none focus:border-[#8eff71]/50 text-white [&>option]:bg-obsidian">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 mb-1 block">Quantity / Amount *</label>
            <input type="number" step="any" min="0" value={form.amount} onChange={e => set('amount', e.target.value)} placeholder="e.g. 50"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#8eff71]/50 placeholder:text-white/20" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 mb-1 block">Buy Price (₹) *</label>
              <input type="number" step="any" min="0" value={form.buyPrice} onChange={e => set('buyPrice', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#8eff71]/50" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 mb-1 block">Current Price (₹) *</label>
              <input type="number" step="any" min="0" value={form.currentPrice} onChange={e => set('currentPrice', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#8eff71]/50" />
            </div>
          </div>

          <button type="submit" disabled={!valid || saving}
            className="w-full bg-[#8eff71] text-black font-bold py-3 rounded-xl shadow-[0_0_20px_rgba(142,255,113,0.3)] hover:brightness-110 disabled:opacity-50 transition-all mt-4">
            {saving ? 'Saving...' : 'Add Institutional Asset'}
          </button>
        </form>
      </div>
    </div>
  );
}

export function Portfolio() {
  const email = JSON.parse(localStorage.getItem('clarity_user') || '{}').email || '';
  
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!email) { setLoading(false); return; }
    fetchInstitutionalHoldings(email)
      .then(d => setHoldings(d.holdings || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [email]);

  const handleAdd = async (formData) => {
    const res = await addInstitutionalHolding({ ...formData, email });
    setHoldings(prev => [res.holding, ...prev]);
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this asset?')) return;
    await deleteInstitutionalHolding(id);
    setHoldings(prev => prev.filter(h => h._id !== id));
  };

  // Calculations
  const totalValue = holdings.reduce((s, h) => s + calcPnl(h).current, 0);
  const totalInvested = holdings.reduce((s, h) => s + (h.amount * h.buyPrice), 0);
  const totalPnl = holdings.reduce((s, h) => s + calcPnl(h).pnl, 0);
  const totalPnlPct = totalInvested > 0 ? ((totalPnl / totalInvested) * 100).toFixed(2) : '0.00';
  const pnlPctNum = parseFloat(totalPnlPct);

  // Dynamic Beta and exposure
  let totalBetaSum = 0;
  let highRiskTotal = 0;
  holdings.forEach(h => {
    const v = calcPnl(h).current;
    if (h.risk === 'High') { totalBetaSum += v * 1.5; highRiskTotal += v; }
    else if (h.risk === 'Low') { totalBetaSum += v * 0.5; }
    else { totalBetaSum += v * 1.0; }
  });
  const avgBeta = totalValue > 0 ? (totalBetaSum / totalValue) : 0;
  const highRiskExposure = totalValue > 0 ? ((highRiskTotal / totalValue) * 100) : 0;

  const sharpeRatio = holdings.length > 0 ? ((pnlPctNum - 4.0) / (avgBeta * 15)).toFixed(2) : '0.00';
  const var95 = totalValue * 0.05 * avgBeta;

  const performanceData = [
    { day: 'Mon', portfolio: 24000, market: 18000 },
    { day: 'Tue', portfolio: 35000, market: 19000 },
    { day: 'Wed', portfolio: 28000, market: 21000 },
    { day: 'Thu', portfolio: 48000, market: 19500 },
    { day: 'Fri', portfolio: 62000, market: 22000 },
    { day: 'Now', portfolio: 84000, market: 24000 },
  ];

  const pieData = holdings.length ? holdings.map((h, i) => ({
    name: h.symbol,
    value: parseFloat(((calcPnl(h).current / (totalValue || 1)) * 100).toFixed(1)),
    color: h.color || COLORS[i % COLORS.length]
  })) : [{ name: 'Empty', value: 100, color: '#ffffff10' }];

  const exportPDF = () => {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });

    const fmtP = (n) =>
      '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const NEON   = [142, 255, 113];
    const DARK   = [11,  15,  11];
    const WHITE  = [255, 255, 255];
    const MUTED  = [120, 150, 120];
    const RED    = [239, 68,  68];
    const W = doc.internal.pageSize.getWidth();

    // Background
    doc.setFillColor(...DARK);
    doc.rect(0, 0, W, 297, 'F');
    // Accent
    doc.setFillColor(...NEON);
    doc.rect(0, 0, 6, 297, 'F');

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    doc.setTextColor(...NEON);
    doc.text('CLARITY INSTITUTIONAL', 14, 22);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...MUTED);
    doc.text('Portfolio Analysis Report & Risk Assessment', 14, 30);
    doc.text(`Generated: ${new Date().toLocaleString('en-US', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}`, 14, 36);
    if (email) doc.text(`Corporate Terminal: ${email}`, 14, 42);

    doc.setDrawColor(...NEON);
    doc.setLineWidth(0.3);
    doc.line(14, 47, W - 14, 47);

    // Stats
    const stats = [
      { label: 'Total AUM',      value: fmtP(totalValue) },
      { label: 'Total Invested', value: fmtP(totalInvested) },
      { label: 'Total P&L',      value: `${totalPnl >= 0 ? '+' : ''}${fmtP(totalPnl)}` },
      { label: 'P&L %',          value: `${pnlPctNum >= 0 ? '+' : ''}${totalPnlPct}%` },
      { label: 'VaR 95%',        value: fmtP(var95) },
      { label: 'Beta vs S&P 500',value: avgBeta.toFixed(2) },
    ];

    const boxW = (W - 28) / 3;
    stats.forEach((s, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = 14 + col * boxW;
      const y = 53 + row * 20;

      doc.setFillColor(30, 40, 30);
      doc.roundedRect(x, y, boxW - 3, 16, 2, 2, 'F');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(...MUTED);
      doc.text(s.label.toUpperCase(), x + 3, y + 6);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      if (s.label.includes('P&L') || s.label.includes('%')) {
        doc.setTextColor(...(totalPnl >= 0 ? [142, 255, 113] : [239, 68, 68]));
      } else {
        doc.setTextColor(...WHITE);
      }
      doc.text(s.value, x + 3, y + 13);
    });

    // Holdings Table
    const startY = 99;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...NEON);
    doc.text('Institutional Holdings', 14, startY);

    const rows = holdings.map(h => {
      const { pnl, pct, current } = calcPnl(h);
      return [
        h.name,
        h.symbol,
        h.risk,
        `${h.amount}`,
        fmtP(h.buyPrice),
        fmtP(h.currentPrice),
        fmtP(current),
        `${pnl >= 0 ? '+' : ''}${fmtP(pnl)} (${pnl >= 0 ? '+' : ''}${pct}%)`,
      ];
    });

    autoTable(doc, {
      startY: startY + 4,
      head: [['Asset', 'Symbol', 'Risk', 'Qty', 'Buy Price', 'Curr. Price', 'Value', 'P&L']],
      body: rows,
      theme: 'plain',
      styles:     { textColor: WHITE, fillColor: DARK,        fontSize: 8,  font: 'helvetica', cellPadding: 3 },
      headStyles: { textColor: NEON,  fillColor: [20, 30, 20], fontSize: 7, fontStyle: 'bold', lineColor: NEON, lineWidth: 0.2 },
      alternateRowStyles: { fillColor: [18, 26, 18] },
      columnStyles: {
        7: { textColor: totalPnl >= 0 ? NEON : RED, fontStyle: 'bold' },
      },
      didDrawCell: (data) => {
        if (data.column.index === 7 && data.section === 'body') {
          const h = holdings[data.row.index];
          if (h) doc.setTextColor(...(calcPnl(h).pnl >= 0 ? NEON : RED));
        }
      },
      margin: { left: 14, right: 14 },
    });

    // Allocations chart rendering
    const afterTable = doc.lastAutoTable.finalY + 10;
    if (afterTable < 250) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...NEON);
      doc.text('Asset Weighting', 14, afterTable);

      const alloc = holdings.map((h, i) => ({
        sym: h.symbol,
        pct: pieData[i]?.value ?? 0,
        color: h.color || '#8eff71',
      }));

      alloc.forEach((a, i) => {
        const y = afterTable + 6 + i * 7;
        if (y > 270) return;
        const hex = a.color.replace('#', '');
        const r = parseInt(hex.substring(0,2)||'142', 16);
        const g = parseInt(hex.substring(2,4)||'255', 16);
        const b = parseInt(hex.substring(4,6)||'113', 16);

        doc.setFillColor(r, g, b);
        doc.circle(18, y - 1.5, 1.5, 'F');

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...WHITE);
        doc.text(`${a.sym}`, 22, y);

        doc.setFillColor(30, 40, 30);
        doc.roundedRect(55, y - 4, 60, 5, 1, 1, 'F');
        doc.setFillColor(r, g, b);
        let safePct = isNaN(a.pct) ? 0 : a.pct;
        doc.roundedRect(55, y - 4, 60 * (safePct / 100), 5, 1, 1, 'F');

        doc.setTextColor(...MUTED);
        doc.text(`${safePct}%`, 118, y);
      });
    }

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...MUTED);
    doc.text('Generated by Clarity Institutional — Strictly confidential. Not financial advice.', W / 2, 290, { align: 'center' });

    doc.save(`Institutional_Report_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  return (
    <div className="space-y-8">
      {showModal && <AddAssetModal onClose={() => setShowModal(false)} onSave={handleAdd} />}
      
      {/* ── HEADER ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-extrabold tracking-tight mb-2">Institutional Portfolio</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-neon-green" />
              <span className="text-xs font-bold text-neon-green uppercase tracking-wider">Verified Assets</span>
            </div>
            <div className="h-4 w-px bg-white/10"></div>
            <span className="text-xs text-white/40 font-mono flex items-center gap-1">
              <RefreshCcw className="w-3 h-3" /> Live Sync
            </span>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={exportPDF} className="glass px-4 py-2 rounded-xl border border-white/10 text-sm font-bold flex items-center gap-2 hover:bg-white/5 transition-colors text-white">
            <Download className="w-4 h-4" /> Export Report
          </button>
          <button onClick={() => setShowModal(true)} className="bg-neon-green text-obsidian px-6 py-2 rounded-xl font-bold text-sm shadow-[0_0_20px_rgba(142,255,113,0.3)] flex items-center gap-2 hover:scale-105 transition-transform">
            <Plus className="w-4 h-4" /> Add Asset
          </button>
        </div>
      </div>

      {/* ── ADVANCED METRICS ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total AUM', value: fmt(totalValue), colorClass: '' },
          { label: 'Total Invested', value: fmt(totalInvested), colorClass: '' },
          { label: 'Total Return (₹)', value: `${totalPnl >= 0 ? '+' : ''}${fmt(totalPnl)}`, colorClass: totalPnl > 0 ? 'text-neon-green' : totalPnl < 0 ? 'text-red-400' : '' },
          { label: 'Return (%)', value: `${pnlPctNum >= 0 ? '+' : ''}${totalPnlPct}%`, colorClass: pnlPctNum > 0 ? 'text-neon-green' : pnlPctNum < 0 ? 'text-red-400' : '' },
          { label: 'Sharpe Ratio', value: sharpeRatio, colorClass: parseFloat(sharpeRatio) > 1 ? 'text-neon-green' : parseFloat(sharpeRatio) > 0 ? 'text-orange-400' : 'text-red-400' },
        ].map((m, i) => (
          <div key={i} className="bento-card py-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/2 rounded-bl-full group-hover:scale-110 transition-transform"></div>
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">{m.label}</p>
            <h3 className={cn("text-2xl font-display font-bold", m.colorClass)}>{m.value}</h3>
          </div>
        ))}
      </div>

      {/* ── CHARTS ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PIE */}
        <div className="bento-card flex flex-col min-h-[360px]">
          <div className="flex items-center gap-2 mb-6">
            <LayoutGrid className="w-4 h-4 text-white/40" />
            <h3 className="text-xl font-display font-bold">Allocation</h3>
          </div>
          
          <div className="flex-1 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs text-white/40 font-mono uppercase">Assets</span>
              <span className="text-xl font-bold">{holdings.length}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-y-3 gap-x-2 mt-4">
            {pieData.map((asset, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: asset.color }}></div>
                <span className="text-xs text-white/60 truncate">{asset.name}</span>
                <span className="text-xs font-mono font-bold ml-auto">{asset.value === 100 && holdings.length === 0 ? '0' : asset.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* PERFORMANCE */}
        <div className="bento-card lg:col-span-2 flex flex-col min-h-[360px]">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-neon-green" />
              <h3 className="text-xl font-display font-bold">Performance vs Market</h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-2"><div className="w-2 h-2 bg-neon-green rounded-full"></div> Portfolio</div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 bg-purple-400 rounded-full"></div> S&P 500</div>
            </div>
          </div>
          
          <div className="flex-1 w-full -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPort" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8eff71" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8eff71" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMkt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="day" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${(val/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="portfolio" stroke="#8eff71" strokeWidth={4} fillOpacity={1} fill="url(#colorPort)" />
                <Area type="monotone" dataKey="market" stroke="#a855f7" strokeWidth={2} strokeDasharray="6 4" fillOpacity={0.4} fill="url(#colorMkt)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── RISK & ALERTS ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* RISK ARCHITECTURE */}
        <div className="bento-card relative overflow-hidden group">
          <div className="absolute -bottom-24 -right-24 w-64 h-64 border border-white/5 rounded-full pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
          <div className="absolute -bottom-16 -right-16 w-48 h-48 border border-white/5 rounded-full pointer-events-none group-hover:scale-110 transition-transform duration-500"></div>
          <div className="absolute -bottom-8 -right-8 w-32 h-32 border border-white/5 rounded-full pointer-events-none group-hover:scale-110 transition-transform duration-300 bg-linear-to-tr from-white/0 to-white/2"></div>

          <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
              <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Risk Architecture</p>
              <h3 className={cn("text-2xl font-display font-bold", avgBeta > 1.2 ? "text-orange-400" : avgBeta > 0.8 ? "text-neon-green" : "text-white")}>
                {avgBeta > 1.2 ? "Elevated" : avgBeta > 0.8 ? "Balanced" : avgBeta > 0 ? "Conservative" : "Neutral"}
              </h3>
              <p className="text-xs text-white/40 mt-1">Stress testing continuous monitoring</p>
            </div>
            
            <div className="text-right">
              <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">VaR (95%)</p>
              <p className="text-xl font-mono font-bold text-white">{fmt(var95)}</p>
            </div>
          </div>

          <div className="space-y-5 relative z-10">
            <div>
              <div className="flex justify-between items-end mb-1">
                <span className="text-xs font-bold text-white/80">High Risk Exposure</span>
                <span className="text-xs font-mono font-bold text-yellow-400">{highRiskExposure.toFixed(1)}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden flex">
                <div className="h-full bg-linear-to-r from-yellow-500 to-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)] transition-all" style={{ width: `${Math.min(highRiskExposure, 100)}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-1">
                <span className="text-xs font-bold text-white/80">Portfolio Beta vs S&P 500</span>
                <span className="text-xs font-mono font-bold text-red-400">{avgBeta.toFixed(2)}</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden flex relative">
                <div className="absolute top-0 bottom-0 left-[50%] w-px bg-white/40 z-10"></div>
                <div className="h-full bg-linear-to-r from-red-500 to-red-400 rounded-full shadow-[0_0_10px_rgba(248,113,113,0.5)] transition-all" style={{ width: `${Math.min(avgBeta * 50, 100)}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-1">
                <span className="text-xs font-bold text-white/80">Liquidity Score</span>
                <span className="text-xs font-mono font-bold text-neon-green">{holdings.length ? '92 / 100' : '0 / 100'}</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden flex">
                <div className="h-full bg-linear-to-r from-green-500 to-neon-green rounded-full shadow-[0_0_10px_rgba(142,255,113,0.5)] transition-all" style={{ width: holdings.length ? '92%' : '0%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* AI ALERTS */}
        <div className="bento-card flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">AI Insights & Alerts</p>
          </div>
          
          <div className="space-y-3 flex-1">
            <div className="flex items-start gap-3 p-3 bg-yellow-400/5 border border-yellow-400/10 rounded-xl">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-1.5 shrink-0"></div>
              <div>
                <p className="text-sm font-bold text-yellow-500 mb-0.5">Overexposed to Crypto</p>
                <p className="text-xs text-white/40">Consider reducing BTC weight by 5% to maintain Sharpe ratio.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-red-500/5 border border-red-500/10 rounded-xl">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0"></div>
              <div>
                <p className="text-sm font-bold text-red-500 mb-0.5">High Volatility Detected</p>
                <p className="text-xs text-white/40">Market conditions suggest incoming 10-15% swing in top holdings.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-neon-green/5 border border-neon-green/10 rounded-xl">
              <div className="w-1.5 h-1.5 rounded-full bg-neon-green mt-1.5 shrink-0"></div>
              <div>
                <p className="text-sm font-bold text-neon-green mb-0.5">Yield Opportunity</p>
                <p className="text-xs text-white/40">Moving 10% cash to USDC lending could add 4.5% APY.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── HOLDINGS TABLE ───────────────────────────────────────────────── */}
      <div className="bento-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-display font-bold">Institutional Holdings</h3>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors"><Filter className="w-4 h-4 text-white/40" /></button>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-white/30 py-8 text-sm">Loading portfolio...</p>
        ) : holdings.length === 0 ? (
          <div className="text-center py-12 border border-white/5 rounded-2xl bg-white/2">
            <LayoutGrid className="w-10 h-10 text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm">No assets currently held.</p>
            <button onClick={() => setShowModal(true)} className="mt-4 inline-flex items-center gap-2 text-[#8eff71] text-xs font-bold uppercase tracking-widest hover:underline">
              <Plus className="w-3 h-3" /> Add institutional asset
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
                  <th className="px-4 py-2 font-normal">Asset</th>
                  <th className="px-4 py-2 font-normal">Amount</th>
                  <th className="px-4 py-2 font-normal">Value</th>
                  <th className="px-4 py-2 font-normal">Total Return</th>
                  <th className="px-4 py-2 font-normal">Allocation</th>
                  <th className="px-4 py-2 font-normal">Risk Level</th>
                  <th className="px-4 py-2 font-normal"></th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((item) => {
                  const { pnl, pct, current } = calcPnl(item);
                  const pos = pnl > 0;
                  const zero = pnl === 0;
                  // Dynamic allocation % based on actual value
                  const allocPct = totalValue > 0 ? ((current / totalValue) * 100).toFixed(1) : 0;

                  return (
                    <tr key={item._id} className="group cursor-pointer">
                      <td className="px-4 py-3 bg-white/5 first:rounded-l-xl border-y border-l border-white/5 group-hover:bg-white/10 group-hover:border-white/20 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-obsidian flex items-center justify-center border border-white/10 font-mono text-sm shadow-inner" style={{ color: item.color }}>
                            {item.icon}
                          </div>
                          <div>
                            <p className="text-sm font-bold">{item.name}</p>
                            <p className="text-[10px] font-mono text-white/40">{item.symbol}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 bg-white/5 border-y border-white/5 group-hover:bg-white/10 group-hover:border-white/20 transition-all">
                        <p className="text-sm font-mono">{item.amount} {item.symbol}</p>
                      </td>
                      <td className="px-4 py-3 bg-white/5 border-y border-white/5 group-hover:bg-white/10 group-hover:border-white/20 transition-all">
                        <p className="text-sm font-mono font-bold">{fmt(current)}</p>
                      </td>
                      <td className="px-4 py-3 bg-white/5 border-y border-white/5 group-hover:bg-white/10 group-hover:border-white/20 transition-all">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "text-sm font-mono font-bold",
                            zero ? "text-white/40" : pos ? "text-neon-green" : "text-red-400"
                          )}>{pos ? '+' : ''}{fmt(pnl)}</span>
                          <span className={cn(
                            "text-[10px] font-bold px-1.5 py-0.5 rounded",
                            zero ? "bg-white/5 text-white/40" : pos ? "bg-neon-green/10 text-neon-green" : "bg-red-400/10 text-red-400"
                          )}>{pos ? '+' : ''}{pct}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 bg-white/5 border-y border-white/5 group-hover:bg-white/10 group-hover:border-white/20 transition-all">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono">{allocPct}%</span>
                          <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full" style={{ width: `${allocPct}%`, backgroundColor: item.color }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 bg-white/5 border-y border-white/5 group-hover:bg-white/10 group-hover:border-white/20 transition-all">
                        <span className={cn(
                          "text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider",
                          item.risk === 'High' ? "bg-red-500/10 text-red-500 border border-red-500/20" :
                          item.risk === 'Medium' ? "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20" :
                          "bg-neon-green/10 text-neon-green border border-neon-green/20"
                        )}>
                          {item.risk}
                        </span>
                      </td>
                      <td className="px-4 py-3 bg-white/5 last:rounded-r-xl border-y border-r border-white/5 group-hover:bg-white/10 group-hover:border-white/20 transition-all">
                        <button onClick={() => handleDelete(item._id)} className="p-2 hover:bg-red-500/10 rounded transition-colors group/del">
                          <Trash2 className="w-4 h-4 text-white/20 group-hover/del:text-red-400 transition-colors" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}