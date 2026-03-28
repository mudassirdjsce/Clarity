import React, { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

import ProgressBar from "./ProgressBar";
import { wrappedData } from "./WrappedData";

import SlideIntro     from "./slides/SlideIntro";
import SlidePortfolio from "./slides/SlidePortfolio";
import SlideSector    from "./slides/SlideSector";
import SlideRisk      from "./slides/SlideRisk";
import SlideAsset     from "./slides/SlideAsset";
import SlideBehavior  from "./slides/SlideBehavior";
import SlideInsight   from "./slides/SlideInsight";
import SlideSummary   from "./slides/SlideSummary";

const SLIDE_DURATION = 5000; // ms each slide auto-advances

const SLIDES = [
  (props) => <SlideIntro     {...props} />,
  (props) => <SlidePortfolio {...props} />,
  (props) => <SlideSector    {...props} />,
  (props) => <SlideRisk      {...props} />,
  (props) => <SlideAsset     {...props} />,
  (props) => <SlideBehavior  {...props} />,
  (props) => <SlideInsight   {...props} />,
  (props) => <SlideSummary   {...props} />,
];

const TOTAL = SLIDES.length;

export default function WrappedContainer({ onClose }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused]   = useState(false);
  const [direction, setDir]   = useState(1); // 1 = forward, -1 = back
  const timerRef = useRef(null);

  // ── Auto-play ──────────────────────────────────────────────────────────────
  const resetTimer = useCallback(() => {
    clearTimeout(timerRef.current);
    if (paused) return;
    timerRef.current = setTimeout(() => {
      setCurrent(prev => {
        if (prev >= TOTAL - 1) return prev; // stop at last
        setDir(1);
        return prev + 1;
      });
    }, SLIDE_DURATION);
  }, [paused]);

  useEffect(() => {
    resetTimer();
    return () => clearTimeout(timerRef.current);
  }, [current, paused, resetTimer]);

  // ── Navigation ─────────────────────────────────────────────────────────────
  function goNext() {
    if (current >= TOTAL - 1) return;
    setDir(1);
    setCurrent(c => c + 1);
  }
  function goPrev() {
    if (current <= 0) return;
    setDir(-1);
    setCurrent(c => c - 1);
  }

  // ── Keyboard ───────────────────────────────────────────────────────────────
  useEffect(() => {
    function onKey(e) {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft")  goPrev();
      if (e.key === "Escape")     onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current]);

  const slideVariants = {
    enter:  (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60, scale: 0.97 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit:   (dir) => ({ opacity: 0, x: dir > 0 ? -60 : 60, scale: 0.97 }),
  };

  const CurrentSlide = SLIDES[current];

  return (
    // Full-screen fixed overlay
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Blurred dark backdrop */}
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" />

      {/* Card container */}
      <div
        className="relative w-full max-w-md h-[85vh] max-h-[760px] mx-4 rounded-3xl overflow-hidden flex flex-col"
        style={{
          background: "linear-gradient(145deg, #0a0a0a 0%, #0d0d0d 100%)",
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 40px 120px rgba(0,0,0,0.8), 0 0 80px rgba(57,255,20,0.06)",
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Progress bar */}
        <ProgressBar total={TOTAL} current={current} duration={SLIDE_DURATION} paused={paused} />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-8 right-4 z-50 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/40 hover:text-white/80 transition-all text-sm"
        >
          ✕
        </button>

        {/* Slide area */}
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={current}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.38, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <CurrentSlide data={wrappedData} onClose={onClose} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Invisible tap zones ─────────────────────────────────────── */}
        <div className="absolute inset-y-12 left-0 w-1/3 cursor-pointer z-40" onClick={goPrev} />
        <div className="absolute inset-y-12 right-0 w-2/3 cursor-pointer z-40" onClick={goNext} />

        {/* Slide counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-mono text-white/20 z-50">
          {current + 1} / {TOTAL}
        </div>
      </div>

      {/* Outside click to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  );
}
