import React from "react";
import { motion } from "framer-motion";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" },
});

export default function SlideAsset({ data }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 relative">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-80 h-80 rounded-full bg-orange-400/10 blur-[100px]" />
      </div>

      <motion.p {...fadeUp(0.1)} className="text-xs font-mono tracking-[5px] text-white/40 uppercase mb-6">
        Most Active Asset
      </motion.p>

      <motion.p {...fadeUp(0.25)} className="text-lg text-white/50 mb-3">
        Your most analyzed stock this year
      </motion.p>

      {/* Big stock badge */}
      <motion.div
        initial={{ scale: 0.4, opacity: 0, rotate: -8 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ duration: 0.7, delay: 0.35, type: "spring", stiffness: 200 }}
        className="relative mb-6"
      >
        <div
          className="w-40 h-40 rounded-3xl flex items-center justify-center border-2"
          style={{
            background: "rgba(247,147,26,0.12)",
            borderColor: "rgba(247,147,26,0.4)",
            boxShadow: "0 0 60px rgba(247,147,26,0.2)",
          }}
        >
          <span className="text-5xl font-black font-mono text-orange-400">
            {data.topStock}
          </span>
        </div>
        {/* Glow ring */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-3xl border-2 border-orange-400/30"
        />
      </motion.div>

      <motion.h3 {...fadeUp(0.55)} className="text-2xl font-bold text-white mb-1">
        {data.topStockFull}
      </motion.h3>

      <motion.div {...fadeUp(0.65)} className="flex gap-6 mt-6">
        <div className="text-center">
          <p className="text-3xl font-black text-orange-400">{data.timesChecked}</p>
          <p className="text-xs text-white/40 mt-1">Times Checked</p>
        </div>
        <div className="w-px bg-white/10" />
        <div className="text-center">
          <p className="text-3xl font-black text-neon-green">{data.stockGrowth}</p>
          <p className="text-xs text-white/40 mt-1">YTD Return</p>
        </div>
      </motion.div>
    </div>
  );
}
