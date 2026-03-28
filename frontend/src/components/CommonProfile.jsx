import React from 'react';
import { motion } from 'motion/react';

export const GlobalProfileTheme = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700;800&display=swap');
    
    .fintech-wrapper {
      font-family: 'Inter', sans-serif;
      background-color: #0B0F0C;
      color: #E8F5E9;
      min-height: 100vh;
      border-radius: 2rem;
      padding: 2.5rem;
      box-shadow: inset 0 0 100px rgba(0,0,0,0.5);
    }
    
    .fintech-wrapper h1, .fintech-wrapper h2, .fintech-wrapper h3, .fintech-wrapper h4, .fintech-heading {
      font-family: 'Poppins', sans-serif;
      color: #E8F5E9;
    }
    
    /* Smooth Scrollbar for internal overflow if any */
    .fintech-wrapper ::-webkit-scrollbar {
      width: 6px;
    }
    .fintech-wrapper ::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.02);
    }
    .fintech-wrapper ::-webkit-scrollbar-thumb {
      background: rgba(142, 255, 113, 0.2);
      border-radius: 10px;
    }
    .fintech-wrapper ::-webkit-scrollbar-thumb:hover {
      background: rgba(142, 255, 113, 0.4);
    }
  `}</style>
);

export const Badge = ({ children, className = "" }) => (
  <span className={`text-[#8EFF71] bg-[#8EFF71]/10 border border-[#8EFF71]/20 text-[10px] font-extrabold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full ${className}`}>
    {children}
  </span>
);

export const IconButton = ({ icon: Icon, active = false, onClick }) => (
  <button 
    onClick={onClick}
    className={`p-2 rounded-full transition-all duration-300 active:scale-90 ${
      active ? 'text-[#8EFF71] bg-[#8EFF71]/10 shadow-[0_0_15px_rgba(142,255,113,0.3)] border border-[#8EFF71]/30' : 'text-[#9FB8A7] hover:text-[#8EFF71] hover:bg-[#8EFF71]/5'
    }`}
  >
    <Icon size={20} className={active ? 'fill-[#8EFF71]/20' : ''} />
  </button>
);

export const Card = ({ children, className = "" }) => (
  <div className={`bg-[#FFFFFF]/[0.02] backdrop-blur-xl border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-[2rem] p-8 transition-all duration-300 hover:border-white/10 hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)] ${className}`}>
    {children}
  </div>
);

export const ProgressBar = ({ progress }) => (
  <div className="h-2 w-full bg-[#1A231C] rounded-full overflow-hidden border border-[#2A3B2E]">
    <motion.div 
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="h-full bg-[#8EFF71] shadow-[0_0_15px_rgba(142,255,113,0.6)]"
    />
  </div>
);

export const Toggle = ({ active, onToggle }) => (
  <div 
    onClick={onToggle}
    className={`w-11 h-6 rounded-full relative p-1 cursor-pointer transition-all duration-300 border ${
      active ? 'bg-[#8EFF71]/20 border-[#8EFF71]/40 shadow-[0_0_10px_rgba(142,255,113,0.2)]' : 'bg-[#1A231C] border-[#2A3B2E]'
    }`}
  >
    <motion.div 
      animate={{ x: active ? 20 : 0 }}
      className={`w-4 h-4 rounded-full transition-shadow duration-300 ${
        active ? 'bg-[#8EFF71] shadow-[0_0_12px_rgba(142,255,113,0.8)]' : 'bg-[#9FB8A7]'
      }`}
    />
  </div>
);
