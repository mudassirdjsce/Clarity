import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  LineChart,
  MessageSquare,
  LogOut,
  Settings,
  HelpCircle,
  Wallet,
  Globe,
  GraduationCap,
  TrendingUp,
  PieChart,
  Users
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useTranslation } from 'react-i18next';

export function Sidebar({ isOpen, onClose }) {
  const { t } = useTranslation();
  const location = useLocation();
  const isCompany = location.pathname.startsWith('/company');
  const basePath = isCompany ? '/company' : '/user';

  // Close sidebar on route change
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [location.pathname]);

  const navItems = [
    { icon: LayoutDashboard, labelKey: 'dashboard', path: `${basePath}/dashboard` },
    { icon: Wallet, labelKey: 'portfolio', path: `${basePath}/portfolio` },
    { icon: LineChart, labelKey: 'markets', path: `${basePath}/markets` },
    { icon: TrendingUp, labelKey: 'stocks', path: `${basePath}/stocks` },
    { icon: PieChart, labelKey: 'mutual_funds', path: `${basePath}/mutualfunds` },
    { icon: MessageSquare, labelKey: 'clarity_ai', path: `${basePath}/assistant` },
  ];

  if (!isCompany) {
    navItems.splice(5, 0, { icon: GraduationCap, label: 'Academy', path: `${basePath}/academy` });
    navItems.splice(6, 0, { icon: Users, label: 'Family', path: `${basePath}/family` });
  }

  const secondaryItems = [
    { 
      icon: LogOut, 
      labelKey: 'logout', 
      path: '/login', 
      className: 'text-red-500 hover:text-red-400 hover:bg-red-500/10',
      onClick: () => localStorage.removeItem('clarity_user')
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity lg:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <aside className={cn(
        "fixed left-0 top-16 bottom-0 w-64 glass border-r border-glass-border flex flex-col p-4 z-40 transition-transform duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex-1 space-y-8 overflow-y-auto">
          <div>
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-4 px-4">
              {t('main_menu')}
            </p>
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
                  <span className="font-medium">{item.labelKey ? t(item.labelKey) : item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </div>

        <div className="pt-4 border-t border-white/5 space-y-1">
          {secondaryItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={item.onClick}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                item.className || (isActive
                  ? "bg-white/10 text-white"
                  : "text-white/40 hover:text-white hover:bg-white/5")
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{t(item.labelKey)}</span>
            </NavLink>
          ))}
        </div>

        {isCompany && (
          <div className="mt-6 p-4 rounded-2xl bg-neon-green/5 border border-neon-green/20">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-neon-green" />
              <span className="text-[10px] font-bold text-neon-green uppercase tracking-wider">
                {t('pro_mode_active')}
              </span>
            </div>
            <p className="text-[10px] text-white/40 leading-relaxed">
              {t('pro_mode_desc')}
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
