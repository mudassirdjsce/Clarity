import React from "react";
import { motion } from "framer-motion";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" },
});

export default function SlideSector({ data }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 relative">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-72 h-72 rounded-full bg-neon-green/8 blur-[100px]" />
      </div>

      <motion.p {...fadeUp(0.1)} className="text-xs font-mono tracking-[5px] text-white/40 uppercase mb-4">
        Top Sector
      </motion.p>

      <motion.p {...fadeUp(0.25)} className="text-lg text-white/50 mb-2">
        You invested the most in
      </motion.p>

      <motion.h2
        {...fadeUp(0.4)}
        className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#39ff14] to-[#00d4ff] mb-8"
      >
        {data.topSectorShort}
      </motion.h2>

      {/* Bar breakdown */}
      <div className="w-full max-w-sm space-y-3">
        {data.sectorBreakdown.map((s, i) => (
          <motion.div
            key={s.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
            className="flex items-center gap-3"
          >
            <span className="text-xs text-white/50 w-20 text-right font-mono">{s.name}</span>
            <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: s.color }}
                initial={{ width: 0 }}
                animate={{ width: `${s.pct}%` }}
                transition={{ duration: 0.8, delay: 0.6 + i * 0.1, ease: "easeOut" }}
              />
            </div>
            <span className="text-xs font-bold font-mono w-8 text-left" style={{ color: s.color }}>
              {s.pct}%
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
