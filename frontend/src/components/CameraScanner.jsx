import React, { useEffect } from 'react';
import { X, Camera, ScanLine, AlertCircle, Loader2, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import useObjectDetection from '../hooks/useObjectDetection';

/**
 * CameraScanner
 * A full-screen glassmorphism modal that:
 *  1. Opens the webcam
 *  2. Runs COCO-SSD object detection every 400ms
 *  3. Shows detected label + confidence
 *  4. On "Scan" click → redirects to BuyHatke search
 *
 * Props:
 *  - isOpen  : boolean
 *  - onClose : () => void
 */
export default function CameraScanner({ isOpen, onClose }) {
  const {
    videoRef,
    detectedObject,
    confidence,
    topPredictions,
    loading,
    error,
    isActive,
    startDetection,
    stopDetection,
  } = useObjectDetection();

  // Start camera when modal opens, stop when it closes
  useEffect(() => {
    if (isOpen) {
      startDetection();
    } else {
      stopDetection();
    }
  }, [isOpen]);

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else         document.body.style.overflow = '';
    return ()   => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleClose = () => {
    stopDetection();
    onClose();
  };

  const handleScan = () => {
    if (!detectedObject) return;
    // Vibration feedback on mobile
    if (navigator.vibrate) navigator.vibrate([50, 30, 80]);
    stopDetection();
    onClose();
    window.open(`https://buyhatke.com/search?product=${encodeURIComponent(detectedObject)}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-200 bg-black/80 backdrop-blur-md"
          />

          {/* ── Modal ── */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 z-210 flex flex-col items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-lg bg-obsidian-soft border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.7)] flex flex-col max-h-[90vh]">

              {/* ── Header ── */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#39ff14]/10 border border-[#39ff14]/20 flex items-center justify-center">
                    <Camera className="w-4 h-4 text-[#39ff14]" />
                  </div>
                  <div>
                    <h2 className="text-sm font-display font-bold text-[#E8F5E9]">Scan Product</h2>
                    <p className="text-[10px] text-[#9FB8A7] font-mono uppercase tracking-wider">Powered by TensorFlow COCO-SSD</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* ── Body ── */}
              <div className="flex-1 overflow-y-auto flex flex-col">

                {/* ── Detected Object Banner ── */}
                <div className="px-6 pt-5 pb-3 shrink-0">
                  {detectedObject ? (
                    <div className="bg-[#39ff14]/10 border border-[#39ff14]/20 rounded-2xl px-5 py-3 flex items-center justify-between shadow-[0_0_20px_rgba(57,255,20,0.08)]">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#39ff14] animate-pulse shadow-[0_0_8px_rgba(57,255,20,0.8)]" />
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#39ff14]/70">Detected Object</p>
                          <p className="text-lg font-display font-extrabold text-[#39ff14] capitalize leading-tight">
                            {detectedObject}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-[#9FB8A7] uppercase tracking-widest">Confidence</p>
                        <p className="text-2xl font-mono font-bold text-[#39ff14]">{confidence}%</p>
                      </div>
                    </div>
                  ) : loading ? (
                    <div className="bg-white/3 border border-white/8 rounded-2xl px-5 py-3 flex items-center gap-3">
                      <Loader2 className="w-4 h-4 text-white/30 animate-spin" />
                      <p className="text-sm text-white/40 font-mono">Loading AI model…</p>
                    </div>
                  ) : error ? (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-5 py-3 flex items-start gap-3">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-red-400">{error}</p>
                    </div>
                  ) : (
                    <div className="bg-white/3 border border-white/8 rounded-2xl px-5 py-3">
                      <p className="text-sm text-white/30 text-center font-mono">Point camera at any object…</p>
                    </div>
                  )}
                </div>

                {/* ── Video Feed ── */}
                <div className="px-6 pb-4 shrink-0">
                  <div className="relative rounded-2xl overflow-hidden bg-black border border-white/8 aspect-4/3">
                    {/* Video element — always rendered so the ref is attached */}
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />

                    {/* Scanning overlay — animated border when active */}
                    {isActive && !error && (
                      <div className="absolute inset-0 pointer-events-none">
                        {/* Corner brackets */}
                        <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-[#39ff14]/60 rounded-tl-lg" />
                        <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-[#39ff14]/60 rounded-tr-lg" />
                        <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-[#39ff14]/60 rounded-bl-lg" />
                        <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-[#39ff14]/60 rounded-br-lg" />
                        {/* Animated scan line */}
                        <motion.div
                          className="absolute left-4 right-4 h-px bg-linear-to-r from-transparent via-[#39ff14]/60 to-transparent"
                          animate={{ top: ['20%', '80%', '20%'] }}
                          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                        />
                      </div>
                    )}

                    {/* Loading overlay */}
                    {loading && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60">
                        <Loader2 className="w-8 h-8 text-[#39ff14] animate-spin" />
                        <p className="text-[10px] font-mono text-[#39ff14]/60 uppercase tracking-widest">Initialising model…</p>
                      </div>
                    )}

                    {/* Error overlay */}
                    {error && !loading && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80 px-6 text-center">
                        <AlertCircle className="w-10 h-10 text-red-400" />
                        <p className="text-sm text-red-400">{error}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Multi-label secondary predictions ── */}
                {topPredictions.length > 1 && (
                  <div className="px-6 pb-4 shrink-0">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-white/20 mb-2">Also detected</p>
                    <div className="flex gap-2 flex-wrap">
                      {topPredictions.slice(1).map((p, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-white/40 capitalize"
                        >
                          {p.class} · {Math.round(p.score * 100)}%
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ── Footer / Action Buttons ── */}
              <div className="px-6 py-5 border-t border-white/5 shrink-0 flex gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 py-3.5 rounded-2xl border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-white hover:border-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleScan}
                  disabled={!detectedObject}
                  className={`flex-1 py-3.5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all
                    ${detectedObject
                      ? 'bg-[#39ff14] text-[#0B0F0C] shadow-[0_0_25px_rgba(57,255,20,0.4)] hover:shadow-[0_0_35px_rgba(57,255,20,0.6)] active:scale-95'
                      : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/10'
                    }`}
                >
                  <ScanLine className="w-4 h-4" />
                  {detectedObject ? `Search "${detectedObject}" on BuyHatke` : 'Scan Object First'}
                </button>
              </div>

              {/* ── Disclaimer ── */}
              <div className="px-6 pb-4 shrink-0">
                <p className="text-[9px] text-white/15 text-center font-mono">
                  Camera feed is processed locally · No data is sent to any server
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
