# Multilingual Implementation Plan

## 1. Setup Instructions

First, install the necessary dependencies:
```bash
npm install i18next react-i18next i18next-browser-languagedetector
```

Import `i18n.js` in your root file (e.g., `main.jsx` or `index.js`):
```javascript
import './i18n';
```

---

## 2. i18n Configuration (`src/i18n.js`)

```javascript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import hi from './locales/hi.json';
import mr from './locales/mr.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  mr: { translation: mr }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
```

---

## 3. Translation Files (`src/locales/`)

### `src/locales/en.json`
```json
{
  "search_placeholder": "Search assets, news, AI...",
  "global_font_size": "Global Font Size",
  "visual_contrast": "Visual Contrast",
  "language": "Language",
  "standard_exp": "Standard Experience",
  "high_contrast": "High Contrast (Low Vision)",
  "protanopia": "Protanopia (Red-blind)",
  "deuteranopia": "Deuteranopia (Green-blind)",
  "tunnel_vision": "Tunnel Vision",
  "premium": "Premium",
  "institutional": "Institutional",
  "welcome": "Welcome back",
  "portfolio": "Portfolio",
  "analyze": "Analyze",
  "send": "Send",
  "new_chat": "New Chat",
  "chat_placeholder": "Ask AI anything...",
  "loading": "Loading...",
  "error_message": "An error occurred."
}
```

### `src/locales/hi.json`
```json
{
  "search_placeholder": "संपत्ति, समाचार, एआई खोजें...",
  "global_font_size": "वैश्विक फ़ॉन्ट आकार",
  "visual_contrast": "दृश्य कंट्रास्ट",
  "language": "भाषा (Language)",
  "standard_exp": "मानक अनुभव",
  "high_contrast": "उच्च कंट्रास्ट (कम दृष्टि)",
  "protanopia": "प्रोटानोपिया (लाल-अंधत्व)",
  "deuteranopia": "ड्यूटेरानोपिया (हरा-अंधत्व)",
  "tunnel_vision": "सुरंग दृष्टि (Tunnel Vision)",
  "premium": "प्रीमियम",
  "institutional": "संस्थागत",
  "welcome": "वापसी पर स्वागत है",
  "portfolio": "पोर्टफोलियो",
  "analyze": "विश्लेषण करें",
  "send": "भेजें",
  "new_chat": "नई चैट",
  "chat_placeholder": "एआई से कुछ भी पूछें...",
  "loading": "लोड हो रहा है...",
  "error_message": "एक त्रुटि उत्पन्न हुई।"
}
```

### `src/locales/mr.json`
```json
{
  "search_placeholder": "मालमत्ता, बातम्या, एआय शोधा...",
  "global_font_size": "जागतिक फॉन्ट आकार",
  "visual_contrast": "दृश्य कॉन्ट्रास्ट",
  "language": "भाषा (Language)",
  "standard_exp": "मानक अनुभव",
  "high_contrast": "उच्च कॉन्ट्रास्ट (कमी दृष्टी)",
  "protanopia": "प्रोटानोपिया (लाल-अंधत्व)",
  "deuteranopia": "ड्यूटेरानोपिया (हिरवा-अंधत्व)",
  "tunnel_vision": "टनेल व्हिजन (Tunnel Vision)",
  "premium": "प्रीमियम",
  "institutional": "संस्थात्मक",
  "welcome": "पुन्हा स्वागत आहे",
  "portfolio": "पोर्टफोलिओ",
  "analyze": "विश्लेषण करा",
  "send": "पाठवा",
  "new_chat": "नवीन चॅट",
  "chat_placeholder": "एआयला काहीही विचारा...",
  "loading": "लोड करत आहे...",
  "error_message": "एक त्रुटी आली."
}
```

---

## 4. Updated `TopAppBar.jsx`

```jsx
import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, User, Accessibility, Type, Eye, Globe } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import logo from '../assets/CLARITY1.svg';
import { useTranslation } from 'react-i18next';

export function TopAppBar() {
  const { t, i18n } = useTranslation();
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
    document.body.classList.remove('high-contrast', 'protanopia', 'deuteranopia', 'tunnel-vision');
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

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

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
              placeholder={t('search_placeholder')}
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
              aria-label="Accessibility & Language Settings"
            >
              <Accessibility className="w-5 h-5" />
            </button>

            {showA11yMenu && (
              <div className="absolute top-full right-0 mt-4 w-72 bg-obsidian/95 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.8)] z-50 p-5 transform origin-top-right transition-all max-h-[85vh] overflow-y-auto">
                
                {/* Language Switcher */}
                <div className="mb-5">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-neon-green" />
                    {t('language')}
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      onClick={() => changeLanguage('en')}
                      className={cn(
                        "text-xs py-2 px-3 rounded-lg text-center transition-colors border",
                        i18n.language === 'en' 
                          ? "bg-neon-green/10 border-neon-green/30 text-neon-green" 
                          : "bg-white/5 border-transparent hover:bg-white/10 text-white/70"
                      )}
                    >
                      EN
                    </button>
                    <button 
                      onClick={() => changeLanguage('hi')}
                      className={cn(
                        "text-xs py-2 px-3 rounded-lg text-center transition-colors border",
                        i18n.language === 'hi' 
                          ? "bg-neon-green/10 border-neon-green/30 text-neon-green" 
                          : "bg-white/5 border-transparent hover:bg-white/10 text-white/70"
                      )}
                    >
                      हिंदी
                    </button>
                    <button 
                      onClick={() => changeLanguage('mr')}
                      className={cn(
                        "text-xs py-2 px-3 rounded-lg text-center transition-colors border",
                        i18n.language === 'mr' 
                          ? "bg-neon-green/10 border-neon-green/30 text-neon-green" 
                          : "bg-white/5 border-transparent hover:bg-white/10 text-white/70"
                      )}
                    >
                      मराठी
                    </button>
                  </div>
                </div>

                <div className="mb-5">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Type className="w-4 h-4 text-neon-green" />
                    {t('global_font_size')}
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
                    {t('visual_contrast')}
                  </h3>
                  <div className="flex flex-col gap-2">
                    {['standard_exp', 'high_contrast', 'protanopia', 'deuteranopia', 'tunnel_vision'].map((mode, index) => {
                      const modeKeys = ['standard', 'high-contrast', 'protanopia', 'deuteranopia', 'tunnel-vision'];
                      const currentMode = modeKeys[index];
                      return (
                        <button 
                          key={currentMode}
                          onClick={() => setContrastMode(currentMode)}
                          className={cn(
                            "text-xs py-2 px-3 rounded-lg text-left transition-colors border",
                            contrastMode === currentMode
                              ? "bg-neon-green/10 border-neon-green/30 text-neon-green" 
                              : "bg-white/5 border-transparent hover:bg-white/10 text-white/70"
                          )}
                        >
                          {t(mode)}
                        </button>
                      );
                    })}
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
              <p className="text-[10px] text-neon-green font-mono uppercase tracking-wider">{isCompany ? t('institutional') : t('premium')}</p>
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
```

---

## 5. Example Updated Component

Here is a generic example of how to update any existing component using the `useTranslation` hook.

```jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Briefcase, Send } from 'lucide-react';

export function ExampleComponent() {
  const { t } = useTranslation();

  return (
    <div className="p-6 bg-obsidian/40 border border-white/5 rounded-xl">
      <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
        <Briefcase className="w-5 h-5 text-neon-green" />
        {t('portfolio')}
      </h2>
      <p className="text-white/60 text-sm mb-6">
        {t('welcome')}
      </p>
      
      <div className="flex gap-4">
        <button className="flex-1 bg-neon-green text-obsidian font-bold py-2 rounded-lg hover:bg-neon-green/90 transition-colors">
          {t('analyze')}
        </button>
        <button className="flex items-center justify-center gap-2 flex-1 bg-white/10 text-white font-bold py-2 rounded-lg hover:bg-white/20 transition-colors">
          <Send className="w-4 h-4" />
          {t('send')}
        </button>
      </div>
    </div>
  );
}
```
