import React from "react";
import { motion } from "framer-motion";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" },
});

export default function SlidePortfolio({ data }) {
  const isPositive = data.growth.startsWith("+");
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 relative">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-80 h-80 rounded-full bg-sky-500/10 blur-[100px]" />
      </div>

      <motion.p {...fadeUp(0.1)} className="text-xs font-mono tracking-[5px] text-white/40 uppercase mb-4">
        Portfolio Overview
      </motion.p>

      <motion.p {...fadeUp(0.25)} className="text-lg text-white/50 mb-2">
        You invested a total of
      </motion.p>

      <motion.h2 {...fadeUp(0.4)} className="text-5xl md:text-6xl font-black text-white mb-3 tracking-tight">
        {data.totalInvestment}
      </motion.h2>

      <motion.div
        {...fadeUp(0.55)}
        className="flex flex-col items-center gap-1 mb-8"
      >
        <p className="text-white/40 text-sm">Portfolio value today</p>
        <p className="text-2xl font-bold text-white">{data.portfolioValue}</p>
      </motion.div>

      <motion.div
        {...fadeUp(0.7)}
        className="px-8 py-4 rounded-2xl border"
        style={{
          background: isPositive ? "rgba(57,255,20,0.08)" : "rgba(255,68,68,0.08)",
          borderColor: isPositive ? "rgba(57,255,20,0.3)" : "rgba(255,68,68,0.3)",
        }}
      >
        <p className="text-5xl font-black" style={{ color: isPositive ? "#39ff14" : "#ff4444" }}>
          {data.growth}
        </p>
        <p className="text-sm text-white/40 mt-1">Total return this year</p>
      </motion.div>

      <motion.p {...fadeUp(0.85)} className="mt-6 text-white/30 text-sm">
        That's {data.growthAmount} earned this year 🎉
      </motion.p>
    </div>
  );
}
