import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  LineChart, 
  Newspaper, 
  MessageSquare, 
  Settings, 
  HelpCircle,
  Wallet,
  Globe
} from 'lucide-react';
import { cn } from '../lib/utils';

export function Sidebar() {
  const location = useLocation();
  const isCompany = location.pathname.startsWith('/company');
  const basePath = isCompany ? '/company' : '/user';

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: `${basePath}/dashboard` },
    { icon: Wallet, label: 'Portfolio', path: `${basePath}/portfolio` },
    { icon: LineChart, label: 'Markets', path: `${basePath}/markets` },
    { icon: Newspaper, label: 'Intelligence', path: `${basePath}/intelligence` },
    { icon: MessageSquare, label: 'Clarity AI', path: `${basePath}/assistant` },
  ];

  const secondaryItems = [
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: HelpCircle, label: 'Support', path: '/support' },
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 glass border-r border-glass-border hidden lg:flex flex-col p-4 z-40">
      <div className="flex-1 space-y-8">
        <div>
          <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-4 px-4">Main Menu</p>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive 
                    ? "bg-neon-green/10 text-neon-green border border-neon-green/20" 
                    : "text-white/50 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 transition-transform group-hover:scale-110",
                  "group-[.active]:text-neon-green"
                )} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div>
          <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-4 px-4">Market Pulse</p>
          <div className="space-y-3 px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse"></div>
                <span className="text-xs text-white/60">BTC/USD</span>
              </div>
              <span className="text-xs font-mono text-neon-green">+4.2%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-white/5 space-y-1">
        {secondaryItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
              isActive 
                ? "bg-white/10 text-white" 
                : "text-white/40 hover:text-white hover:bg-white/5"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>

      {isCompany && (
        <div className="mt-6 p-4 rounded-2xl bg-neon-green/5 border border-neon-green/20">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-neon-green" />
            <span className="text-[10px] font-bold text-neon-green uppercase tracking-wider">Pro Node Active</span>
          </div>
          <p className="text-[10px] text-white/40 leading-relaxed">
            Connected to Institutional Liquidity Pool #482. Latency: 4ms.
          </p>
        </div>
      )}
    </aside>
  );
}
