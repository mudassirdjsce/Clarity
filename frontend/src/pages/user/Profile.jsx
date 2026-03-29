import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Mail,
  Phone,
  CheckCircle2,
  Eye,
  Plus,
  PlusCircle,
  Plane,
  Ticket,
  Hotel,
  ShieldCheck,
  Fingerprint,
  MessageSquare,
  Wallet,
  Target,
  User,
  Trash2,
  Camera,
  ScanLine
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Badge, Card, ProgressBar, Toggle, GlobalProfileTheme } from '../../components/CommonProfile';
import { fetchUserGoals, addUserGoal, addGoalFunds, deleteUserGoal, fetchUserFestivals, addUserFestival, addFestivalExpense, deleteUserFestival, fetchBankAccounts, connectBankAccount, addBankTransaction } from '../../services/api';
import { WrappedTriggerButton } from '../common/WrappedPage';
import CameraScanner from '../../components/CameraScanner';

export default function UserProfile() {
  const location = useLocation();
  const [biometric, setBiometric] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [proFlipped, setProFlipped] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Scroll to section if navigated with state
  useEffect(() => {
    if (location.state?.scrollTo) {
      const el = document.getElementById(location.state.scrollTo);
      if (el) {
        setTimeout(() => {
          const top = el.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: 'smooth' });
        }, 300);
      }
    }
  }, [location.state]);

  const storedUser = localStorage.getItem('clarity_user');
  const user = storedUser ? JSON.parse(storedUser) : { name: "Alex Rivera", email: "alex@synthetic.io", phone: "+1 234 567 8900" };

  const [goals, setGoals] = useState([]);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', targetAmount: '' });
  const [isSavingGoal, setIsSavingGoal] = useState(false);

  // Add Funds State
  const [isAddFundsModalOpen, setIsAddFundsModalOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const [fundsAmount, setFundsAmount] = useState('');
  const [isAddingFunds, setIsAddingFunds] = useState(false);

  // Festivals State
  const [festivals, setFestivals] = useState([]);
  const [isFestivalModalOpen, setIsFestivalModalOpen] = useState(false);
  const [newFestival, setNewFestival] = useState({ title: '', targetAmount: '' });
  const [isSavingFestival, setIsSavingFestival] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [selectedFestivalId, setSelectedFestivalId] = useState(null);
  const [newExpense, setNewExpense] = useState({ category: '', amount: '' });
  const [isAddingExpense, setIsAddingExpense] = useState(false);

  // Bank Accounts State
  const [bankAccounts, setBankAccounts] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [expandedAccount, setExpandedAccount] = useState(null);

  // Check Safety State
  const [isCheckingSafety, setIsCheckingSafety] = useState(false);
  const [suspiciousFound, setSuspiciousFound] = useState(false);
  const [fraudReport, setFraudReport] = useState(null);
  const sirenRef = useRef(null);

  // Hardcoded fraud report template
  const FRAUD_REPORT = {
    account: 'HDFC Bank • Savings ••••4821',
    transaction: 'INR 24,999 debit',
    merchant: 'UNKNOWN_MERCHANT_SG',
    date: '28 Mar 2026, 11:47 PM',
    location: 'Singapore (IP: 103.14.xx.xx)',
    txnId: 'TXN8823910XF',
  };

  // Cleanup siren on unmount
  useEffect(() => {
    return () => {
      if (sirenRef.current) {
        try { sirenRef.current.osc.stop(); sirenRef.current.ctx.close(); } catch {}
      }
    };
  }, []);

  const handleCheckSafety = () => {
    if (isCheckingSafety || suspiciousFound) return;
    setIsCheckingSafety(true);

    setTimeout(() => {
      setIsCheckingSafety(false);
      setSuspiciousFound(true);

      // Build wailing siren with Web Audio API
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sawtooth';
      gain.gain.value = 0.25;

      // Wail: sweep 700 Hz → 1300 Hz → 700 Hz every 0.8s
      const start = ctx.currentTime;
      const cycle = 0.8;
      const totalCycles = Math.ceil(3 / cycle);
      for (let i = 0; i < totalCycles; i++) {
        osc.frequency.setValueAtTime(700, start + i * cycle);
        osc.frequency.linearRampToValueAtTime(1300, start + i * cycle + cycle / 2);
        osc.frequency.linearRampToValueAtTime(700, start + i * cycle + cycle);
      }
      osc.start();
      osc.stop(start + 3);
      sirenRef.current = { ctx, osc };

      // Auto-dismiss siren after 3s, then show fraud report
      setTimeout(() => {
        setSuspiciousFound(false);
        sirenRef.current = null;
        setFraudReport(FRAUD_REPORT);
      }, 3000);
    }, 1500);
  };

  const [points, setPoints] = useState(() =>
    parseInt(localStorage.getItem('clarityAcademyPoints') || '0', 10)
  );

  const [hasPro, setHasPro] = useState(() => {
    const expiry = localStorage.getItem('clarityProExpiry');
    if (!expiry) return false;
    if (new Date() > new Date(expiry)) {
      // Expired — clean up
      localStorage.removeItem('clarityProStatus');
      localStorage.removeItem('clarityProExpiry');
      return false;
    }
    return true;
  });

  const [proExpiry, setProExpiry] = useState(() => {
    return localStorage.getItem('clarityProExpiry') || null;
  });

  useEffect(() => {
    const handleUpdate = () => {
      setPoints(parseInt(localStorage.getItem('clarityAcademyPoints') || '0', 10));
    };
    window.addEventListener('pointsUpdate', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('pointsUpdate', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleGetPro = () => {
    if (points >= 250) {
      if (window.confirm('Buy Clarity Pro for 1 month using 250 Royalty Points?')) {
        const newPoints = points - 250;
        // Expiry = exactly 1 month from now
        const expiry = new Date();
        expiry.setMonth(expiry.getMonth() + 1);
        const expiryStr = expiry.toISOString();
        setPoints(newPoints);
        setHasPro(true);
        setProExpiry(expiryStr);
        localStorage.setItem('clarityAcademyPoints', newPoints);
        localStorage.setItem('clarityProStatus', 'true');
        localStorage.setItem('clarityProExpiry', expiryStr);
        window.dispatchEvent(new Event('pointsUpdate'));
        setProFlipped(false);
      }
    } else {
      window.alert(`You need 250 pts to activate Pro. You have ${points} pts.`);
    }
  };

  useEffect(() => {
    if (user.email) {
      fetchUserGoals(user.email)
        .then(data => setGoals(data.goals || []))
        .catch(err => console.error("Error fetching goals:", err));
      fetchUserFestivals(user.email)
        .then(data => setFestivals(data.festivals || []))
        .catch(err => console.error("Error fetching festivals:", err));
      fetchBankAccounts(user.email)
        .then(data => setBankAccounts(data.accounts || []))
        .catch(err => console.error("Error fetching bank accounts:", err));
    }
  }, [user.email]);

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!newGoal.title || !newGoal.targetAmount) return;
    setIsSavingGoal(true);
    try {
      const res = await addUserGoal({ email: user.email, title: newGoal.title, targetAmount: Number(newGoal.targetAmount) });
      setGoals([...goals, res.goal]);
      setNewGoal({ title: '', targetAmount: '' });
      setIsGoalModalOpen(false);
    } catch (err) {
      console.error("Failed to add goal", err);
    } finally {
      setIsSavingGoal(false);
    }
  };

  const handleAddFunds = async (e) => {
    e.preventDefault();
    if (!fundsAmount || !selectedGoalId) return;
    setIsAddingFunds(true);
    try {
      const res = await addGoalFunds({ goalId: selectedGoalId, amount: Number(fundsAmount) });
      setGoals(goals.map(g => g._id === selectedGoalId ? res.goal : g));
      setFundsAmount('');
      setIsAddFundsModalOpen(false);
      setSelectedGoalId(null);
    } catch (err) {
      console.error("Failed to add funds", err);
    } finally {
      setIsAddingFunds(false);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (window.confirm("Are you sure you want to delete this goal? This action cannot be undone.")) {
      try {
        await deleteUserGoal(goalId);
        setGoals(goals.filter(g => g._id !== goalId));
      } catch (err) {
        console.error("Failed to delete goal", err);
      }
    }
  };

  const handleConnectBank = async () => {
    setIsConnecting(true);
    await new Promise(r => setTimeout(r, 2500));
    try {
      const res = await connectBankAccount({ email: user.email });
      setBankAccounts(prev => [...prev, res.account]);
      setExpandedAccount(res.account._id);
    } catch (err) {
      console.error("Failed to connect bank account", err);
    } finally {
      setIsConnecting(false);
    }
  };

  const [addingTxFor, setAddingTxFor] = useState(null);
  const handleAddTransaction = async (accId) => {
    setAddingTxFor(accId);
    try {
      const res = await addBankTransaction(accId);
      setBankAccounts(prev => prev.map(a => a._id === accId ? res.account : a));
      setExpandedAccount(accId);
    } catch (err) {
      console.error("Failed to add transaction", err);
    } finally {
      setAddingTxFor(null);
    }
  };

  const handleAddFestival = async (e) => {
    e.preventDefault();
    if (!newFestival.title || !newFestival.targetAmount) return;
    setIsSavingFestival(true);
    try {
      const res = await addUserFestival({ email: user.email, title: newFestival.title, targetAmount: Number(newFestival.targetAmount) });
      setFestivals([...festivals, res.festival]);
      setNewFestival({ title: '', targetAmount: '' });
      setIsFestivalModalOpen(false);
    } catch (err) {
      console.error("Failed to add festival", err);
    } finally {
      setIsSavingFestival(false);
    }
  };

  const handleDeleteFestival = async (festivalId) => {
    if (window.confirm("Are you sure you want to delete this festival? This action cannot be undone.")) {
      try {
        await deleteUserFestival(festivalId);
        setFestivals(festivals.filter(f => f._id !== festivalId));
      } catch (err) {
        console.error("Failed to delete festival", err);
      }
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!newExpense.category || !newExpense.amount || !selectedFestivalId) return;
    setIsAddingExpense(true);
    try {
      const res = await addFestivalExpense(selectedFestivalId, { category: newExpense.category, amount: Number(newExpense.amount) });
      setFestivals(festivals.map(f => f._id === selectedFestivalId ? res.festival : f));
      setNewExpense({ category: '', amount: '' });
      setIsExpenseModalOpen(false);
      setSelectedFestivalId(null);
    } catch (err) {
      console.error("Failed to add expense", err);
    } finally {
      setIsAddingExpense(false);
    }
  };

  const totalSaved = goals.reduce((acc, g) => acc + (g.currentAmount || 0), 0);

  return (
    <div className="fintech-wrapper space-y-12 relative overflow-hidden z-0">
      {/* Camera Scanner Modal */}
      <CameraScanner isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />

      {/* ── Suspicious Activity Overlay ── */}
      <AnimatePresence>
        {suspiciousFound && (
          <>
            {/* Pulsing red screen flash */}
            <motion.div
              key="redflash"
              className="fixed inset-0 z-500 pointer-events-none"
              animate={{ backgroundColor: ['rgba(220,38,38,0.25)', 'rgba(220,38,38,0.0)', 'rgba(220,38,38,0.25)'] }}
              transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Alert modal */}
            <motion.div
              key="alertmodal"
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-600 bg-[#1a0505] border border-red-500/50 rounded-2xl px-8 py-5 flex items-center gap-4 shadow-[0_0_40px_rgba(220,38,38,0.5)]"
            >
              <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center flex-shrink-0 animate-pulse">
                <ShieldCheck className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-red-400 font-bold text-sm uppercase tracking-widest">⚠ Suspicious Activity Detected</p>
                <p className="text-red-400/60 text-[10px] mt-0.5 font-mono">Unusual transaction patterns found · Siren active for 5s</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Fraud Report Card (appears after siren ends) ── */}
      <AnimatePresence>
        {fraudReport && (
          <motion.div
            key="fraudcard"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-600 w-[520px] bg-[#130505] border border-red-500/30 rounded-2xl shadow-[0_0_50px_rgba(220,38,38,0.3)] overflow-hidden"
          >
            {/* Top accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-red-600 via-red-400 to-red-600" />

            <div className="p-7 space-y-5">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <p className="text-red-400 text-[13px] font-bold uppercase tracking-[0.18em]">Fraud Alert</p>
                    <p className="text-white/50 text-[10px] font-mono mt-0.5">Ref: {fraudReport.txnId}</p>
                  </div>
                </div>
                <button
                  onClick={() => setFraudReport(null)}
                  className="text-white/20 hover:text-white/60 transition-colors mt-0.5"
                >
                  <span className="text-lg leading-none">&times;</span>
                </button>
              </div>

              {/* Transaction detail rows */}
              <div className="space-y-3 bg-red-500/5 border border-red-500/10 rounded-xl p-5">
                {[
                  { label: 'Account', value: fraudReport.account },
                  { label: 'Transaction', value: fraudReport.transaction },
                  { label: 'Merchant', value: fraudReport.merchant },
                  { label: 'Date & Time', value: fraudReport.date },
                  { label: 'Origin', value: fraudReport.location },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-start justify-between gap-3 text-[11px]">
                    <span className="text-white/30 uppercase tracking-widest font-bold whitespace-nowrap">{label}</span>
                    <span className="text-white/70 font-mono text-right">{value}</span>
                  </div>
                ))}
              </div>

              {/* Warning message */}
              <p className="text-red-400/80 text-[11px] font-mono leading-relaxed">
                ⚠ This transaction appears fraudulent. Contact your bank immediately and freeze your card.
              </p>

              {/* CTA buttons */}
              <div className="flex gap-3">
                <button className="flex-1 py-3 rounded-xl bg-red-500 text-white text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-red-400 transition-colors shadow-[0_0_15px_rgba(220,38,38,0.4)]">
                  Contact Immediately
                </button>
                <button
                  onClick={() => setFraudReport(null)}
                  className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white/40 text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-white/10 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <GlobalProfileTheme />
      {/* Ambient backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#39ff14]/10 rounded-full blur-[150px] -z-10 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#1a3821]/30 rounded-full blur-[150px] -z-10 pointer-events-none" />

      {/* Profile Section */}
      <section className="flex flex-col md:flex-row items-center md:items-end gap-8 mb-16 relative z-10">
        <div className="relative group">
          <div className="absolute -inset-1 bg-[#39ff14] rounded-full blur-[20px] opacity-30 group-hover:opacity-60 transition duration-1000" />
          <div className="relative p-1 rounded-full bg-gradient-to-tr from-[#39ff14] to-[#1A231C]">
            <div className="w-32 h-32 rounded-full border-4 border-[#0B0F0C] bg-[#0B0F0C] flex items-center justify-center select-none"
              style={{ boxShadow: "inset 0 0 30px rgba(57,255,20,0.08)" }}>
              <span className="text-5xl font-black text-[#39ff14] leading-none"
                style={{ textShadow: "0 0 20px rgba(57,255,20,0.7), 0 0 40px rgba(57,255,20,0.4)" }}>
                {(user.name || "U").charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="absolute bottom-1 right-1 bg-[#39ff14] text-[#0B0F0C] p-1.5 rounded-full shadow-[0_0_15px_rgba(142,255,113,0.8)]">
            <CheckCircle2 size={16} className="text-[#0B0F0C]" />
          </div>
        </div>

        <div className="text-center md:text-left space-y-2">
          <h1 className="text-5xl font-bold tracking-tight">{user.name}</h1>
          <div className="flex items-center gap-3 justify-center md:justify-start flex-wrap">
            <Badge>Verified Analyst</Badge>
            {hasPro && (
              <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-gradient-to-r from-[#39ff14]/20 to-[#00d4ff]/20 border border-[#39ff14]/30 text-[#39ff14]">
                ⚡ Pro
                {proExpiry && (
                  <span className="text-[#9FB8A7] font-bold text-[8px] ml-0.5">
                    · expires {new Date(proExpiry).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                )}
              </span>
            )}
            <span className="text-[10px] text-[#9FB8A7] uppercase tracking-[0.2em] flex items-center gap-1 font-bold">
              <MapPin size={12} /> NYC, USA
            </span>
          </div>

        </div>

        <div className="md:ml-auto flex gap-3">
          <button className="bg-[#1A231C] border border-[#2A3B2E] text-[#E8F5E9] px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#2A3B2E] transition-all shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
            Edit Profile
          </button>
          <button className="bg-[#39ff14] text-[#0B0F0C] px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(142,255,113,0.4)] hover:shadow-[0_0_30px_rgba(142,255,113,0.6)] active:scale-95 transition-all">
            Share Portfolio
          </button>
        </div>
      </section>

      {/* Info & Bank Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        <Card className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="bg-[#39ff14]/10 p-3 rounded-full text-[#39ff14] shadow-[0_0_15px_rgba(142,255,113,0.2)] border border-[#39ff14]/20">
              <User size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Personal Information</h2>
              <p className="text-[10px] text-[#9FB8A7] uppercase tracking-[0.2em] font-bold mt-1">Contact & Verification</p>
            </div>
          </div>
          <div className="space-y-4 pt-2">
            <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl flex items-center gap-4 hover:bg-white/[0.05] transition-colors">
              <Mail className="text-[#9FB8A7]" size={20} />
              <div>
                <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#9FB8A7]">Email</p>
                <p className="font-medium text-[#E8F5E9]">{user.email}</p>
              </div>
            </div>
            <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl flex items-center gap-4 hover:bg-white/[0.05] transition-colors">
              <Phone className="text-[#9FB8A7]" size={20} />
              <div>
                <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#9FB8A7]">Phone Number</p>
                <p className="font-medium text-[#E8F5E9]">{user.phone}</p>
              </div>
            </div>
            {hasPro && proExpiry && (
              <div className="bg-gradient-to-r from-[#39ff14]/8 to-[#00d4ff]/5 border border-[#39ff14]/20 p-4 rounded-2xl flex items-center gap-4">
                <div className="w-9 h-9 rounded-full bg-[#39ff14]/15 border border-[#39ff14]/25 flex items-center justify-center flex-shrink-0">
                  <span className="text-base leading-none">⚡</span>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#39ff14]">Clarity Pro — Active</p>
                  <p className="font-medium text-[#E8F5E9] text-sm mt-0.5">
                    Expires on {new Date(proExpiry).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#39ff14]/15 border border-[#39ff14]/30 text-[#39ff14]">
                  1 Mo
                </span>
              </div>
            )}
          </div>
        </Card>

        <Card className="space-y-6">
        <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-[#39ff14]/10 p-3 rounded-full text-[#39ff14] shadow-[0_0_15px_rgba(142,255,113,0.2)] border border-[#39ff14]/20">
                <Wallet size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">Bank Accounts</h2>
                <p className="text-[10px] text-[#9FB8A7] uppercase tracking-[0.2em] font-bold mt-1">Connected Institutions</p>
              </div>
            </div>
            <button
              onClick={handleCheckSafety}
              disabled={isCheckingSafety || suspiciousFound}
              className="flex items-center gap-2 bg-white/5 text-white/40 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white/10 hover:text-white/60 border border-white/10 transition-all whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShieldCheck size={14} />
              {isCheckingSafety ? 'Scanning...' : suspiciousFound ? 'Alert Active' : 'Check Safety'}
            </button>
          </div>


          <div className="space-y-4 pt-2">
            {bankAccounts.length === 0 ? (
              /* ── No accounts: only show connect button ── */
              <button
                onClick={handleConnectBank}
                disabled={isConnecting}
                className="w-full border border-[#39ff14]/30 bg-[#39ff14]/5 hover:bg-[#39ff14]/10 py-4 rounded-2xl flex items-center justify-center gap-2 text-[#39ff14] text-[10px] font-bold uppercase tracking-[0.2em] transition-all shadow-[0_0_15px_rgba(142,255,113,0.1)] hover:shadow-[0_0_20px_rgba(142,255,113,0.2)] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isConnecting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-[#39ff14]" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Connecting to bank...
                  </>
                ) : (
                  <><Plus size={16} /> Connect Bank Account</>
                )}
              </button>
            ) : (
              <>
                {/* ── Connected account cards ── */}
                {bankAccounts.map((acc) => (
                  <div key={acc._id} className="bg-white/3 border border-white/5 p-5 rounded-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-linear-to-r from-[#39ff14]/0 via-[#39ff14]/5 to-[#39ff14]/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#1A231C] border border-[#2A3B2E] flex items-center justify-center font-bold text-[#39ff14] text-sm">
                          {acc.bankName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-[#E8F5E9]">{acc.bankName}</p>
                          <p className="text-xs text-[#9FB8A7]">Active Connection</p>
                        </div>
                      </div>
                      <CheckCircle2 className="text-[#39ff14]" size={18} />
                    </div>

                    <div className="space-y-3 relative z-10">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-[#9FB8A7]">Account Number</span>
                        <span className="font-mono text-[#E8F5E9]">{acc.accountNumber}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-[#9FB8A7]">Balance</span>
                        <span className="font-mono text-[#39ff14] font-bold drop-shadow-[0_0_6px_rgba(142,255,113,0.4)]">
                          ₹{acc.balance.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Add Transaction + Toggle row */}
                    <div className="mt-4 flex gap-2 relative z-10">
                      <button
                        onClick={() => handleAddTransaction(acc._id)}
                        disabled={addingTxFor === acc._id}
                        className="flex-1 border border-[#39ff14]/20 bg-[#39ff14]/5 hover:bg-[#39ff14]/10 py-2 rounded-xl flex items-center justify-center gap-2 text-[#39ff14] text-[10px] font-bold uppercase tracking-[0.2em] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {addingTxFor === acc._id ? (
                          <>
                            <svg className="animate-spin h-3 w-3 text-[#39ff14]" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                            Adding...
                          </>
                        ) : (
                          <><Plus size={12} /> Add Transaction</>
                        )}
                      </button>
                      <button
                        onClick={() => setExpandedAccount(expandedAccount === acc._id ? null : acc._id)}
                        className="px-4 py-2 rounded-xl border border-white/10 text-[#9FB8A7] hover:text-[#39ff14] text-[10px] font-bold uppercase tracking-[0.2em] transition-colors"
                      >
                        {expandedAccount === acc._id ? '▲' : '▼'}
                      </button>
                    </div>

                    {/* Transaction list */}
                    {expandedAccount === acc._id && (
                      <div className="mt-3 space-y-1 relative z-10">
                        {acc.transactions.length === 0 ? (
                          <p className="text-center text-[10px] text-[#9FB8A7] py-3">No transactions yet.</p>
                        ) : (
                          acc.transactions.map((tx, j) => (
                            <div key={j} className="flex justify-between items-center py-2 border-t border-white/5 text-sm">
                              <div>
                                <p className="text-[#E8F5E9] font-medium text-xs">{tx.description}</p>
                                <p className="text-[10px] text-[#9FB8A7]">
                                  {new Date(tx.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </p>
                              </div>
                              <span className={`font-mono font-bold text-sm ${tx.amount >= 0 ? 'text-[#39ff14]' : 'text-red-400'}`}>
                                {tx.amount >= 0 ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString('en-IN')}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {/* Add another account */}
                <button
                  onClick={handleConnectBank}
                  disabled={isConnecting}
                  className="w-full border border-[#39ff14]/30 bg-[#39ff14]/5 hover:bg-[#39ff14]/10 py-3 rounded-2xl flex items-center justify-center gap-2 text-[#39ff14] text-[10px] font-bold uppercase tracking-[0.2em] transition-all shadow-[0_0_15px_rgba(142,255,113,0.1)] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isConnecting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-[#39ff14]" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Connecting...
                    </>
                  ) : (
                    <><Plus size={14} /> Connect Another Account</>
                  )}
                </button>
              </>
            )}
          </div>
        </Card>
      </div>

      {/* Goals & Events Section */}
      <div id="savings-goals" className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        <Card className="lg:col-span-7 space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold">My Savings Goals</h2>
              <p className="text-[10px] text-[#9FB8A7] uppercase tracking-[0.2em] font-bold mt-1">Strategic Wealth Accumulation</p>
            </div>
            <button
              onClick={() => setIsGoalModalOpen(true)}
              className="flex items-center gap-2 bg-[#39ff14]/10 text-[#39ff14] px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#39ff14]/20 border border-[#39ff14]/20 transition-all shadow-[0_0_10px_rgba(142,255,113,0.15)]"
            >
              <Plus size={14} /> New Goal
            </button>
          </div>

          <div className="space-y-8">
            {goals.length === 0 ? (
              <div className="text-center py-8 text-[#9FB8A7] border border-white/5 bg-white/[0.02] rounded-2xl">
                <p className="font-bold">No goals yet.</p>
                <p className="text-xs mt-1">Start tracking your wealth milestones.</p>
              </div>
            ) : (
              goals.map((goal, i) => {
                const progress = Math.min(100, Math.round(((goal.currentAmount || 0) / goal.targetAmount) * 100));
                const remaining = goal.targetAmount - (goal.currentAmount || 0);
                const isCompleted = remaining <= 0;

                return (
                  <div key={i} className="space-y-3">
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-medium text-[#E8F5E9]">{goal.title}</h3>
                          <button
                            onClick={() => handleDeleteGoal(goal._id)}
                            className="text-[#9FB8A7] hover:text-red-400 transition-colors p-1"
                            title="Delete Goal"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        {isCompleted ? (
                          <div className="mt-1"><Badge>Completed</Badge></div>
                        ) : (
                          <p className="text-[10px] text-[#9FB8A7] uppercase tracking-[0.2em] font-bold">Remaining: ₹{remaining.toLocaleString()}</p>
                        )}
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xl text-[#39ff14] font-bold drop-shadow-[0_0_8px_rgba(142,255,113,0.4)]">₹{(goal.currentAmount || 0).toLocaleString()}</span>
                          {!isCompleted && (
                            <button
                              onClick={() => { setSelectedGoalId(goal._id); setIsAddFundsModalOpen(true); }}
                              className="w-6 h-6 rounded-full bg-[#39ff14]/10 text-[#39ff14] flex items-center justify-center hover:bg-[#39ff14]/20 border border-[#39ff14]/20 transition-all font-bold"
                            >
                              +
                            </button>
                          )}
                        </div>
                        <p className="text-[10px] text-[#9FB8A7] uppercase tracking-[0.2em] font-bold">{progress}% Reached</p>
                      </div>
                    </div>
                    <ProgressBar progress={progress} />
                  </div>
                );
              })
            )}
          </div>
        </Card>

        <div className="lg:col-span-5 space-y-6">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-2xl font-semibold">Events & Festivals</h2>
            <button
              onClick={() => setIsFestivalModalOpen(true)}
              className="text-[#39ff14] hover:text-[#E8F5E9] transition-colors drop-shadow-[0_0_8px_rgba(142,255,113,0.4)]"
            >
              <PlusCircle size={24} />
            </button>
          </div>

          <div className="space-y-4">
            {festivals.length === 0 ? (
              <div className="text-center py-8 text-[#9FB8A7] border border-white/5 bg-white/[0.02] rounded-2xl">
                <p className="font-bold">No festivals yet.</p>
                <p className="text-xs mt-1">Plan your next event budget.</p>
              </div>
            ) : (
              festivals.map((festival, i) => {
                const spent = (festival.expenses || []).reduce((acc, e) => acc + e.amount, 0);
                const remaining = festival.targetAmount - spent;
                const isOver = remaining < 0;
                const progress = Math.min(100, Math.round((spent / festival.targetAmount) * 100));
                return (
                  <div key={i} className="bg-white/3 border border-white/5 rounded-3xl p-5 border-l-4 border-l-[#39ff14] hover:bg-white/5 transition-colors shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-[#E8F5E9]">{festival.title}</h3>
                          <button onClick={() => handleDeleteFestival(festival._id)} className="text-[#9FB8A7] hover:text-red-400 transition-colors" title="Delete Festival">
                            <Trash2 size={13} />
                          </button>
                        </div>
                        <p className="text-[10px] text-[#9FB8A7] uppercase tracking-[0.2em] font-bold mt-0.5">
                          Budget: ₹{festival.targetAmount.toLocaleString()} &nbsp;•&nbsp;
                          {isOver
                            ? <span className="text-red-400">Over by ₹{Math.abs(remaining).toLocaleString()}</span>
                            : <span>Remaining: ₹{remaining.toLocaleString()}</span>
                          }
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-[#39ff14] font-bold drop-shadow-[0_0_8px_rgba(142,255,113,0.4)]">₹{spent.toLocaleString()}</span>
                        <p className="text-[10px] text-[#9FB8A7] uppercase tracking-[0.2em] font-bold">{progress}% Used</p>
                      </div>
                    </div>

                    <ProgressBar progress={progress} />

                    {festival.expenses.length > 0 && (
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {festival.expenses.map((exp, j) => (
                          <div key={j} className="bg-[#1A231C] border border-[#2A3B2E] p-2 rounded-xl flex justify-between items-center">
                            <p className="text-[10px] text-[#9FB8A7] uppercase tracking-wider font-bold">{exp.category}</p>
                            <p className="text-[10px] text-[#39ff14] font-bold">₹{exp.amount.toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={() => { setSelectedFestivalId(festival._id); setIsExpenseModalOpen(true); }}
                      className="mt-3 w-full border border-[#39ff14]/20 bg-[#39ff14]/5 hover:bg-[#39ff14]/10 py-2 rounded-xl flex items-center justify-center gap-2 text-[#39ff14] text-[10px] font-bold uppercase tracking-[0.2em] transition-all"
                    >
                      <Plus size={12} /> Add Category
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <section className="space-y-6 relative z-10">
        <h2 className="text-2xl font-semibold">Scan and Search</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Scan Product — BuyHatke Camera Scanner */}
          <Card className="p-6 flex flex-col gap-5 relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-36 h-36 bg-[#39ff14]/5 rounded-full blur-[50px] pointer-events-none" />
            <div className="flex items-center gap-3">
              <div className="bg-[#39ff14]/10 p-2.5 rounded-full text-[#39ff14] border border-[#39ff14]/20">
                <Camera size={20} />
              </div>
              <div>
                <h3 className="font-bold text-[#E8F5E9] text-sm">Scan Product</h3>
                <p className="text-xs text-[#9FB8A7]">Compare prices instantly</p>
              </div>
            </div>
            <p className="text-xs text-[#9FB8A7] leading-relaxed">
              Point your camera at any item — laptop, bottle, phone — and we'll find the best price on BuyHatke instantly.
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsScannerOpen(true)}
              className="relative w-full py-3.5 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] text-[#0B0F0C] flex items-center justify-center gap-2 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #39ff14 0%, #8EFF71 100%)',
                boxShadow: '0 0 20px rgba(57,255,20,0.3)',
              }}
            >
              <Camera size={14} />
              Open Camera Scanner
            </motion.button>
            <p className="text-[9px] text-[#9FB8A7]/50 text-center font-mono uppercase tracking-widest">Powered by TensorFlow · COCO-SSD</p>
          </Card>

          {/* Clarity Pro — flip card */}
          <div className="relative" style={{ perspective: '1000px' }}>
            <motion.div
              animate={{ rotateY: proFlipped ? 180 : 0 }}
              transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
              style={{ transformStyle: 'preserve-3d', position: 'relative', height: '100%' }}
            >
              {/* FRONT */}
              <div style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
                <Card className="p-6 relative overflow-hidden flex flex-col h-full">
                  <div className="absolute -top-12 -right-12 w-56 h-56 bg-[#39ff14]/10 rounded-full blur-[70px] pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-44 h-44 bg-[#00d4ff]/8 rounded-full blur-[60px] pointer-events-none" />
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-br from-[#39ff14]/20 to-[#00d4ff]/20 p-2.5 rounded-full border border-[#39ff14]/20">
                        <span className="text-sm leading-none">⚡</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-[#E8F5E9] text-sm leading-tight">Clarity Pro</h3>
                        <p className="text-[9px] text-[#9FB8A7] uppercase tracking-[0.15em] font-bold">Premium Plan</p>
                      </div>
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#39ff14]/15 border border-[#39ff14]/30 text-[#39ff14] animate-pulse">
                      Free · Hackathon
                    </span>
                  </div>
                  <ul className="space-y-1.5 mb-5 relative z-10 flex-1">
                    {[
                      { label: 'AI-Powered Insights',  desc: 'Personalised financial nudges daily'   },
                      { label: 'Advanced Charting',     desc: 'Multi-timeframe technical overlays'    },
                      { label: 'Unlimited Portfolios',  desc: 'Track stocks, MFs, bonds & more'       },
                      { label: 'Priority Alerts',       desc: 'Real-time price & event notifications' },
                      { label: 'Early API Access',      desc: 'Be first to new Clarity features'      },
                    ].map(({ label, desc }) => (
                      <li key={label} className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-[#39ff14] flex-shrink-0" />
                        <span className="text-[10px] font-bold text-[#E8F5E9]">{label}</span>
                        <span className="text-[9px] text-[#9FB8A7]">— {desc}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="relative z-10">
                    <motion.button
                      onClick={() => setProFlipped(true)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="relative w-full py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-[#0B0F0C] overflow-hidden"
                      style={{ background: 'linear-gradient(135deg, #39ff14 0%, #00d4ff 100%)', boxShadow: '0 0 24px rgba(57,255,20,0.3)' }}
                    >
                      <motion.div className="absolute inset-0 bg-white/20" initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} />
                      <span className="relative z-10">Get Pro</span>
                    </motion.button>
                    <p className="text-center text-[9px] text-[#9FB8A7] mt-1.5 font-mono uppercase tracking-widest">No credit card required</p>
                  </div>
                </Card>
              </div>

              {/* BACK */}
              <div style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)', position: 'absolute', inset: 0 }}>
                <Card className="p-6 relative overflow-hidden flex flex-col h-full">
                  <div className="absolute -top-12 -right-12 w-56 h-56 bg-[#00d4ff]/10 rounded-full blur-[70px] pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-44 h-44 bg-[#39ff14]/8 rounded-full blur-[60px] pointer-events-none" />
                  <div className="flex items-center justify-between mb-3 relative z-10">
                    <div>
                      <h3 className="font-bold text-[#E8F5E9] text-sm">Choose Your Plan</h3>
                      <p className="text-[9px] text-[#9FB8A7] uppercase tracking-[0.12em] font-bold mt-0.5">Pick how to unlock Pro</p>
                    </div>
                    <button onClick={() => setProFlipped(false)} className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-colors text-xs font-bold">✕</button>
                  </div>
                  <div className="space-y-2 flex-1 relative z-10">
                    <motion.button
                      onClick={handleGetPro}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full p-3 rounded-2xl border-2 border-amber-400/40 bg-amber-400/5 hover:bg-amber-400/10 hover:border-amber-400/70 transition-all text-left"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider">Royalty Points</span>
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-400 uppercase tracking-widest">Recommended</span>
                      </div>
                      <p className="text-lg font-black text-white font-mono leading-tight">250 <span className="text-xs text-amber-400">pts</span></p>
                      <p className="text-[9px] text-[#9FB8A7] mt-0.5">You have <span className="text-amber-400 font-bold">{points} pts</span> · earned rewards</p>
                    </motion.button>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-px bg-white/5" />
                      <span className="text-[9px] text-white/20 font-bold uppercase tracking-widest">or</span>
                      <div className="flex-1 h-px bg-white/5" />
                    </div>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full p-3 rounded-2xl border-2 border-[#39ff14]/30 bg-[#39ff14]/5 hover:bg-[#39ff14]/10 hover:border-[#39ff14]/60 transition-all text-left">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-black text-[#39ff14] uppercase tracking-wider">One-time Payment</span>
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-[#39ff14]/15 border border-[#39ff14]/25 text-[#39ff14] uppercase tracking-widest">Instant</span>
                      </div>
                      <p className="text-lg font-black text-white font-mono leading-tight">₹499</p>
                      <p className="text-[9px] text-[#9FB8A7] mt-0.5">Secure checkout · Annual access</p>
                    </motion.button>
                  </div>
                  <p className="text-center text-[9px] text-[#9FB8A7] mt-2 font-mono uppercase tracking-widest relative z-10">Cancel anytime · No hidden fees</p>
                </Card>
              </div>
            </motion.div>
          </div>

        </div>
      </section>


      {/* Goal Form Modal */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0B0F0C]/80 backdrop-blur-sm" onClick={() => setIsGoalModalOpen(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-md bg-[#1A231C] border border-[#2A3B2E] rounded-3xl p-6 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
          >
            <h3 className="text-2xl font-bold text-[#E8F5E9] mb-1">Create Milestone</h3>
            <p className="text-[10px] text-[#9FB8A7] uppercase tracking-[0.2em] font-bold mb-6">Target your wealth</p>

            <form onSubmit={handleAddGoal} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] text-[#9FB8A7] uppercase tracking-[0.2em] font-bold block">Goal Title</label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={e => setNewGoal({ ...newGoal, title: e.target.value })}
                  className="w-full bg-[#0B0F0C] border border-[#2A3B2E] rounded-xl px-4 py-3 text-[#E8F5E9] focus:outline-none focus:border-[#39ff14]/50 transition-colors"
                  placeholder="e.g. Porsche 911"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-[#9FB8A7] uppercase tracking-[0.2em] font-bold block">Target Amount (₹)</label>
                <input
                  type="number"
                  value={newGoal.targetAmount}
                  onChange={e => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                  className="w-full bg-[#0B0F0C] border border-[#2A3B2E] rounded-xl px-4 py-3 text-[#E8F5E9] focus:outline-none focus:border-[#39ff14]/50 transition-colors"
                  placeholder="e.g. 150000"
                  required
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsGoalModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-[#2A3B2E] text-[#9FB8A7] text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#2A3B2E] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingGoal}
                  className="flex-1 py-3 rounded-xl bg-[#39ff14] text-[#0B0F0C] text-[10px] font-bold uppercase tracking-[0.2em] hover:shadow-[0_0_20px_rgba(142,255,113,0.4)] disabled:opacity-50 transition-all font-bold"
                >
                  {isSavingGoal ? 'Saving...' : 'Deploy Goal'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      {/* Add Funds Modal */}
      {isAddFundsModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0B0F0C]/80 backdrop-blur-sm" onClick={() => setIsAddFundsModalOpen(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-md bg-[#1A231C] border border-[#2A3B2E] rounded-3xl p-6 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
          >
            <h3 className="text-2xl font-bold text-[#E8F5E9] mb-1">Add Funds</h3>
            <p className="text-[10px] text-[#9FB8A7] uppercase tracking-[0.2em] font-bold mb-6">Boost your milestone progress</p>

            <form onSubmit={handleAddFunds} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] text-[#9FB8A7] uppercase tracking-[0.2em] font-bold block">Amount to Add (₹)</label>
                <input
                  type="number"
                  value={fundsAmount}
                  onChange={e => setFundsAmount(e.target.value)}
                  className="w-full bg-[#0B0F0C] border border-[#2A3B2E] rounded-xl px-4 py-3 text-[#E8F5E9] focus:outline-none focus:border-[#39ff14]/50 transition-colors"
                  placeholder="e.g. 500"
                  required
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddFundsModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-[#2A3B2E] text-[#9FB8A7] text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#2A3B2E] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAddingFunds}
                  className="flex-1 py-3 rounded-xl bg-[#39ff14] text-[#0B0F0C] text-[10px] font-bold uppercase tracking-[0.2em] hover:shadow-[0_0_20px_rgba(142,255,113,0.4)] disabled:opacity-50 transition-all font-bold"
                >
                  {isAddingFunds ? 'Processing...' : 'Add Funds'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* New Festival Modal */}
      {isFestivalModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0B0F0C]/80 backdrop-blur-sm" onClick={() => setIsFestivalModalOpen(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-md bg-[#1A231C] border border-[#2A3B2E] rounded-3xl p-6 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
          >
            <h3 className="text-2xl font-bold text-[#E8F5E9] mb-1">New Festival / Event</h3>
            <p className="text-[10px] text-[#9FB8A7] uppercase tracking-[0.2em] font-bold mb-6">Plan your event budget</p>
            <form onSubmit={handleAddFestival} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] text-[#9FB8A7] uppercase tracking-[0.2em] font-bold block">Festival / Event Name</label>
                <input
                  type="text"
                  value={newFestival.title}
                  onChange={e => setNewFestival({ ...newFestival, title: e.target.value })}
                  className="w-full bg-[#0B0F0C] border border-[#2A3B2E] rounded-xl px-4 py-3 text-[#E8F5E9] focus:outline-none focus:border-[#39ff14]/50 transition-colors"
                  placeholder="e.g. Diwali 2025"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-[#9FB8A7] uppercase tracking-[0.2em] font-bold block">Total Budget (₹)</label>
                <input
                  type="number"
                  value={newFestival.targetAmount}
                  onChange={e => setNewFestival({ ...newFestival, targetAmount: e.target.value })}
                  className="w-full bg-[#0B0F0C] border border-[#2A3B2E] rounded-xl px-4 py-3 text-[#E8F5E9] focus:outline-none focus:border-[#39ff14]/50 transition-colors"
                  placeholder="e.g. 10000"
                  required
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsFestivalModalOpen(false)} className="flex-1 py-3 rounded-xl border border-[#2A3B2E] text-[#9FB8A7] text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#2A3B2E] transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSavingFestival} className="flex-1 py-3 rounded-xl bg-[#39ff14] text-[#0B0F0C] text-[10px] font-bold uppercase tracking-[0.2em] hover:shadow-[0_0_20px_rgba(142,255,113,0.4)] disabled:opacity-50 transition-all">
                  {isSavingFestival ? 'Creating...' : 'Create Festival'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Add Expense Modal */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0B0F0C]/80 backdrop-blur-sm" onClick={() => setIsExpenseModalOpen(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-md bg-[#1A231C] border border-[#2A3B2E] rounded-3xl p-6 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
          >
            <h3 className="text-2xl font-bold text-[#E8F5E9] mb-1">Add Category</h3>
            <p className="text-[10px] text-[#9FB8A7] uppercase tracking-[0.2em] font-bold mb-6">Log an expense category</p>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] text-[#9FB8A7] uppercase tracking-[0.2em] font-bold block">Category Name</label>
                <input
                  type="text"
                  value={newExpense.category}
                  onChange={e => setNewExpense({ ...newExpense, category: e.target.value })}
                  className="w-full bg-[#0B0F0C] border border-[#2A3B2E] rounded-xl px-4 py-3 text-[#E8F5E9] focus:outline-none focus:border-[#39ff14]/50 transition-colors"
                  placeholder="e.g. Clothes, Food, Gifts"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-[#9FB8A7] uppercase tracking-[0.2em] font-bold block">Amount (₹)</label>
                <input
                  type="number"
                  value={newExpense.amount}
                  onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })}
                  className="w-full bg-[#0B0F0C] border border-[#2A3B2E] rounded-xl px-4 py-3 text-[#E8F5E9] focus:outline-none focus:border-[#39ff14]/50 transition-colors"
                  placeholder="e.g. 3000"
                  required
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsExpenseModalOpen(false)} className="flex-1 py-3 rounded-xl border border-[#2A3B2E] text-[#9FB8A7] text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#2A3B2E] transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isAddingExpense} className="flex-1 py-3 rounded-xl bg-[#39ff14] text-[#0B0F0C] text-[10px] font-bold uppercase tracking-[0.2em] hover:shadow-[0_0_20px_rgba(142,255,113,0.4)] disabled:opacity-50 transition-all">
                  {isAddingExpense ? 'Adding...' : 'Add Category'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
