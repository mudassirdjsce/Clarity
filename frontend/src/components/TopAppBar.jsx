import React, { useState, useEffect, useRef } from 'react';
import { Bell, User, Languages, Type, Eye, Globe, Accessibility } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import logo from '../assets/CLARITY1.svg';
import { useTranslation } from 'react-i18next';

// ─── Shared dropdown shell ───────────────────────────────────────────────────
function DropdownPanel({ children }) {
  return (
    <div
      className="absolute top-full right-0 mt-4 rounded-2xl border border-white/20 z-50 p-5 origin-top-right max-h-[85vh] overflow-y-auto"
      style={{
        minWidth: 240,
        background: 'rgba(8, 8, 8, 0.96)',
        backdropFilter: 'blur(32px)',
        boxShadow: '0 0 50px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05)',
        animation: 'panelIn 0.18s cubic-bezier(0.16, 1, 0.3, 1) both',
      }}
    >
      <style>{`
        @keyframes panelIn {
          from { opacity: 0; transform: scale(0.95) translateY(-6px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
      `}</style>
      {children}
    </div>
  );
}

// ─── Icon button ─────────────────────────────────────────────────────────────
function IconBtn({ active, onClick, label, children }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn(
        'p-2 rounded-xl transition-colors relative flex items-center justify-center',
        active ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-white/60'
      )}
    >
      {children}
    </button>
  );
}

export function TopAppBar() {
  const { t, i18n } = useTranslation();
  const location  = useLocation();
  const isCompany = location.pathname.startsWith('/company');

  const storedUser = localStorage.getItem('clarity_user');
  const user = storedUser ? JSON.parse(storedUser) : { name: 'Alex Rivera' };

  // which panel is open: null | 'lang' | 'a11y'
  const [openPanel, setOpenPanel] = useState(null);
  const [fontSize, setFontSize]   = useState(16);
  const [contrastMode, setContrastMode] = useState('standard');

  const panelRef = useRef(null);

  const toggle = (panel) => setOpenPanel(prev => prev === panel ? null : panel);

  // close on outside click
  useEffect(() => {
    function onOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpenPanel(null);
      }
    }
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  // font-size effect
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  // contrast effect
  useEffect(() => {
    document.body.classList.remove('high-contrast', 'protanopia', 'deuteranopia', 'tunnel-vision');
    if (contrastMode !== 'standard') document.body.classList.add(contrastMode);
  }, [contrastMode]);

  const activeLang = i18n.language?.split('-')[0] || 'en';

  return (
    <>
      {/* Hidden SVG filters for colour-blindness modes */}
      <svg style={{ display: 'none' }}>
        <defs>
          <filter id="protanopia-filter">
            <feColorMatrix type="matrix" values="0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0" />
          </filter>
          <filter id="deuteranopia-filter">
            <feColorMatrix type="matrix" values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0" />
          </filter>
        </defs>
      </svg>

      <header className="fixed top-0 left-0 right-0 h-16 glass border-b border-glass-border z-50 px-6 flex items-center justify-between">

        {/* ── Left: Logo ───────────────────────────────────────────────────── */}
        <NavLink
          to={isCompany ? '/company/dashboard' : '/user/dashboard'}
          className="flex items-center cursor-pointer z-10 transition-transform hover:scale-105"
        >
          <img src={logo} alt="Clarity Logo" className="h-10 w-auto object-contain" />
        </NavLink>

        {/* ── Right: Actions ───────────────────────────────────────────────── */}
        <div className="flex items-center gap-2" ref={panelRef}>

          {/* Bell */}
          <button className="p-2 hover:bg-white/5 rounded-xl transition-colors relative">
            <Bell className="w-5 h-5 text-white/60" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-neon-green rounded-full border-2 border-obsidian" />
          </button>

          {/* ── Language button ─────────────────────────────────────────────── */}
          <div className="relative">
            <IconBtn
              active={openPanel === 'lang'}
              onClick={() => toggle('lang')}
              label="Language"
            >
              <Languages className="w-5 h-5" />
            </IconBtn>

            {openPanel === 'lang' && (
              <DropdownPanel>
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-neon-green" />
                  {t('language')}
                </h3>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { code: 'en', label: 'EN'     },
                    { code: 'hi', label: 'हिंदी'  },
                    { code: 'mr', label: 'मराठी'  },
                  ].map(({ code, label }) => (
                    <button
                      key={code}
                      onClick={() => { i18n.changeLanguage(code); setOpenPanel(null); }}
                      className={cn(
                        'text-xs py-2.5 px-3 rounded-xl text-center transition-all duration-200 border font-bold',
                        activeLang === code
                          ? 'bg-neon-green/15 border-neon-green/40 text-neon-green shadow-[0_0_14px_rgba(57,255,20,0.15)]'
                          : 'bg-white/5 border-transparent hover:bg-white/10 text-white/60 hover:text-white'
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <p className="text-[10px] text-white/20 mt-4 text-center font-mono">
                  {activeLang === 'en' ? 'English' : activeLang === 'hi' ? 'हिन्दी' : 'मराठी'} · auto-saved
                </p>
              </DropdownPanel>
            )}
          </div>

          {/* ── Accessibility button ─────────────────────────────────────────── */}
          <div className="relative">
            <IconBtn
              active={openPanel === 'a11y'}
              onClick={() => toggle('a11y')}
              label="Accessibility"
            >
              <Accessibility className="w-5 h-5" />
            </IconBtn>

            {openPanel === 'a11y' && (
              <DropdownPanel>
                {/* Font Size */}
                <div className="mb-5">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Type className="w-4 h-4 text-neon-green" />
                    {t('global_font_size')}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-white/50">A</span>
                    <input
                      type="range" min="12" max="24" value={fontSize}
                      onChange={e => setFontSize(Number(e.target.value))}
                      className="flex-1 accent-neon-green h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-base font-bold">A</span>
                  </div>
                  <div className="text-right text-[10px] text-white/40 mt-1">{fontSize}px</div>
                </div>

                <div className="h-px bg-white/8 mb-5" />

                {/* Visual Contrast */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-neon-green" />
                    {t('visual_contrast')}
                  </h3>
                  <div className="flex flex-col gap-2">
                    {[
                      { key: 'standard',      labelKey: 'standard_exp'  },
                      { key: 'high-contrast', labelKey: 'high_contrast' },
                      { key: 'protanopia',    labelKey: 'protanopia'    },
                      { key: 'deuteranopia',  labelKey: 'deuteranopia'  },
                      { key: 'tunnel-vision', labelKey: 'tunnel_vision' },
                    ].map(({ key, labelKey }) => (
                      <button
                        key={key}
                        onClick={() => setContrastMode(key)}
                        className={cn(
                          'text-xs py-2 px-3 rounded-lg text-left transition-colors border',
                          contrastMode === key
                            ? 'bg-neon-green/10 border-neon-green/30 text-neon-green'
                            : 'bg-white/5 border-transparent hover:bg-white/10 text-white/70'
                        )}
                      >
                        {t(labelKey)}
                      </button>
                    ))}
                  </div>
                </div>
              </DropdownPanel>
            )}
          </div>

          <div className="h-8 w-px bg-white/10 mx-1" />

          {/* Profile */}
          <NavLink
            to={isCompany ? '/company/profile' : '/user/profile'}
            className="flex items-center gap-2 pl-2 pr-1 py-1 hover:bg-white/5 rounded-xl transition-colors"
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold">{user.name}</p>
              <p className="text-[10px] text-neon-green font-mono uppercase tracking-wider">
                {isCompany ? t('institutional') : t('premium')}
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-green to-emerald-500 flex items-center justify-center">
              <User className="text-obsidian w-5 h-5" />
            </div>
          </NavLink>

        </div>
      </header>
    </>
  );
}
