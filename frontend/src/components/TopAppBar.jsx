import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, User, LayoutGrid, Accessibility, Type, Eye } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import logo from '../assets/CLARITY1.svg';

export function TopAppBar() {
  const location = useLocation();
  const isCompany = location.pathname.startsWith('/company');

  const storedUser = localStorage.getItem('clarity_user');
  const user = storedUser ? JSON.parse(storedUser) : { name: "Alex Rivera" };

  const [showA11yMenu, setShowA11yMenu] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [contrastMode, setContrastMode] = useState('standard');
  const a11yRef = useRef(null);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  useEffect(() => {
    document.body.classList.remove('high-contrast', 'protanopia', 'deuteranopia');
    if (contrastMode !== 'standard') {
      document.body.classList.add(contrastMode);
    }
  }, [contrastMode]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (a11yRef.current && !a11yRef.current.contains(event.target)) {
        setShowA11yMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
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
      <div className="flex items-center gap-8">
        <NavLink to={isCompany ? "/company/dashboard" : "/user/dashboard"} className="flex items-center cursor-pointer z-10 transition-transform hover:scale-105">
          <img src={logo} alt="Clarity Logo" className="h-10 w-auto object-contain" />
        </NavLink>


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

        <div className="relative" ref={a11yRef}>
          <button 
            onClick={() => setShowA11yMenu(!showA11yMenu)}
            className={cn(
              "p-2 rounded-xl transition-colors relative flex items-center justify-center",
              showA11yMenu ? "bg-white/10 text-white" : "hover:bg-white/5 text-white/60"
            )}
            aria-label="Accessibility Settings"
          >
            <Accessibility className="w-5 h-5" />
          </button>

          {showA11yMenu && (
            <div className="absolute top-full right-0 mt-4 w-72 glass bento-card border border-white/10 shadow-2xl z-50 p-5 transform origin-top-right transition-all">
              <div className="mb-5">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Type className="w-4 h-4 text-neon-green" />
                  Global Font Size
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-white/50">A</span>
                  <input 
                    type="range" 
                    min="12" 
                    max="24" 
                    value={fontSize} 
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="flex-1 accent-neon-green h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-base font-bold">A</span>
                </div>
                <div className="text-right text-[10px] text-white/40 mt-1">{fontSize}px</div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-neon-green" />
                  Visual Contrast
                </h3>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => setContrastMode('standard')}
                    className={cn(
                      "text-xs py-2 px-3 rounded-lg text-left transition-colors border",
                      contrastMode === 'standard' 
                        ? "bg-neon-green/10 border-neon-green/30 text-neon-green" 
                        : "bg-white/5 border-transparent hover:bg-white/10 text-white/70"
                    )}
                  >
                    Standard Experience
                  </button>
                  <button 
                    onClick={() => setContrastMode('high-contrast')}
                    className={cn(
                      "text-xs py-2 px-3 rounded-lg text-left transition-colors border",
                      contrastMode === 'high-contrast' 
                        ? "bg-neon-green/10 border-neon-green/30 text-neon-green" 
                        : "bg-white/5 border-transparent hover:bg-white/10 text-white/70"
                    )}
                  >
                    High Contrast (Low Vision)
                  </button>
                  <button 
                    onClick={() => setContrastMode('protanopia')}
                    className={cn(
                      "text-xs py-2 px-3 rounded-lg text-left transition-colors border",
                      contrastMode === 'protanopia' 
                        ? "bg-neon-green/10 border-neon-green/30 text-neon-green" 
                        : "bg-white/5 border-transparent hover:bg-white/10 text-white/70"
                    )}
                  >
                    Protanopia (Red-blind)
                  </button>
                  <button 
                    onClick={() => setContrastMode('deuteranopia')}
                    className={cn(
                      "text-xs py-2 px-3 rounded-lg text-left transition-colors border",
                      contrastMode === 'deuteranopia' 
                        ? "bg-neon-green/10 border-neon-green/30 text-neon-green" 
                        : "bg-white/5 border-transparent hover:bg-white/10 text-white/70"
                    )}
                  >
                    Deuteranopia (Green-blind)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-white/10 mx-2"></div>

        <NavLink
          to={isCompany ? "/company/profile" : "/user/profile"}
          className="flex items-center gap-2 pl-2 pr-1 py-1 hover:bg-white/5 rounded-xl transition-colors"
        >
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold">{user.name}</p>
            <p className="text-[10px] text-neon-green font-mono uppercase tracking-wider">{isCompany ? 'Institutional' : 'Premium'}</p>
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
