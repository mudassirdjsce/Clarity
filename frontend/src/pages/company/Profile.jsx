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
import { Badge, Card, ProgressBar, Toggle } from '../../components/CommonProfile';

export default function CompanyProfile() {
  const [biometric, setBiometric] = useState(true);
  const [mode, setMode] = useState('pro');

  return (
    <div className="space-y-12">
      {/* Profile Section */}
      <section className="flex flex-col md:flex-row items-center md:items-end gap-8 mb-16">
        <div className="relative group">
          <div className="absolute -inset-1 bg-primary rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000" />
          <div className="relative p-1 rounded-full bg-gradient-to-tr from-primary to-surface-bright">
            <div className="w-32 h-32 rounded-full bg-surface flex items-center justify-center border-4 border-surface overflow-hidden">
               <Building2 size={64} className="text-primary" />
            </div>
          </div>
          <div className="absolute bottom-1 right-1 bg-primary text-surface p-1 rounded-full shadow-lg">
            <ShieldCheck size={14} />
          </div>
        </div>
        
        <div className="text-center md:text-left space-y-2">
          <h1 className="font-headline text-5xl font-bold tracking-tight">Synthetic IO</h1>
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <Badge className="text-primary bg-primary/10">Enterprise Entity</Badge>
            <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest flex items-center gap-1">
              <Globe size={12} /> Global Operations
            </span>
          </div>
        </div>

        <div className="md:ml-auto flex gap-3">
          <button className="bg-surface-container-highest px-6 py-3 rounded-full font-label text-xs font-bold uppercase tracking-widest hover:bg-surface-variant transition-all">
            Corporate Settings
          </button>
          <button className="bg-primary text-surface px-6 py-3 rounded-full font-label text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(142,255,113,0.3)] active:scale-95 transition-all">
            Export Audit
          </button>
        </div>
      </section>

      {/* Corporate Info & Treasury Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full text-primary">
              <Briefcase size={24} />
            </div>
            <div>
              <h2 className="font-headline text-2xl font-semibold">Business Information</h2>
              <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">Entity Details & Compliance</p>
            </div>
          </div>
          <div className="space-y-4 pt-2">
            <div className="bg-surface-container-high p-4 rounded-2xl flex items-center gap-4">
              <Mail className="text-on-surface-variant" size={20} />
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Corporate Email</p>
                <p className="font-medium">treasury@synthetic.io</p>
              </div>
            </div>
            <div className="bg-surface-container-high p-4 rounded-2xl flex items-center gap-4">
              <MapPin className="text-on-surface-variant" size={20} />
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Headquarters</p>
                <p className="font-medium">Silicon Valley, CA</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full text-primary">
              <Wallet size={24} />
            </div>
            <div>
              <h2 className="font-headline text-2xl font-semibold">Treasury Accounts</h2>
              <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">Operational Liquidity</p>
            </div>
          </div>
          <div className="space-y-4 pt-2">
            <div className="bg-surface-container-high p-5 rounded-2xl">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-variant flex items-center justify-center font-bold text-primary">GS</div>
                  <div>
                    <p className="font-bold">Goldman Sachs Business</p>
                    <p className="text-xs text-on-surface-variant">Primary Treasury</p>
                  </div>
                </div>
                <CheckCircle2 className="text-primary" size={16} />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">Account Type</span>
                  <span className="font-medium">Commercial Checking</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">Available Balance</span>
                  <span className="font-mono text-primary font-bold">$2,450,000.00</span>
                </div>
              </div>
            </div>
            <button className="w-full neon-border py-4 rounded-2xl flex items-center justify-center gap-2 text-primary font-label text-xs font-bold uppercase tracking-widest transition-all">
              <Plus size={18} /> Add Treasury Node
            </button>
          </div>
        </Card>
      </div>

      {/* KPIs & Team Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-7 space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-headline text-2xl font-semibold">Growth Milestones</h2>
              <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">Quarterly Performance Targets</p>
            </div>
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <TrendingUp size={20} />
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-lg font-medium">Series B Funding</h3>
                  <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest">Target: $50M</p>
                </div>
                <div className="text-right">
                  <span className="font-headline text-xl text-primary font-bold">$35M</span>
                  <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest">70% Committed</p>
                </div>
              </div>
              <ProgressBar progress={70} />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-lg font-medium">Market Expansion</h3>
                  <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest">Target: 12 Regions</p>
                </div>
                <div className="text-right">
                  <span className="font-headline text-xl text-primary font-bold">8 Regions</span>
                  <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest">66% Complete</p>
                </div>
              </div>
              <ProgressBar progress={66} />
            </div>
          </div>
        </Card>

        <div className="lg:col-span-5 space-y-6">
          <div className="flex justify-between items-center px-2">
            <h2 className="font-headline text-2xl font-semibold">Core Team</h2>
            <button className="text-primary hover:text-on-surface transition-colors">
              <Users size={24} />
            </button>
          </div>
          
          <div className="space-y-4">
            {[
              { name: "Sarah Chen", role: "CTO", img: "sarah" },
              { name: "Marcus Thorne", role: "CFO", img: "marcus" },
              { name: "Elena Vance", role: "COO", img: "elena" }
            ].map((member, i) => (
              <div key={i} className="bg-surface-container-high rounded-2xl p-4 flex items-center gap-4 border border-white/5">
                <img 
                  src={`https://picsum.photos/seed/${member.img}/100/100`} 
                  className="w-12 h-12 rounded-full border-2 border-primary/20"
                  alt={member.name}
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="font-bold text-sm">{member.name}</h3>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">{member.role}</p>
                </div>
                <div className="ml-auto bg-primary/10 p-2 rounded-full text-primary">
                   <CheckCircle2 size={14} />
                </div>
              </div>
            ))}
            <button className="w-full py-3 rounded-xl bg-surface-container-highest text-on-surface-variant font-label text-[10px] font-bold uppercase tracking-widest hover:text-primary transition-all">
              Manage Permissions
            </button>
          </div>
        </div>
      </div>

      {/* Enterprise Security */}
      <section className="space-y-6">
        <h2 className="font-headline text-2xl font-semibold">Enterprise Security</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-primary/10 p-3 rounded-full text-primary">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="font-bold">Access Control</h3>
                <p className="text-xs text-on-surface-variant">Multi-sig & Biometric</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface-container-highest rounded-2xl">
                <div className="flex items-center gap-3">
                  <Fingerprint size={20} className="text-on-surface-variant" />
                  <span className="text-sm font-medium">Hardware Key Required</span>
                </div>
                <Toggle active={biometric} onToggle={() => setBiometric(!biometric)} />
              </div>
              <div className="flex items-center justify-between p-4 bg-surface-container-highest rounded-2xl">
                <div className="flex items-center gap-3">
                  <BarChart3 size={20} className="text-on-surface-variant" />
                  <span className="text-sm font-medium">Real-time Audit Logs</span>
                </div>
                <Toggle active={true} onToggle={() => {}} />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-primary/10 p-3 rounded-full text-primary">
                <LayoutDashboard size={24} />
              </div>
              <div>
                <h3 className="font-bold">System Mode</h3>
                <p className="text-xs text-on-surface-variant">Advanced analytics engine</p>
              </div>
            </div>
            <div className="flex bg-surface-container-lowest p-1 rounded-full border border-outline-variant/10">
              <button 
                onClick={() => setMode('standard')}
                className={`flex-1 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                  mode === 'standard' ? 'bg-primary text-surface' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Standard
              </button>
              <button 
                onClick={() => setMode('pro')}
                className={`flex-1 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                  mode === 'pro' ? 'bg-primary text-surface' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Pro Engine
              </button>
            </div>
            <p className="mt-6 text-[10px] text-center text-on-surface-variant italic font-label leading-relaxed">
              "Pro Engine" is currently active for this corporate entity.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
}
