import React from "react";
import { motion } from "framer-motion";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" },
});

const RISK_LEVELS = [
  { label: "Conservative", color: "#38bdf8" },
  { label: "Moderate",     color: "#39ff14" },
  { label: "Aggressive",   color: "#f43f5e" },
];

export default function SlideRisk({ data }) {
  const activeIdx = RISK_LEVELS.findIndex(r => r.label === data.riskProfile);
  const activeColor = RISK_LEVELS[activeIdx]?.color ?? "#39ff14";

  // Arc fill percentage (0–100 maps to 0–180 deg sweep)
  const arcPct = data.riskScore; // 0-100

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 relative">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-80 h-80 rounded-full blur-[100px]" style={{ background: `${activeColor}15` }} />
      </div>

      <motion.p {...fadeUp(0.1)} className="text-xs font-mono tracking-[5px] text-white/40 uppercase mb-4">
        Risk Profile
      </motion.p>

      <motion.p {...fadeUp(0.25)} className="text-lg text-white/50 mb-6">
        You are a
      </motion.p>

      {/* Gauge */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.65, delay: 0.3 }}
        className="relative w-44 h-24 mb-4"
      >
        <svg viewBox="0 0 200 110" className="w-full h-full">
          {/* Track */}
          <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#ffffff10" strokeWidth="14" strokeLinecap="round" />
          {/* Fill */}
          <motion.path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={activeColor}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray="251"
            initial={{ strokeDashoffset: 251 }}
            animate={{ strokeDashoffset: 251 - (arcPct / 100) * 251 }}
            transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
            style={{ filter: `drop-shadow(0 0 8px ${activeColor})` }}
          />
        </svg>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
          <p className="text-2xl font-black" style={{ color: activeColor }}>{arcPct}</p>
          <p className="text-[9px] text-white/30 font-mono">Risk Score</p>
        </div>
      </motion.div>

      <motion.h2
        {...fadeUp(0.55)}
        className="text-4xl md:text-5xl font-black mb-3"
        style={{ color: activeColor }}
      >
        {data.riskProfile}
      </motion.h2>

      <motion.p {...fadeUp(0.7)} className="text-white/40 text-sm max-w-xs">
        {data.riskLabel}
      </motion.p>

      {/* Risk pills */}
      <motion.div {...fadeUp(0.85)} className="flex gap-2 mt-6">
        {RISK_LEVELS.map((r, i) => (
          <div
            key={r.label}
            className="px-3 py-1.5 rounded-full text-xs font-bold border transition-all"
            style={{
              borderColor: i === activeIdx ? r.color : "rgba(255,255,255,0.1)",
              color: i === activeIdx ? r.color : "rgba(255,255,255,0.3)",
              background: i === activeIdx ? `${r.color}18` : "transparent",
            }}
          >
            {r.label}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
