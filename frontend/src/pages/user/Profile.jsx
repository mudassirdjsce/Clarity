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
  Plane, 
  Ticket, 
  Hotel, 
  ShieldCheck, 
  Fingerprint, 
  MessageSquare, 
  LayoutDashboard, 
  Wallet, 
  Target, 
  Calendar, 
  User
} from 'lucide-react';
import { Badge, Card, ProgressBar, Toggle } from '../../components/CommonProfile';

export default function UserProfile() {
  const [biometric, setBiometric] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [mode, setMode] = useState('retail');

  return (
    <div className="space-y-12">
      {/* Profile Section */}
      <section className="flex flex-col md:flex-row items-center md:items-end gap-8 mb-16">
        <div className="relative group">
          <div className="absolute -inset-1 bg-primary rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000" />
          <div className="relative p-1 rounded-full bg-gradient-to-tr from-primary to-surface-bright">
            <img 
              src="https://picsum.photos/seed/alex/300/300" 
              alt="Alex Rivera" 
              className="w-32 h-32 rounded-full object-cover border-4 border-surface"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute bottom-1 right-1 bg-primary text-surface p-1 rounded-full shadow-lg">
            <CheckCircle2 size={14} />
          </div>
        </div>
        
        <div className="text-center md:text-left space-y-2">
          <h1 className="font-headline text-5xl font-bold tracking-tight">Alex Rivera</h1>
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <Badge className="text-primary bg-primary/10">Verified Analyst</Badge>
            <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest flex items-center gap-1">
              <MapPin size={12} /> NYC, USA
            </span>
          </div>
        </div>

        <div className="md:ml-auto flex gap-3">
          <button className="bg-surface-container-highest px-6 py-3 rounded-full font-label text-xs font-bold uppercase tracking-widest hover:bg-surface-variant transition-all">
            Edit Profile
          </button>
          <button className="bg-primary text-surface px-6 py-3 rounded-full font-label text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(142,255,113,0.3)] active:scale-95 transition-all">
            Share Portfolio
          </button>
        </div>
      </section>

      {/* Info & Bank Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full text-primary">
              <User size={24} />
            </div>
            <div>
              <h2 className="font-headline text-2xl font-semibold">Personal Information</h2>
              <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">Contact & Verification</p>
            </div>
          </div>
          <div className="space-y-4 pt-2">
            <div className="bg-surface-container-high p-4 rounded-2xl flex items-center gap-4">
              <Mail className="text-on-surface-variant" size={20} />
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Email</p>
                <p className="font-medium">alex@synthetic.io</p>
              </div>
            </div>
            <div className="bg-surface-container-high p-4 rounded-2xl flex items-center gap-4">
              <Phone className="text-on-surface-variant" size={20} />
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Phone Number</p>
                <p className="font-medium">+1 234 567 8900</p>
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
              <h2 className="font-headline text-2xl font-semibold">Bank Accounts</h2>
              <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">Connected Institutions</p>
            </div>
          </div>
          <div className="space-y-4 pt-2">
            <div className="bg-surface-container-high p-5 rounded-2xl">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-variant flex items-center justify-center font-bold text-primary">CH</div>
                  <div>
                    <p className="font-bold">Chase Priority Checking</p>
                    <p className="text-xs text-on-surface-variant">Active Connection</p>
                  </div>
                </div>
                <CheckCircle2 className="text-primary" size={16} />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">Account Number</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">**** 8829</span>
                    <Eye size={14} className="text-on-surface-variant cursor-pointer hover:text-primary" />
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">Routing Number</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">**** 0210</span>
                    <Eye size={14} className="text-on-surface-variant cursor-pointer hover:text-primary" />
                  </div>
                </div>
              </div>
            </div>
            <button className="w-full neon-border py-4 rounded-2xl flex items-center justify-center gap-2 text-primary font-label text-xs font-bold uppercase tracking-widest transition-all">
              <Plus size={18} /> Connect Bank Account
            </button>
          </div>
        </Card>
      </div>

      {/* Goals & Events Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-7 space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-headline text-2xl font-semibold">My Savings Goals</h2>
              <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">Strategic Wealth Accumulation</p>
            </div>
            <button className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full font-label text-[10px] font-bold uppercase tracking-widest hover:bg-primary/20 transition-all">
              <Plus size={14} /> New Goal
            </button>
          </div>
          
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-lg font-medium">Luxury Watch</h3>
                  <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest">Target: $12,000</p>
                </div>
                <div className="text-right">
                  <span className="font-headline text-xl text-primary font-bold">$8,400</span>
                  <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest">70% Reached</p>
                </div>
              </div>
              <ProgressBar progress={70} />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-lg font-medium">Global Tour</h3>
                  <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest">Target: $25,000</p>
                </div>
                <div className="text-right">
                  <span className="font-headline text-xl text-primary font-bold">$10,250</span>
                  <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest">41% Reached</p>
                </div>
              </div>
              <ProgressBar progress={41} />
            </div>
          </div>

          <div className="pt-6 border-t border-outline-variant/10 flex items-center justify-between text-on-surface-variant font-label text-[10px] uppercase tracking-widest">
            <span>Total Saved Across Goals</span>
            <span className="text-on-surface font-bold text-sm">$18,650.00</span>
          </div>
        </Card>

        <div className="lg:col-span-5 space-y-6">
          <div className="flex justify-between items-center px-2">
            <h2 className="font-headline text-2xl font-semibold">Events & Festivals</h2>
            <button className="text-primary hover:text-on-surface transition-colors">
              <PlusCircle size={24} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="bg-surface-container-high rounded-2xl p-6 border-l-4 border-primary">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-bold">Tomorrowland 2024</h3>
                  <p className="text-xs text-on-surface-variant">Boom, Belgium • July</p>
                </div>
                <span className="text-primary font-headline font-bold">$3,200</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-surface-variant/50 p-3 rounded-xl text-center space-y-1">
                  <Plane size={14} className="mx-auto text-on-surface-variant" />
                  <p className="text-[9px] uppercase font-bold tracking-tighter text-on-surface-variant">Travel</p>
                  <p className="text-[10px] text-primary font-bold">$1.2k</p>
                </div>
                <div className="bg-surface-variant/50 p-3 rounded-xl text-center space-y-1">
                  <Ticket size={14} className="mx-auto text-on-surface-variant" />
                  <p className="text-[9px] uppercase font-bold tracking-tighter text-on-surface-variant">Tickets</p>
                  <p className="text-[10px] text-primary font-bold">$800</p>
                </div>
                <div className="bg-surface-variant/50 p-3 rounded-xl text-center space-y-1">
                  <Hotel size={14} className="mx-auto text-on-surface-variant" />
                  <p className="text-[9px] uppercase font-bold tracking-tighter text-on-surface-variant">Stay</p>
                  <p className="text-[10px] text-primary font-bold">$1.2k</p>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-high rounded-2xl p-6 border-l-4 border-surface-variant">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold">Coachella</h3>
                  <p className="text-xs text-on-surface-variant">Indio, USA • April</p>
                </div>
                <span className="text-on-surface-variant font-headline font-bold">$2,800</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <img 
                      key={i}
                      src={`https://picsum.photos/seed/friend${i}/100/100`} 
                      className="w-8 h-8 rounded-full border-2 border-surface-container-high"
                      alt="Friend"
                      referrerPolicy="no-referrer"
                    />
                  ))}
                </div>
                <p className="text-[10px] text-on-surface-variant font-label uppercase tracking-widest">Planned with 4 others</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Experience */}
      <section className="space-y-6">
        <h2 className="font-headline text-2xl font-semibold">Security & Experience</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-primary/10 p-3 rounded-full text-primary">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="font-bold">Security Protocol</h3>
                <p className="text-xs text-on-surface-variant">Protection for your assets</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface-container-highest rounded-2xl">
                <div className="flex items-center gap-3">
                  <Fingerprint size={20} className="text-on-surface-variant" />
                  <span className="text-sm font-medium">Biometric Access</span>
                </div>
                <Toggle active={biometric} onToggle={() => setBiometric(!biometric)} />
              </div>
              <div className="flex items-center justify-between p-4 bg-surface-container-highest rounded-2xl">
                <div className="flex items-center gap-3">
                  <MessageSquare size={20} className="text-on-surface-variant" />
                  <span className="text-sm font-medium">2-Factor Auth (2FA)</span>
                </div>
                <Toggle active={twoFactor} onToggle={() => setTwoFactor(!twoFactor)} />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-primary/10 p-3 rounded-full text-primary">
                <LayoutDashboard size={24} />
              </div>
              <div>
                <h3 className="font-bold">Interface Preference</h3>
                <p className="text-xs text-on-surface-variant">Tailor your data view</p>
              </div>
            </div>
            <div className="flex bg-surface-container-lowest p-1 rounded-full border border-outline-variant/10">
              <button 
                onClick={() => setMode('retail')}
                className={`flex-1 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                  mode === 'retail' ? 'bg-primary text-surface' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Retail
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
              "Pro Engine" enables real-time candle charts and gas fee optimization.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
}
