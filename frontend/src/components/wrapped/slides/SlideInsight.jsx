import React from "react";
import { motion } from "framer-motion";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" },
});

export default function SlideInsight({ data }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 relative">
      {/* Animated gradient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-sky-400/10 blur-[80px]"
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-56 h-56 rounded-full bg-neon-green/8 blur-[80px]"
        />
      </div>

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-14 h-14 rounded-2xl mb-6 flex items-center justify-center text-2xl"
        style={{ background: "rgba(57,255,20,0.1)", border: "1px solid rgba(57,255,20,0.25)" }}
      >
        ✦
      </motion.div>

      <motion.p {...fadeUp(0.2)} className="text-xs font-mono tracking-[5px] text-white/40 uppercase mb-4">
        AI Insight
      </motion.p>

      <motion.blockquote
        {...fadeUp(0.35)}
        className="text-xl md:text-2xl font-semibold text-white/90 leading-relaxed max-w-md mb-8"
        style={{ fontStyle: "italic" }}
      >
        "{data.aiInsight}"
      </motion.blockquote>

      <motion.div
        {...fadeUp(0.65)}
        className="px-4 py-2 rounded-full text-xs font-bold font-mono"
        style={{
          background: "rgba(57,255,20,0.08)",
          border: "1px solid rgba(57,255,20,0.25)",
          color: "#39ff14",
        }}
      >
        CLARITY AI · {data.year}
      </motion.div>
    </div>
  );
}
