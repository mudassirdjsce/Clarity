import React from 'react';
import { Search, Bell, User, LayoutGrid } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';

export function TopAppBar() {
  const location = useLocation();
  const isCompany = location.pathname.startsWith('/company');

  return (
    <header className="fixed top-0 left-0 right-0 h-16 glass border-b border-glass-border z-50 px-6 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-neon-green rounded-lg flex items-center justify-center">
            <LayoutGrid className="text-obsidian w-5 h-5" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">CLARITY</span>
        </div>

        <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
          <NavLink
            to="/user/dashboard"
            className={({ isActive }) => cn(
              "px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
              !isCompany ? "bg-neon-green text-obsidian shadow-lg" : "text-white/60 hover:text-white"
            )}
          >
            Retail
          </NavLink>
          <NavLink
            to="/company/dashboard"
            className={({ isActive }) => cn(
              "px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
              isCompany ? "bg-neon-green text-obsidian shadow-lg" : "text-white/60 hover:text-white"
            )}
          >
            Pro Terminal
          </NavLink>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 w-64">
          <Search className="w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search assets, news, AI..."
            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-white/20"
          />
        </div>
        
        <button className="p-2 hover:bg-white/5 rounded-xl transition-colors relative">
          <Bell className="w-5 h-5 text-white/60" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-neon-green rounded-full border-2 border-obsidian"></span>
        </button>
        
        <div className="h-8 w-px bg-white/10 mx-2"></div>
        
        <button className="flex items-center gap-2 pl-2 pr-1 py-1 hover:bg-white/5 rounded-xl transition-colors">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold">Alex Rivera</p>
            <p className="text-[10px] text-neon-green font-mono uppercase tracking-wider">{isCompany ? 'Institutional' : 'Premium'}</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-green to-emerald-500 flex items-center justify-center">
            <User className="text-obsidian w-5 h-5" />
          </div>
        </button>
      </div>
    </header>
  );
}
