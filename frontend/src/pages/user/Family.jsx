import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, DollarSign, Target, Plus, Trash2, Edit2, ShieldCheck } from 'lucide-react';
import { fetchFamilyMembers, addFamilyMember, updateFamilyMember, deleteFamilyMember, fetchFamilyGoals, addFamilyGoal, updateFamilyGoal, deleteFamilyGoal } from '../../services/api';

export function Family() {
  const storedUser = localStorage.getItem('clarity_user');
  const user = storedUser ? JSON.parse(storedUser) : { name: "User", email: "" };
  
  const [members, setMembers] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  // Forms state
  const [memberForm, setMemberForm] = useState({ name: '', role: '', income: '', savings: '' });
  const [goalForm, setGoalForm] = useState({ title: '', targetAmount: '', currentAmount: '', deadline: '' });

  // Add Funds state
  const [isAddFundsModalOpen, setIsAddFundsModalOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const [fundsAmount, setFundsAmount] = useState('');
  const [isAddingFunds, setIsAddingFunds] = useState(false);

  useEffect(() => {
    if (user.email) {
      loadFamilyData();
    }
  }, [user.email]);

  const loadFamilyData = async () => {
    try {
      setLoading(true);
      const [membersRes, goalsRes] = await Promise.all([
        fetchFamilyMembers(user.email),
        fetchFamilyGoals(user.email)
      ]);
      
      let fetchedMembers = membersRes.members || [];
      // Default primary user
      if (fetchedMembers.length === 0) {
        const primary = await addFamilyMember({
          email: user.email,
          name: user.name,
          role: "Primary",
          income: 0,
          savings: 0,
          isPrimary: true
        });
        fetchedMembers = [primary.member];
      }
      
      setMembers(fetchedMembers);
      setGoals(goalsRes.goals || []);
    } catch (error) {
      console.error("Error loading family data:", error);
    } finally {
      setLoading(false);
    }
  };

  // KPIs
  const totalIncome = members.reduce((sum, m) => sum + (m.income || 0), 0);
  const totalSavings = members.reduce((sum, m) => sum + (m.savings || 0), 0);
  const totalMembers = members.length;
  const totalGoals = goals.length;

  // Handlers
  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      if (editingMember) {
        await updateFamilyMember(editingMember._id, memberForm);
      } else {
        await addFamilyMember({ ...memberForm, email: user.email });
      }
      setShowMemberModal(false);
      setEditingMember(null);
      setMemberForm({ name: '', role: '', income: '', savings: '' });
      loadFamilyData();
    } catch (error) {
      console.error("Error saving member:", error);
    }
  };

  const handleDeleteMember = async (id) => {
    try {
      await deleteFamilyMember(id);
      loadFamilyData();
    } catch (error) {
      console.error("Error deleting member:", error);
    }
  };

  const openEditMember = (member) => {
    setEditingMember(member);
    setMemberForm({
      name: member.name,
      role: member.role,
      income: member.income || '',
      savings: member.savings || '',
    });
    setShowMemberModal(true);
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    try {
      await addFamilyGoal({ ...goalForm, email: user.email });
      setShowGoalModal(false);
      setGoalForm({ title: '', targetAmount: '', currentAmount: '', deadline: '' });
      loadFamilyData();
    } catch (error) {
      console.error("Error adding goal:", error);
    }
  };

  const handleEditGoal = async (e) => {
    e.preventDefault();
    try {
      await updateFamilyGoal(editingGoal._id, goalForm);
      setEditingGoal(null);
      setShowGoalModal(false);
      setGoalForm({ title: '', targetAmount: '', currentAmount: '', deadline: '' });
      loadFamilyData();
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };

  const handleDeleteGoal = async (id) => {
    try {
      await deleteFamilyGoal(id);
      loadFamilyData();
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };

  const openEditGoal = (goal) => {
    setEditingGoal(goal);
    setGoalForm({
      title: goal.title,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      deadline: goal.deadline || ''
    });
    setShowGoalModal(true);
  };

  const handleAddFunds = async (e) => {
    e.preventDefault();
    if (!fundsAmount || !selectedGoalId) return;
    setIsAddingFunds(true);
    try {
      const goal = goals.find(g => g._id === selectedGoalId);
      if (goal) {
        const newTotal = (goal.currentAmount || 0) + Number(fundsAmount);
        await updateFamilyGoal(selectedGoalId, { currentAmount: newTotal });
        loadFamilyData();
      }
      setFundsAmount('');
      setIsAddFundsModalOpen(false);
      setSelectedGoalId(null);
    } catch (err) {
      console.error("Failed to add funds:", err);
    } finally {
      setIsAddingFunds(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64 text-white/50 font-mono">Loading Family Profile...</div>;
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-extrabold tracking-tight mb-2">Family Dashboard</h1>
          <p className="text-white/40 font-medium tracking-wide">Manage wealth across your household</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bento-card relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <DollarSign size={48} className="text-[#39ff14]" />
          </div>
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-2">Total Income</p>
          <p className="text-2xl font-mono font-bold text-white">₹{totalIncome.toLocaleString()}</p>
        </div>
        <div className="bento-card relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShieldCheck size={48} className="text-[#39ff14]" />
          </div>
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-2">Total Savings</p>
          <p className="text-2xl font-mono font-bold text-[#39ff14]">₹{totalSavings.toLocaleString()}</p>
        </div>
        <div className="bento-card relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users size={48} className="text-[#39ff14]" />
          </div>
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-2">Members</p>
          <p className="text-2xl font-mono font-bold text-white">{totalMembers}</p>
        </div>
        <div className="bento-card relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Target size={48} className="text-[#39ff14]" />
          </div>
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-2">Active Goals</p>
          <p className="text-2xl font-mono font-bold text-white">{totalGoals}</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Family Members Section */}
        <section className="space-y-4">
          <div className="flex justify-between items-center bg-white/5 border border-white/10 rounded-2xl p-4">
            <div>
              <h2 className="text-lg font-display font-bold">Family Members</h2>
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Household Hierarchy</p>
            </div>
            <button 
              onClick={() => {
                setEditingMember(null);
                setMemberForm({ name: '', role: '', income: '', savings: '' });
                setShowMemberModal(true);
              }}
              className="bg-[#39ff14]/10 hover:bg-[#39ff14]/20 text-[#39ff14] border border-[#39ff14]/20 p-2 rounded-xl transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {members.map(member => {
              const progress = member.income > 0 ? Math.min(100, (member.savings / member.income) * 100) : 0;
              return (
                <div key={member._id} className="bento-card group flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-lg text-white/60 group-hover:text-[#39ff14] group-hover:border-[#39ff14]/30 transition-colors">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-white">{member.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded border border-white/10">{member.role}</span>
                          {member.isPrimary && <span className="text-[9px] font-bold text-[#39ff14] bg-[#39ff14]/10 px-2 py-0.5 rounded border border-[#39ff14]/20">PRIMARY</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openEditMember(member)} className="text-white/20 hover:text-white p-1 transition-colors">
                        <Edit2 size={16} />
                      </button>
                      {!member.isPrimary && (
                        <button onClick={() => handleDeleteMember(member._id)} className="text-white/20 hover:text-red-400 p-1 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-1">Income</p>
                      <p className="text-sm font-mono font-semibold text-white">₹{member.income.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-1">Savings</p>
                      <p className="text-sm font-mono font-semibold text-[#39ff14]">₹{member.savings.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">
                      <span>Savings Rate</span>
                      <span className="text-[#39ff14]">{progress.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                      <div className="h-full bg-linear-to-r from-green-500 to-[#39ff14] transition-all duration-500" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Family Goals Section */}
        <section className="space-y-4">
          <div className="flex justify-between items-center bg-white/5 border border-white/10 rounded-2xl p-4">
            <div>
              <h2 className="text-lg font-display font-bold">Family Goals</h2>
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Shared Objectives</p>
            </div>
            <button 
              onClick={() => {
                setEditingGoal(null);
                setGoalForm({ title: '', targetAmount: '', currentAmount: '', deadline: '' });
                setShowGoalModal(true);
              }}
              className="bg-[#39ff14] hover:bg-green-400 text-obsidian font-bold p-2 rounded-xl transition-colors shadow-[0_0_15px_rgba(57,255,20,0.3)]"
            >
              <Plus size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {goals.length === 0 ? (
              <div className="bento-card text-center py-12">
                <Target size={32} className="mx-auto text-white/20 mb-3" />
                <p className="text-sm font-semibold text-white/50">No shared goals yet</p>
                <p className="text-[10px] text-white/30 uppercase tracking-widest mt-1">Add a goal to track progress</p>
              </div>
            ) : (
              goals.map(goal => {
                const progress = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
                return (
                  <div key={goal._id} className="bento-card group space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-base text-white">{goal.title}</h3>
                        {goal.deadline && (
                          <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mt-1">Due: {new Date(goal.deadline).toLocaleDateString()}</p>
                        )}
                      </div>
                      <div className="flex gap-2 items-center">
                        <button onClick={() => { setSelectedGoalId(goal._id); setIsAddFundsModalOpen(true); }} className="w-6 h-6 rounded-full bg-[#39ff14]/10 text-[#39ff14] flex items-center justify-center hover:bg-[#39ff14]/20 border border-[#39ff14]/20 transition-all p-1"><Plus size={14} strokeWidth={3} /></button>
                        <button onClick={() => openEditGoal(goal)} className="text-white/20 hover:text-white transition-colors p-1"><Edit2 size={16} /></button>
                        <button onClick={() => handleDeleteGoal(goal._id)} className="text-white/20 hover:text-red-400 transition-colors p-1"><Trash2 size={16} /></button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Current</p>
                        <p className="text-xl font-mono font-bold text-[#39ff14]">₹{goal.currentAmount.toLocaleString()}</p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Target</p>
                        <p className="text-sm font-mono font-semibold text-white/70">₹{goal.targetAmount.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">
                        <span>Progress</span>
                        <span className="text-white">{progress.toFixed(1)}%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10 relative">
                        <div className="absolute top-0 left-0 h-full bg-[#39ff14] shadow-[0_0_10px_rgba(57,255,20,0.5)] transition-all duration-500" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>

      {/* ── MODALS ── */}
      
      {/* Member Modal */}
      {showMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-obsidian/80 backdrop-blur-sm" onClick={() => setShowMemberModal(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-md bg-obsidian border border-white/10 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6">{editingMember ? 'Update Family Member' : 'Add Family Member'}</h3>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold block mb-2">Name</label>
                <input required type="text" value={memberForm.name} onChange={e => setMemberForm({...memberForm, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#39ff14]/50 transition-colors" placeholder="e.g. Jane Doe" />
              </div>
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold block mb-2">Role</label>
                <input required type="text" disabled={editingMember && editingMember.isPrimary} value={memberForm.role} onChange={e => setMemberForm({...memberForm, role: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#39ff14]/50 transition-colors disabled:opacity-50" placeholder="e.g. Spouse / Child" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold block mb-2">Income (₹)</label>
                  <input type="number" value={memberForm.income} onChange={e => setMemberForm({...memberForm, income: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#39ff14]/50 transition-colors font-mono" placeholder="0" />
                </div>
                <div>
                  <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold block mb-2">Savings (₹)</label>
                  <input type="number" value={memberForm.savings} onChange={e => setMemberForm({...memberForm, savings: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#39ff14]/50 transition-colors font-mono" placeholder="0" />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowMemberModal(false)} className="flex-1 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-white/60 text-xs font-bold uppercase tracking-widest transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-xl bg-[#39ff14] text-obsidian text-xs font-bold uppercase tracking-widest hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] transition-all">{editingMember ? 'Update Member' : 'Add Member'}</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Goal Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-obsidian/80 backdrop-blur-sm" onClick={() => setShowGoalModal(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-md bg-obsidian border border-white/10 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6">{editingGoal ? 'Update Goal' : 'Create Goal'}</h3>
            <form onSubmit={editingGoal ? handleEditGoal : handleAddGoal} className="space-y-4">
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold block mb-2">Title</label>
                <input required type="text" value={goalForm.title} onChange={e => setGoalForm({...goalForm, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#39ff14]/50 transition-colors" placeholder="e.g. Vacation Fund" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold block mb-2">Target (₹)</label>
                  <input required type="number" value={goalForm.targetAmount} onChange={e => setGoalForm({...goalForm, targetAmount: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#39ff14]/50 transition-colors font-mono" placeholder="100000" />
                </div>
                <div>
                  <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold block mb-2">Current (₹)</label>
                  <input type="number" value={goalForm.currentAmount} onChange={e => setGoalForm({...goalForm, currentAmount: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#39ff14]/50 transition-colors font-mono" placeholder="0" />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold block mb-2">Deadline (Optional)</label>
                <input type="date" value={goalForm.deadline} onChange={e => setGoalForm({...goalForm, deadline: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#39ff14]/50 transition-colors" style={{ colorScheme: 'dark' }} />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowGoalModal(false)} className="flex-1 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-white/60 text-xs font-bold uppercase tracking-widest transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-xl bg-[#39ff14] text-obsidian text-xs font-bold uppercase tracking-widest hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] transition-all">
                  {editingGoal ? 'Save Changes' : 'Deploy Goal'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Add Funds Modal */}
      {isAddFundsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-obsidian/80 backdrop-blur-sm" onClick={() => setIsAddFundsModalOpen(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-md bg-obsidian border border-white/10 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6">Add Funds to Goal</h3>
            <form onSubmit={handleAddFunds} className="space-y-4">
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold block mb-2">Amount to Add (₹)</label>
                <input
                  type="number"
                  value={fundsAmount}
                  onChange={(e) => setFundsAmount(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#39ff14]/50 transition-colors font-mono"
                  placeholder="e.g. 500"
                  required
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsAddFundsModalOpen(false)} className="flex-1 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-white/60 text-xs font-bold uppercase tracking-widest transition-colors">Cancel</button>
                <button
                  type="submit"
                  disabled={isAddingFunds}
                  className="flex-1 py-3 rounded-xl bg-[#39ff14] text-obsidian text-xs font-bold uppercase tracking-widest hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isAddingFunds ? 'Adding...' : 'Add Funds'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Family;
