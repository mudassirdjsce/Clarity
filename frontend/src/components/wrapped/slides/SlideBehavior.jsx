import React from "react";
import { motion } from "framer-motion";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" },
});

export default function SlideBehavior({ data }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 relative">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-72 h-72 rounded-full bg-purple-500/10 blur-[100px]" />
      </div>

      <motion.p {...fadeUp(0.1)} className="text-xs font-mono tracking-[5px] text-white/40 uppercase mb-4">
        Behavior Insights
      </motion.p>

      <motion.h2 {...fadeUp(0.25)} className="text-3xl md:text-4xl font-black text-white mb-8">
        Here's what your{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          habits say
        </span>
      </motion.h2>

      <div className="space-y-4 w-full max-w-sm">
        {data.behaviors.map((b, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.4 + i * 0.18 }}
            className="flex items-start gap-3 p-4 rounded-2xl text-left"
            style={{
              background: "rgba(168,85,247,0.08)",
              border: "1px solid rgba(168,85,247,0.2)",
            }}
          >
            <span className="mt-0.5 text-purple-400 text-lg">◆</span>
            <p className="text-sm text-white/80 leading-relaxed">{b}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
