import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" },
});

export default function SlideSummary({ data, onClose }) {
  const navigate = useNavigate();

  function handleCTA() {
    onClose();
    // Navigate to user dashboard
    const stored = localStorage.getItem("clarity_user");
    const user = stored ? JSON.parse(stored) : null;
    const role = user?.role === "company" ? "company" : "user";
    navigate(`/${role}/dashboard`);
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 relative">
      {/* Stars / confetti feel */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-neon-green"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
            transition={{
              duration: 2 + Math.random() * 2,
              delay: Math.random() * 1.5,
              repeat: Infinity,
            }}
          />
        ))}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-96 h-96 rounded-full bg-neon-green/8 blur-[120px]" />
        </div>
      </div>

      <motion.p {...fadeUp(0.1)} className="text-xs font-mono tracking-[5px] text-white/40 uppercase mb-6">
        That's a Wrap!
      </motion.p>

      <motion.h2
        {...fadeUp(0.25)}
        className="text-4xl md:text-5xl font-black text-white leading-tight mb-4 max-w-xs"
      >
        Keep Growing Your{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#39ff14] to-[#00d4ff]">
          Portfolio
        </span>
      </motion.h2>

      <motion.p {...fadeUp(0.45)} className="text-sm text-white/40 max-w-sm leading-relaxed mb-10 italic">
        "{data.finalMessage}"
      </motion.p>

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.65 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleCTA}
        className="px-10 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest text-black"
        style={{
          background: "linear-gradient(135deg, #39ff14, #00d4ff)",
          boxShadow: "0 0 30px rgba(57,255,20,0.4)",
        }}
      >
        {data.ctaLabel} →
      </motion.button>

      <motion.button
        {...fadeUp(0.85)}
        onClick={onClose}
        className="mt-4 text-xs text-white/25 hover:text-white/50 transition-colors"
      >
        Close
      </motion.button>
    </div>
  );
}
