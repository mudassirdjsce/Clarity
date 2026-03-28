import React from "react";
import { motion } from "framer-motion";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: "easeOut" },
});

export default function SlideIntro({ data }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 relative">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 rounded-full bg-neon-green/10 blur-[120px]" />
      </div>

      <motion.p
        {...fadeUp(0.1)}
        className="text-xs font-mono tracking-[6px] text-white/40 uppercase mb-6"
      >
        Your Annual Review
      </motion.p>

      <motion.h1
        {...fadeUp(0.3)}
        className="text-5xl md:text-7xl font-black leading-none tracking-tight mb-4"
      >
        Financial{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#39ff14] to-[#00d4ff]">
          Wrapped
        </span>
      </motion.h1>

      <motion.p
        {...fadeUp(0.55)}
        className="text-2xl md:text-3xl font-bold text-white/60 mb-8"
      >
        {data.year}
      </motion.p>

      <motion.p
        {...fadeUp(0.75)}
        className="text-sm text-white/30 max-w-xs leading-relaxed"
      >
        Your year in numbers. Tap or click to begin your story.
      </motion.p>

      {/* Pulse dot */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [1, 1.3, 1], opacity: 1 }}
        transition={{ delay: 1.2, duration: 1.5, repeat: Infinity }}
        className="mt-12 w-3 h-3 rounded-full bg-neon-green shadow-[0_0_20px_#39ff14]"
      />
    </div>
  );
}
