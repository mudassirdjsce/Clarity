import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  MapPin, 
  Mail, 
  Phone, 
  CheckCircle2, 
  Eye, 
  Plus, 
  PlusCircle, 
  Building2, 
  Globe, 
  Users, 
  ShieldCheck, 
  Fingerprint, 
  LayoutDashboard, 
  Wallet, 
  Target, 
  TrendingUp,
  BarChart3,
  Briefcase
} from 'lucide-react';
import { Badge, Card, ProgressBar, Toggle, GlobalProfileTheme } from '../../components/CommonProfile';

export default function CompanyProfile() {
  const [biometric, setBiometric] = useState(true);
  const [mode, setMode] = useState('pro');

  const storedUser = localStorage.getItem('clarity_user');
  const user = storedUser ? JSON.parse(storedUser) : { name: "Synthetic IO", email: "treasury@synthetic.io", phone: "+1 234 567 8900" };

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
            <div className="w-32 h-32 rounded-full bg-[#0B0F0C] flex items-center justify-center border-4 border-[#0B0F0C] overflow-hidden">
               <Building2 size={64} className="text-[#39ff14]" />
            </div>
          </div>
          <div className="absolute bottom-1 right-1 bg-[#39ff14] text-[#0B0F0C] p-1.5 rounded-full shadow-[0_0_15px_rgba(142,255,113,0.8)]">
            <ShieldCheck size={16} className="text-[#0B0F0C]" />
          </div>
        </div>
        
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-5xl font-bold tracking-tight">{user.name}</h1>
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <Badge>Enterprise Entity</Badge>
            <span className="text-[10px] text-[#9FB8A7] uppercase tracking-[0.2em] flex items-center gap-1 font-bold">
              <Globe size={12} /> Global Operations
            </span>
          </div>
        </div>

        <div className="md:ml-auto flex gap-3">
          <button className="bg-[#1A231C] border border-[#2A3B2E] text-[#E8F5E9] px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#2A3B2E] transition-all shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
            Corporate Settings
          </button>
          <button className="bg-[#39ff14] text-[#0B0F0C] px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(142,255,113,0.4)] hover:shadow-[0_0_30px_rgba(142,255,113,0.6)] active:scale-95 transition-all">
            Export Audit
          </button>
        </div>
      </section>

      {/* Corporate Info & Treasury Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        <Card className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="bg-[#39ff14]/10 p-3 rounded-full text-[#39ff14] shadow-[0_0_15px_rgba(142,255,113,0.2)] border border-[#39ff14]/20">
              <Briefcase size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Business Information</h2>
              <p className="text-[10px] text-[#9FB8A7] uppercase tracking-[0.2em] font-bold mt-1">Entity Details & Compliance</p>
            </div>
          </div>
          <div className="space-y-4 pt-2">
            <div className="bg-white/3 border border-white/5 p-4 rounded-2xl flex items-center gap-4 hover:bg-white/5 transition-colors">
              <Mail className="text-[#9FB8A7]" size={20} />
              <div>
                <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#9FB8A7]">Corporate Email</p>
                <p className="font-medium text-[#E8F5E9]">{user.email}</p>
              </div>
            </div>
            <div className="bg-white/3 border border-white/5 p-4 rounded-2xl flex items-center gap-4 hover:bg-white/5 transition-colors">
              <Phone className="text-[#9FB8A7]" size={20} />
              <div>
                <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#9FB8A7]">Corporate Phone</p>
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
              <h2 className="text-2xl font-semibold">Treasury Accounts</h2>
              <p className="text-[10px] text-[#9FB8A7] uppercase tracking-[0.2em] font-bold mt-1">Operational Liquidity</p>
            </div>
          </div>
          <div className="space-y-4 pt-2">
            <div className="bg-white/3 border border-white/5 p-5 rounded-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-linear-to-r from-[#39ff14]/0 via-[#39ff14]/5 to-[#39ff14]/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1A231C] border border-[#2A3B2E] flex items-center justify-center font-bold text-[#39ff14]">GS</div>
                  <div>
                    <p className="font-bold text-[#E8F5E9]">Goldman Sachs Business</p>
                    <p className="text-xs text-[#9FB8A7]">Primary Treasury</p>
                  </div>
                </div>
                <CheckCircle2 className="text-[#39ff14]" size={18} />
              </div>
              <div className="space-y-3 relative z-10">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#9FB8A7]">Account Type</span>
                  <span className="font-medium text-[#E8F5E9]">Commercial Checking</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#9FB8A7]">Available Balance</span>
                  <span className="font-mono text-[#39ff14] font-bold drop-shadow-[0_0_8px_rgba(142,255,113,0.4)]">$2,450,000.00</span>
                </div>
              </div>
            </div>
            <button className="w-full border border-[#39ff14]/30 bg-[#39ff14]/5 hover:bg-[#39ff14]/10 py-4 rounded-2xl flex items-center justify-center gap-2 text-[#39ff14] text-[10px] font-bold uppercase tracking-[0.2em] transition-all shadow-[0_0_15px_rgba(142,255,113,0.1)] hover:shadow-[0_0_20px_rgba(142,255,113,0.2)]">
              <Plus size={16} /> Add Treasury Node
            </button>
          </div>
        </Card>
      </div>

      {/* KPIs & Team Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        <Card className="lg:col-span-7 space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold">Growth Milestones</h2>
              <p className="text-[10px] text-[#9FB8A7] uppercase tracking-[0.2em] font-bold mt-1">Quarterly Performance Targets</p>
            </div>
            <div className="bg-[#39ff14]/10 p-2 rounded-lg text-[#39ff14] border border-[#39ff14]/20 shadow-[0_0_10px_rgba(142,255,113,0.15)]">
              <TrendingUp size={20} />
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-lg font-medium text-[#E8F5E9]">Series B Funding</h3>
                  <p className="text-[10px] text-[#9FB8A7] uppercase tracking-[0.2em] font-bold">Target: $50M</p>
                </div>
                <div className="text-right">
                  <span className="text-xl text-[#39ff14] font-bold drop-shadow-[0_0_8px_rgba(142,255,113,0.4)]">$35M</span>
                  <p className="text-[10px] text-[#9FB8A7] uppercase tracking-[0.2em] font-bold">70% Committed</p>
                </div>
              </div>
              <ProgressBar progress={70} />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-lg font-medium text-[#E8F5E9]">Market Expansion</h3>
                  <p className="text-[10px] text-[#9FB8A7] uppercase tracking-[0.2em] font-bold">Target: 12 Regions</p>
                </div>
                <div className="text-right">
                  <span className="text-xl text-[#39ff14] font-bold drop-shadow-[0_0_8px_rgba(142,255,113,0.4)]">8 Regions</span>
                  <p className="text-[10px] text-[#9FB8A7] uppercase tracking-[0.2em] font-bold">66% Complete</p>
                </div>
              </div>
              <ProgressBar progress={66} />
            </div>
          </div>
        </Card>

        <div className="lg:col-span-5 space-y-6">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-2xl font-semibold">Core Team</h2>
            <button className="text-[#39ff14] hover:text-[#E8F5E9] transition-colors drop-shadow-[0_0_8px_rgba(142,255,113,0.4)]">
              <Users size={24} />
            </button>
          </div>
          
          <div className="space-y-4">
            {[
              { name: "Sarah Chen", role: "CTO", img: "sarah" },
              { name: "Marcus Thorne", role: "CFO", img: "marcus" },
              { name: "Elena Vance", role: "COO", img: "elena" }
            ].map((member, i) => (
              <div key={i} className="bg-white/3 border border-white/5 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/5 transition-colors shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
                <img 
                  src={`https://picsum.photos/seed/${member.img}/100/100`} 
                  className="w-12 h-12 rounded-full border-2 border-[#1A231C]"
                  alt={member.name}
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="font-bold text-sm text-[#E8F5E9]">{member.name}</h3>
                  <p className="text-[10px] text-[#9FB8A7] uppercase tracking-[0.2em] font-bold">{member.role}</p>
                </div>
                <div className="ml-auto bg-[#39ff14]/10 p-2 rounded-full text-[#39ff14] shadow-[0_0_10px_rgba(142,255,113,0.2)] border border-[#39ff14]/20">
                   <CheckCircle2 size={14} />
                </div>
              </div>
            ))}
            <button className="w-full py-3 rounded-xl bg-[#1A231C] border border-[#2A3B2E] text-[#9FB8A7] text-[10px] font-bold uppercase tracking-[0.2em] hover:text-[#39ff14] hover:border-[#39ff14]/30 transition-all shadow-[0_4px_15px_rgba(0,0,0,0.2)]">
              Manage Permissions
            </button>
          </div>
        </div>
      </div>

      {/* Enterprise Security */}
      <section className="space-y-6 relative z-10">
        <h2 className="text-2xl font-semibold">Enterprise Security</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-[#39ff14]/10 p-3 rounded-full text-[#39ff14] shadow-[0_0_15px_rgba(142,255,113,0.2)] border border-[#39ff14]/20">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="font-bold text-[#E8F5E9]">Access Control</h3>
                <p className="text-xs text-[#9FB8A7]">Multi-sig & Biometric</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#1A231C] border border-[#2A3B2E] rounded-2xl">
                <div className="flex items-center gap-3">
                  <Fingerprint size={20} className="text-[#9FB8A7]" />
                  <span className="text-sm font-medium text-[#E8F5E9]">Hardware Key Required</span>
                </div>
                <Toggle active={biometric} onToggle={() => setBiometric(!biometric)} />
              </div>
              <div className="flex items-center justify-between p-4 bg-[#1A231C] border border-[#2A3B2E] rounded-2xl">
                <div className="flex items-center gap-3">
                  <BarChart3 size={20} className="text-[#9FB8A7]" />
                  <span className="text-sm font-medium text-[#E8F5E9]">Real-time Audit Logs</span>
                </div>
                <Toggle active={true} onToggle={() => {}} />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-[#39ff14]/10 p-3 rounded-full text-[#39ff14] shadow-[0_0_15px_rgba(142,255,113,0.2)] border border-[#39ff14]/20">
                <LayoutDashboard size={24} />
              </div>
              <div>
                <h3 className="font-bold text-[#E8F5E9]">System Mode</h3>
                <p className="text-xs text-[#9FB8A7]">Advanced analytics engine</p>
              </div>
            </div>
            <div className="flex bg-[#0B0F0C] p-1 rounded-4xl border border-[#2A3B2E] shadow-inner">
              <button 
                onClick={() => setMode('standard')}
                className={`flex-1 py-3 rounded-4xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${
                  mode === 'standard' ? 'bg-[#39ff14] text-[#0B0F0C] shadow-[0_0_15px_rgba(142,255,113,0.4)]' : 'text-[#9FB8A7] hover:text-[#E8F5E9]'
                }`}
              >
                Standard
              </button>
              <button 
                onClick={() => setMode('pro')}
                className={`flex-1 py-3 rounded-4xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${
                  mode === 'pro' ? 'bg-[#39ff14] text-[#0B0F0C] shadow-[0_0_15px_rgba(142,255,113,0.4)]' : 'text-[#9FB8A7] hover:text-[#E8F5E9]'
                }`}
              >
                Pro Engine
              </button>
            </div>
            <p className="mt-6 text-[10px] text-center text-[#9FB8A7] italic uppercase tracking-wider font-bold leading-relaxed">
              "Pro Engine" is currently active for this corporate entity.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
}
