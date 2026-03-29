import React, { useState, useEffect } from 'react';
import {
  PieChart as PieChartIcon,
  Filter,
  Download,
  Plus,
  MoreHorizontal,
  History,
  ShieldCheck,
  Trash2,
  X,
  FileText,
  Lock,
  Eye,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { cn } from '../../lib/utils';
import { fetchHoldings, addHolding, deleteHolding } from '../../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { encryptPdfBlob } from '../../lib/securePdf';
import SecurePDFViewer from '../../components/SecurePDFViewer';

// ── Helpers ───────────────────────────────────────────────────────────────────
const COLORS = ['#8eff71', '#627eea', '#14f195', '#2775ca', '#f7931a', '#e84142', '#c3a634'];

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

// ── Add Holding Modal ─────────────────────────────────────────────────────────
const EMPTY_FORM = { name: '', symbol: '', icon: '', amount: '', buyPrice: '', currentPrice: '', color: '#8eff71' };

function AddHoldingModal({ onClose, onSave }) {
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
      <div className="bg-obsidian-soft border border-white/10 rounded-3xl p-8 w-full max-w-md mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold">Add Holding</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
            <X className="w-5 h-5 text-white/40" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 mb-1 block">Asset Name *</label>
              <input value={form.name} onChange={e => set('name', e.target.value)}
                placeholder="e.g. Bitcoin"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#8eff71]/50 transition-colors placeholder:text-white/20" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 mb-1 block">Symbol *</label>
              <input value={form.symbol} onChange={e => set('symbol', e.target.value.toUpperCase())}
                placeholder="e.g. BTC"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#8eff71]/50 transition-colors placeholder:text-white/20" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 mb-1 block">Icon (1 char)</label>
              <input value={form.icon} onChange={e => set('icon', e.target.value.slice(0,2))}
                placeholder="₿"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#8eff71]/50 transition-colors placeholder:text-white/20" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 mb-1 block">Chart Color</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={form.color} onChange={e => set('color', e.target.value)}
                  className="w-10 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer" />
                <span className="text-xs font-mono text-white/40">{form.color}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 mb-1 block">Quantity / Amount *</label>
            <input type="number" step="any" min="0" value={form.amount} onChange={e => set('amount', e.target.value)}
              placeholder="e.g. 1.24"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#8eff71]/50 transition-colors placeholder:text-white/20" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 mb-1 block">Buy Price (₹) *</label>
              <input type="number" step="any" min="0" value={form.buyPrice} onChange={e => set('buyPrice', e.target.value)}
                placeholder="e.g. 42000"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#8eff71]/50 transition-colors placeholder:text-white/20" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 mb-1 block">Current Price (₹) *</label>
              <input type="number" step="any" min="0" value={form.currentPrice} onChange={e => set('currentPrice', e.target.value)}
                placeholder="e.g. 51000"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#8eff71]/50 transition-colors placeholder:text-white/20" />
            </div>
          </div>

          {/* Live P&L preview */}
          {form.amount && form.buyPrice && form.currentPrice && (
            <div className="bg-[#8eff71]/5 border border-[#8eff71]/20 rounded-xl p-3 text-xs flex gap-6">
              {(() => {
                const inv = parseFloat(form.amount) * parseFloat(form.buyPrice);
                const cur = parseFloat(form.amount) * parseFloat(form.currentPrice);
                const diff = cur - inv;
                const pct  = inv > 0 ? ((diff / inv) * 100).toFixed(2) : '0.00';
                const pos  = diff >= 0;
                return (
                  <>
                    <span className="text-white/40">Current Value: <b className="text-white">{fmt(cur)}</b></span>
                    <span className={pos ? 'text-[#8eff71]' : 'text-red-400'}>
                      P&L: {pos ? '+' : ''}{fmt(diff)} ({pos ? '+' : ''}{pct}%)
                    </span>
                  </>
                );
              })()}
            </div>
          )}

          <button type="submit" disabled={!valid || saving}
            className="w-full bg-[#8eff71] text-black font-bold py-3 rounded-xl shadow-[0_0_20px_rgba(142,255,113,0.3)] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-2">
            {saving ? 'Saving...' : 'Add Holding'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export function Portfolio() {
  const email = JSON.parse(localStorage.getItem('clarity_user') || '{}').email || '';

  const [holdings, setHoldings]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showViewer, setShowViewer] = useState(false);
  const [exporting, setExporting]   = useState(false);

  useEffect(() => {
    if (!email) { setLoading(false); return; }
    fetchHoldings(email)
      .then(d => setHoldings(d.holdings || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [email]);

  const handleAdd = async (formData) => {
    const res = await addHolding({ ...formData, email });
    setHoldings(prev => [res.holding, ...prev]);
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this holding?')) return;
    await deleteHolding(id);
    setHoldings(prev => prev.filter(h => h._id !== id));
  };

  /**
   * exportSecurePDF
   * Generates the PDF exactly as before, but instead of calling doc.save()
   * it converts the output to a Blob, AES-encrypts it, and downloads
   * a .secure file that can only be decrypted inside Clarity.
   */
  const exportSecurePDF = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const doc = new jsPDF({ unit: 'mm', format: 'a4' });

      const fmtP = (n) =>
        '₹' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const NEON   = [142, 255, 113];
      const DARK   = [11,  15,  11];
      const WHITE  = [255, 255, 255];
      const MUTED  = [120, 150, 120];
      const RED    = [239, 68,  68];
      const W = doc.internal.pageSize.getWidth();

      doc.setFillColor(...DARK);
      doc.rect(0, 0, W, 297, 'F');
      doc.setFillColor(...NEON);
      doc.rect(0, 0, 6, 297, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(26);
      doc.setTextColor(...NEON);
      doc.text('CLARITY', 14, 22);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...MUTED);
      doc.text('Portfolio Analysis Report', 14, 30);
      doc.text(`Generated: ${new Date().toLocaleString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}`, 14, 36);
      if (email) doc.text(`Account: ${email}`, 14, 42);

      // ── Watermark with user name + timestamp ──
      doc.setGState(doc.GState({ opacity: 0.05 }));
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(40);
      doc.setTextColor(...NEON);
      doc.text('CLARITY SECURE', W / 2, 150, { align: 'center', angle: 35 });
      doc.setGState(doc.GState({ opacity: 1 }));

      doc.setDrawColor(...NEON);
      doc.setLineWidth(0.3);
      doc.line(14, 47, W - 14, 47);

      const stats = [
        { label: 'Total Value',    value: fmtP(totalValue) },
        { label: 'Total Invested', value: fmtP(totalInvested) },
        { label: 'Total P&L',     value: `${totalPnl >= 0 ? '+' : ''}${fmtP(totalPnl)}` },
        { label: 'P&L %',         value: `${pnlPctNum >= 0 ? '+' : ''}${totalPnlPct}%` },
        { label: 'Risk Level',    value: risk.label },
        { label: 'Beta (\u03b2)',   value: risk.beta },
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
        } else if (s.label === 'Risk Level') {
          const rc = risk.color.includes('red') ? RED : risk.color.includes('green') ? NEON : [251, 191, 36];
          doc.setTextColor(...rc);
        } else {
          doc.setTextColor(...WHITE);
        }
        doc.text(s.value, x + 3, y + 13);
      });

      const startY = 99;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...NEON);
      doc.text('Holdings', 14, startY);

      const rows = holdings.map(h => {
        const { pnl, pct, current } = calcPnl(h);
        return [
          h.name, h.symbol, `${h.amount}`,
          fmtP(h.buyPrice), fmtP(h.currentPrice), fmtP(current),
          `${pnl >= 0 ? '+' : ''}${fmtP(pnl)} (${pnl >= 0 ? '+' : ''}${pct}%)`,
        ];
      });

      autoTable(doc, {
        startY: startY + 4,
        head: [['Asset', 'Symbol', 'Qty', 'Buy Price', 'Curr. Price', 'Value', 'P&L']],
        body: rows,
        theme: 'plain',
        styles:     { textColor: WHITE, fillColor: DARK,        fontSize: 8,  font: 'helvetica', cellPadding: 3 },
        headStyles: { textColor: NEON,  fillColor: [20, 30, 20], fontSize: 7, fontStyle: 'bold', lineColor: NEON, lineWidth: 0.2 },
        alternateRowStyles: { fillColor: [18, 26, 18] },
        columnStyles: { 6: { textColor: totalPnl >= 0 ? NEON : RED, fontStyle: 'bold' } },
        didDrawCell: (data) => {
          if (data.column.index === 6 && data.section === 'body') {
            const h = holdings[data.row.index];
            if (h) { const { pnl } = calcPnl(h); doc.setTextColor(...(pnl >= 0 ? NEON : RED)); }
          }
        },
        margin: { left: 14, right: 14 },
      });

      const afterTable = doc.lastAutoTable.finalY + 10;
      if (afterTable < 250) {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...NEON);
        doc.text('Asset Allocation', 14, afterTable);
        const alloc = holdings.map((h, i) => ({ sym: h.symbol, pct: pieData[i]?.value ?? 0, color: h.color || '#8eff71' }));
        alloc.forEach((a, i) => {
          const y = afterTable + 6 + i * 7;
          if (y > 270) return;
          const hex = a.color.replace('#', '');
          const r = parseInt(hex.substring(0,2),16);
          const g = parseInt(hex.substring(2,4),16);
          const b = parseInt(hex.substring(4,6),16);
          doc.setFillColor(r, g, b);
          doc.circle(18, y - 1.5, 1.5, 'F');
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(...WHITE);
          doc.text(`${a.sym}`, 22, y);
          doc.setFillColor(30, 40, 30);
          doc.roundedRect(55, y - 4, 60, 5, 1, 1, 'F');
          doc.setFillColor(r, g, b);
          doc.roundedRect(55, y - 4, 60 * (a.pct / 100), 5, 1, 1, 'F');
          doc.setTextColor(...MUTED);
          doc.text(`${a.pct}%`, 118, y);
        });
      }

      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...MUTED);
      doc.text('Generated by Clarity — For informational purposes only. Not financial advice.', W / 2, 290, { align: 'center' });

      // ── Encrypt & download as .secure ──
      const pdfBlob = doc.output('blob');
      const storedUser = JSON.parse(localStorage.getItem('clarity_user') || '{}');
      const encryptedStr = await encryptPdfBlob(pdfBlob, {
        userName:  storedUser.name  || 'Clarity User',
        email:     storedUser.email || email,
        timestamp: new Date().toISOString(),
      });

      const secureBlob = new Blob([encryptedStr], { type: 'text/plain' });
      const url  = URL.createObjectURL(secureBlob);
      const link = document.createElement('a');
      link.href     = url;
      link.download = `Clarity_Portfolio_${new Date().toISOString().slice(0,10)}.secure`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Secure PDF export failed:', err);
      alert('Export failed: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  // Compute pie data from live holdings
  const totalValue = holdings.reduce((s, h) => s + calcPnl(h).current, 0);
  const pieData = holdings.length
    ? holdings.map((h, i) => ({
        name: h.symbol,
        value: parseFloat(((calcPnl(h).current / (totalValue || 1)) * 100).toFixed(1)),
        color: h.color || COLORS[i % COLORS.length],
      }))
    : [{ name: 'Empty', value: 100, color: '#ffffff10' }];

  const totalPnl = holdings.reduce((s, h) => s + calcPnl(h).pnl, 0);
  const totalInvested = holdings.reduce((s, h) => s + h.amount * h.buyPrice, 0);
  const totalPnlPct = totalInvested > 0 ? ((totalPnl / totalInvested) * 100).toFixed(2) : '0.00';
  const pnlPctNum = parseFloat(totalPnlPct);

  // Dynamic risk derived from P&L%
  // Large swings (+ or -) = higher risk/volatility; steep losses = danger zone
  const getRisk = (pct) => {
    const abs = Math.abs(pct);
    if (pct <= -15)   return { label: 'Very High',    beta: '1.80', bar: '92%', color: 'text-red-400',    barGrad: 'from-red-500 to-red-700',             desc: 'Significant drawdown detected' };
    if (pct <= -5)    return { label: 'High',          beta: '1.50', bar: '78%', color: 'text-orange-400', barGrad: 'from-yellow-400 to-red-500',           desc: 'Portfolio under pressure' };
    if (abs <= 5)     return { label: 'Low',           beta: '0.75', bar: '28%', color: 'text-neon-green', barGrad: 'from-neon-green to-neon-green',        desc: 'Stable & low volatility' };
    if (pct <= 15)    return { label: 'Moderate',      beta: '1.12', bar: '55%', color: 'text-yellow-400', barGrad: 'from-neon-green via-yellow-400 to-yellow-500', desc: 'Healthy growth trajectory' };
    return               { label: 'Moderate-High', beta: '1.35', bar: '72%', color: 'text-orange-400', barGrad: 'from-neon-green via-yellow-400 to-red-500', desc: 'Strong gains, elevated volatility' };
  };
  const risk = getRisk(pnlPctNum);

  return (
    <div className="space-y-8">
      {showModal  && <AddHoldingModal onClose={() => setShowModal(false)}  onSave={handleAdd} />}
      <SecurePDFViewer isOpen={showViewer} onClose={() => setShowViewer(false)} />

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-extrabold tracking-tight mb-2">Portfolio Analysis</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-neon-green" />
              <span className="text-xs font-bold text-neon-green uppercase tracking-wider">Verified Assets</span>
            </div>
            <div className="h-4 w-px bg-white/10"></div>
            <span className="text-xs text-white/40 font-mono">{holdings.length} holding{holdings.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportSecurePDF}
            disabled={exporting}
            className="glass px-4 py-2 rounded-xl border border-white/10 text-sm font-bold flex items-center gap-2 hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            {exporting
              ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Encrypting…</>
              : <><Lock className="w-4 h-4 text-[#39ff14]" /> Export Secure PDF</>}
          </button>
          <button
            onClick={() => setShowViewer(true)}
            className="glass px-4 py-2 rounded-xl border border-[#39ff14]/30 text-sm font-bold flex items-center gap-2 hover:bg-[#39ff14]/5 text-[#39ff14] transition-colors"
          >
            <Eye className="w-4 h-4" /> View Secure PDF
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-neon-green text-obsidian px-6 py-2 rounded-xl font-bold text-sm shadow-[0_0_20px_rgba(142,255,113,0.3)] flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <Plus className="w-4 h-4" /> Add Holding
          </button>
        </div>
      </div>

      {/* ── Summary Stats — always visible ─────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Value',    value: fmt(totalValue),    colorClass: '' },
          { label: 'Total Invested', value: fmt(totalInvested), colorClass: '' },
          { label: 'Total P&L',      value: `${totalPnl >= 0 ? '+' : ''}${fmt(totalPnl)}`,         colorClass: totalPnl > 0 ? 'text-neon-green' : totalPnl < 0 ? 'text-red-400' : 'text-white/40' },
          { label: 'P&L %',          value: `${pnlPctNum >= 0 ? '+' : ''}${totalPnlPct}%`,         colorClass: pnlPctNum > 0 ? 'text-neon-green' : pnlPctNum < 0 ? 'text-red-400' : 'text-white/40' },
        ].map((s, i) => (
          <div key={i} className="bento-card py-4">
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2">{s.label}</p>
            <p className={cn('text-xl font-display font-bold', s.colorClass)}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Pie Chart ───────────────────────────────────────────────────── */}
        <div className="bento-card flex flex-col items-center justify-center min-h-[400px]">
          <h3 className="text-xl font-display font-bold self-start mb-8">Asset Allocation</h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80}
                  paddingAngle={5} dataKey="value" stroke="none">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0b0f0b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full mt-4">
            {pieData.map((asset, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: asset.color }}></div>
                <span className="text-xs text-white/60 truncate">{asset.name}</span>
                <span className="text-xs font-mono font-bold ml-auto">{asset.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Panel ─────────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bento-card">
              <p className="text-xs font-mono text-white/40 uppercase tracking-widest mb-4">Risk Exposure</p>
              <div className="flex items-end justify-between mb-1">
                <h3 className={cn('text-3xl font-display font-bold', risk.color)}>{risk.label}</h3>
                <span className="text-xs font-bold text-white/40">β {risk.beta}</span>
              </div>
              <p className="text-[10px] text-white/30 mb-3">{risk.desc}</p>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={cn('h-full rounded-full bg-linear-to-r transition-all duration-700', risk.barGrad)}
                  style={{ width: holdings.length ? risk.bar : '0%' }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[9px] text-white/20 font-mono">LOW</span>
                <span className="text-[9px] text-white/20 font-mono">HIGH</span>
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

          {/* ── Holdings Table ───────────────────────────────────────────── */}
          <div className="bento-card flex-1">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-display font-bold">Holdings</h3>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-white/5 rounded-lg transition-colors"><Filter className="w-4 h-4 text-white/40" /></button>
                <button className="p-2 hover:bg-white/5 rounded-lg transition-colors"><History className="w-4 h-4 text-white/40" /></button>
              </div>
            </div>

            {loading ? (
              <p className="text-center text-white/30 py-8 text-sm">Loading holdings...</p>
            ) : holdings.length === 0 ? (
              <div className="text-center py-12 border border-white/5 rounded-2xl bg-white/2">
                <PieChartIcon className="w-10 h-10 text-white/10 mx-auto mb-3" />
                <p className="text-white/30 text-sm">No holdings yet.</p>
                <button onClick={() => setShowModal(true)}
                  className="mt-4 inline-flex items-center gap-2 text-[#8eff71] text-xs font-bold uppercase tracking-widest hover:underline">
                  <Plus className="w-3 h-3" /> Add your first holding
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-2">
                  <thead>
                    <tr className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
                      <th className="px-4 py-2">Asset</th>
                      <th className="px-4 py-2">Amount</th>
                      <th className="px-4 py-2">Value</th>
                      <th className="px-4 py-2">P&L</th>
                      <th className="px-4 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {holdings.map((item) => {
                      const { pnl, pct, current } = calcPnl(item);
                      const pos = pnl > 0;
                      const zero = pnl === 0;
                      return (
                        <tr key={item._id} className="group cursor-pointer">
                          <td className="px-4 py-3 bg-white/5 first:rounded-l-xl border-y border-l border-white/5 group-hover:border-neon-green/30 transition-all">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-obsidian flex items-center justify-center border border-white/10 font-mono text-sm"
                                style={{ color: item.color }}>
                                {item.icon || item.symbol[0]}
                              </div>
                              <div>
                                <p className="text-sm font-bold">{item.name}</p>
                                <p className="text-[10px] font-mono text-white/40">{item.symbol}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 bg-white/5 border-y border-white/5 group-hover:border-neon-green/30 transition-all">
                            <p className="text-sm font-mono">{item.amount} {item.symbol}</p>
                          </td>
                          <td className="px-4 py-3 bg-white/5 border-y border-white/5 group-hover:border-neon-green/30 transition-all">
                            <p className="text-sm font-mono font-bold">{fmt(current)}</p>
                          </td>
                          <td className="px-4 py-3 bg-white/5 border-y border-white/5 group-hover:border-neon-green/30 transition-all">
                            <div className="flex items-center gap-1">
                              <p className={cn('text-sm font-mono font-bold',
                                zero ? 'text-white/40' : pos ? 'text-neon-green' : 'text-red-500')}>
                                {pos ? '+' : ''}{fmt(pnl)}
                              </p>
                              <span className={cn('text-[10px] font-bold',
                                zero ? 'text-white/20' : pos ? 'text-neon-green/60' : 'text-red-500/60')}>
                                ({pos ? '+' : ''}{pct}%)
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 bg-white/5 last:rounded-r-xl border-y border-r border-white/5 group-hover:border-neon-green/30 transition-all">
                            <button onClick={() => handleDelete(item._id)}
                              className="p-1 hover:bg-red-500/10 rounded transition-colors group/del">
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
      </div>
    </div>
  );
}
