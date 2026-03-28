import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
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
  LayoutDashboard, 
  Wallet, 
  Target,
  User,
  Trash2
} from 'lucide-react';
import { Badge, Card, ProgressBar, Toggle, GlobalProfileTheme } from '../../components/CommonProfile';
import { fetchUserGoals, addUserGoal, addGoalFunds, deleteUserGoal, fetchUserFestivals, addUserFestival, addFestivalExpense, deleteUserFestival, fetchBankAccounts, connectBankAccount, addBankTransaction } from '../../services/api';

export default function UserProfile() {
  const [biometric, setBiometric] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [mode, setMode] = useState('retail');

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
      <GlobalProfileTheme />
      {/* Ambient backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#39ff14]/10 rounded-full blur-[150px] -z-10 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#1a3821]/30 rounded-full blur-[150px] -z-10 pointer-events-none" />

      {/* Profile Section */}
      <section className="flex flex-col md:flex-row items-center md:items-end gap-8 mb-16 relative z-10">
        <div className="relative group">
          <div className="absolute -inset-1 bg-[#39ff14] rounded-full blur-[20px] opacity-30 group-hover:opacity-60 transition duration-1000" />
          <div className="relative p-1 rounded-full bg-gradient-to-tr from-[#39ff14] to-[#1A231C]">
            <img 
              src="https://picsum.photos/seed/alex/300/300" 
              alt="Alex Rivera" 
              className="w-32 h-32 rounded-full object-cover border-4 border-[#0B0F0C]"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute bottom-1 right-1 bg-[#39ff14] text-[#0B0F0C] p-1.5 rounded-full shadow-[0_0_15px_rgba(142,255,113,0.8)]">
            <CheckCircle2 size={16} className="text-[#0B0F0C]" />
          </div>
        </div>
        
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-5xl font-bold tracking-tight">{user.name}</h1>
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <Badge>Verified Analyst</Badge>
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
          </div>
        </Card>

        <Card className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="bg-[#39ff14]/10 p-3 rounded-full text-[#39ff14] shadow-[0_0_15px_rgba(142,255,113,0.2)] border border-[#39ff14]/20">
              <Wallet size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Bank Accounts</h2>
              <p className="text-[10px] text-[#9FB8A7] uppercase tracking-[0.2em] font-bold mt-1">Connected Institutions</p>
            </div>
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
                              <span className={`font-mono font-bold text-sm ${ tx.amount >= 0 ? 'text-[#39ff14]' : 'text-red-400' }`}>
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
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
                          <p className="text-[10px] text-[#9FB8A7] uppercase tracking-[0.2em] font-bold">Remaining: ${remaining.toLocaleString()}</p>
                        )}
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xl text-[#39ff14] font-bold drop-shadow-[0_0_8px_rgba(142,255,113,0.4)]">${(goal.currentAmount || 0).toLocaleString()}</span>
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
                          Budget: ${festival.targetAmount.toLocaleString()} &nbsp;•&nbsp;
                          {isOver
                            ? <span className="text-red-400">Over by ${Math.abs(remaining).toLocaleString()}</span>
                            : <span>Remaining: ${remaining.toLocaleString()}</span>
                          }
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-[#39ff14] font-bold drop-shadow-[0_0_8px_rgba(142,255,113,0.4)]">${spent.toLocaleString()}</span>
                        <p className="text-[10px] text-[#9FB8A7] uppercase tracking-[0.2em] font-bold">{progress}% Used</p>
                      </div>
                    </div>

                    <ProgressBar progress={progress} />

                    {festival.expenses.length > 0 && (
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {festival.expenses.map((exp, j) => (
                          <div key={j} className="bg-[#1A231C] border border-[#2A3B2E] p-2 rounded-xl flex justify-between items-center">
                            <p className="text-[10px] text-[#9FB8A7] uppercase tracking-wider font-bold">{exp.category}</p>
                            <p className="text-[10px] text-[#39ff14] font-bold">${exp.amount.toLocaleString()}</p>
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

      {/* Security & Experience */}
      <section className="space-y-6 relative z-10">
        <h2 className="text-2xl font-semibold">Security & Experience</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-[#39ff14]/10 p-3 rounded-full text-[#39ff14] shadow-[0_0_15px_rgba(142,255,113,0.2)] border border-[#39ff14]/20">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="font-bold text-[#E8F5E9]">Security Protocol</h3>
                <p className="text-xs text-[#9FB8A7]">Protection for your assets</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#1A231C] border border-[#2A3B2E] rounded-2xl">
                <div className="flex items-center gap-3">
                  <Fingerprint size={20} className="text-[#9FB8A7]" />
                  <span className="text-sm font-medium text-[#E8F5E9]">Biometric Access</span>
                </div>
                <Toggle active={biometric} onToggle={() => setBiometric(!biometric)} />
              </div>
              <div className="flex items-center justify-between p-4 bg-[#1A231C] border border-[#2A3B2E] rounded-2xl">
                <div className="flex items-center gap-3">
                  <MessageSquare size={20} className="text-[#9FB8A7]" />
                  <span className="text-sm font-medium text-[#E8F5E9]">2-Factor Auth (2FA)</span>
                </div>
                <Toggle active={twoFactor} onToggle={() => setTwoFactor(!twoFactor)} />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-[#39ff14]/10 p-3 rounded-full text-[#39ff14] shadow-[0_0_15px_rgba(142,255,113,0.2)] border border-[#39ff14]/20">
                <LayoutDashboard size={24} />
              </div>
              <div>
                <h3 className="font-bold text-[#E8F5E9]">Interface Preference</h3>
                <p className="text-xs text-[#9FB8A7]">Tailor your data view</p>
              </div>
            </div>
            <div className="flex bg-[#0B0F0C] p-1 rounded-[2rem] border border-[#2A3B2E] shadow-inner">
              <button 
                onClick={() => setMode('retail')}
                className={`flex-1 py-3 rounded-[2rem] text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${
                  mode === 'retail' ? 'bg-[#39ff14] text-[#0B0F0C] shadow-[0_0_15px_rgba(142,255,113,0.4)]' : 'text-[#9FB8A7] hover:text-[#E8F5E9]'
                }`}
              >
                Retail
              </button>
              <button 
                onClick={() => setMode('pro')}
                className={`flex-1 py-3 rounded-[2rem] text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${
                  mode === 'pro' ? 'bg-[#39ff14] text-[#0B0F0C] shadow-[0_0_15px_rgba(142,255,113,0.4)]' : 'text-[#9FB8A7] hover:text-[#E8F5E9]'
                }`}
              >
                Pro Engine
              </button>
            </div>
            <p className="mt-6 text-[10px] text-center text-[#9FB8A7] italic uppercase tracking-wider font-bold leading-relaxed">
              "Pro Engine" enables real-time candle charts and gas fee optimization.
            </p>
          </Card>
        </div>
      </section>

      {/* Goal Form Modal */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
                  onChange={e => setNewGoal({...newGoal, title: e.target.value})}
                  className="w-full bg-[#0B0F0C] border border-[#2A3B2E] rounded-xl px-4 py-3 text-[#E8F5E9] focus:outline-none focus:border-[#39ff14]/50 transition-colors"
                  placeholder="e.g. Porsche 911"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-[#9FB8A7] uppercase tracking-[0.2em] font-bold block">Target Amount ($)</label>
                <input 
                  type="number" 
                  value={newGoal.targetAmount}
                  onChange={e => setNewGoal({...newGoal, targetAmount: e.target.value})}
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
                <label className="text-[10px] text-[#9FB8A7] uppercase tracking-[0.2em] font-bold block">Amount to Add ($)</label>
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
                <label className="text-[10px] text-[#9FB8A7] uppercase tracking-[0.2em] font-bold block">Total Budget ($)</label>
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
                <label className="text-[10px] text-[#9FB8A7] uppercase tracking-[0.2em] font-bold block">Amount ($)</label>
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
