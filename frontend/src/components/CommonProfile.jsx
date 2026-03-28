import React from 'react';
import { motion } from 'motion/react';

export const Badge = ({ children, className = "" }) => (
  <span className={`font-label text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full ${className}`}>
    {children}
  </span>
);

export const IconButton = ({ icon: Icon, active = false, onClick }) => (
  <button 
    onClick={onClick}
    className={`p-2 rounded-full transition-all duration-300 active:scale-90 ${
      active ? 'text-primary bg-primary/10 shadow-[0_0_15px_rgba(142,255,113,0.2)]' : 'text-on-surface-variant hover:text-primary'
    }`}
  >
    <Icon size={20} className={active ? 'fill-primary' : ''} />
  </button>
);

export const Card = ({ children, className = "" }) => (
  <div className={`glass-panel rounded-[2rem] p-8 ${className}`}>
    {children}
  </div>
);

export const ProgressBar = ({ progress }) => (
  <div className="h-2 w-full bg-outline-variant/10 rounded-full overflow-hidden">
    <motion.div 
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="h-full bg-primary neon-glow"
    />
  </div>
);

export const Toggle = ({ active, onToggle }) => (
  <div 
    onClick={onToggle}
    className={`w-10 h-5 rounded-full relative p-1 cursor-pointer transition-colors duration-300 ${active ? 'bg-primary/20' : 'bg-outline-variant/20'}`}
  >
    <motion.div 
      animate={{ x: active ? 20 : 0 }}
      className={`w-3 h-3 rounded-full shadow-lg ${active ? 'bg-primary shadow-[0_0_8px_rgba(142,255,113,0.5)]' : 'bg-on-surface-variant'}`}
    />
  </div>
);
