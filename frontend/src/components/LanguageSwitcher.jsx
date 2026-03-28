import React from 'react';
import { useTranslation } from 'react-i18next';

const LANGS = [
  { code: 'en',  label: 'EN' },
  { code: 'hi',  label: 'हि' },
  { code: 'mr',  label: 'म' },
];

/**
 * Compact 3-pill language switcher.
 * Used on LandingPage, Login, Signup (no TopAppBar available on those routes).
 *
 * @param {'light'|'dark'} variant  - 'dark' (default) for neon-on-black, 'light' for dark-on-light
 */
export function LanguageSwitcher({ variant = 'dark' }) {
  const { i18n } = useTranslation();
  const activeLang = i18n.language?.split('-')[0] || 'en';

  return (
    <div
      style={{
        display: 'flex',
        gap: 4,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: 10,
        padding: '3px 4px',
      }}
    >
      {LANGS.map(({ code, label }) => {
        const isActive = activeLang === code;
        return (
          <button
            key={code}
            onClick={() => i18n.changeLanguage(code)}
            style={{
              padding: '4px 10px',
              borderRadius: 7,
              border: isActive ? '1px solid rgba(57,255,20,0.45)' : '1px solid transparent',
              background: isActive ? 'rgba(57,255,20,0.12)' : 'transparent',
              color: isActive ? '#39ff14' : 'rgba(255,255,255,0.45)',
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.18s',
              fontFamily: 'inherit',
              letterSpacing: 0.3,
              lineHeight: 1,
              boxShadow: isActive ? '0 0 8px rgba(57,255,20,0.18)' : 'none',
            }}
            onMouseEnter={e => {
              if (!isActive) {
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
              }
            }}
            onMouseLeave={e => {
              if (!isActive) {
                e.currentTarget.style.color = 'rgba(255,255,255,0.45)';
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
