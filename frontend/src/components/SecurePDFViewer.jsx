import React, { useState, useRef, useCallback } from 'react';
import { X, ShieldCheck, Upload, AlertCircle, Loader2, FileText, Lock, User, Clock, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { decryptSecureFile } from '../lib/securePdf';

/**
 * SecurePDFViewer
 * Modal component that lets users upload a .secure file,
 * decrypt it client-side, and view the PDF inside an iframe.
 *
 * Props:
 *  - isOpen  : boolean
 *  - onClose : () => void
 */
export default function SecurePDFViewer({ isOpen, onClose }) {
  const fileInputRef  = useRef(null);
  const pdfUrlRef     = useRef(null);

  const [stage,       setStage]       = useState('upload');   // 'upload' | 'loading' | 'viewing' | 'error'
  const [error,       setError]       = useState(null);
  const [pdfUrl,      setPdfUrl]      = useState(null);
  const [meta,        setMeta]        = useState(null);
  const [fileName,    setFileName]    = useState('');
  const [dragging,    setDragging]    = useState(false);

  // ── Reset on close ────────────────────────────────────────────────────────
  const handleClose = useCallback(() => {
    // Revoke the object URL to avoid memory leaks
    if (pdfUrlRef.current) {
      URL.revokeObjectURL(pdfUrlRef.current);
      pdfUrlRef.current = null;
    }
    setPdfUrl(null);
    setMeta(null);
    setError(null);
    setStage('upload');
    setFileName('');
    onClose();
  }, [onClose]);

  // ── Process File ──────────────────────────────────────────────────────────
  const processFile = useCallback((file) => {
    if (!file) return;

    // Only accept .secure files
    if (!file.name.endsWith('.secure')) {
      setError('Please upload a valid .secure file exported from Clarity.');
      setStage('error');
      return;
    }

    setFileName(file.name);
    setStage('loading');
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const { blob, meta: fileMeta } = decryptSecureFile(e.target.result);

        // Create an object URL for the iframe
        if (pdfUrlRef.current) URL.revokeObjectURL(pdfUrlRef.current);
        const url = URL.createObjectURL(blob);
        pdfUrlRef.current = url;

        setPdfUrl(url);
        setMeta(fileMeta);
        setStage('viewing');
      } catch (err) {
        setError(err.message);
        setStage('error');
      }
    };
    reader.onerror = () => {
      setError('Failed to read the file. Please try again.');
      setStage('error');
    };
    reader.readAsText(file);
  }, []);

  // ── Event handlers ────────────────────────────────────────────────────────
  const handleFileChange = (e) => processFile(e.target.files?.[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    processFile(e.dataTransfer.files?.[0]);
  };

  const handleRetry = () => {
    setStage('upload');
    setError(null);
    setFileName('');
  };

  // Lock body scroll
  React.useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else         document.body.style.overflow = '';
    return ()   => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="spv-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md"
          />

          {/* ── Modal ── */}
          <motion.div
            key="spv-modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 z-[210] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className={`pointer-events-auto w-full bg-[#0b0f0b] border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.7)] flex flex-col transition-all duration-300 ${
                stage === 'viewing' ? 'max-w-4xl max-h-[92vh]' : 'max-w-lg'
              }`}
            >

              {/* ── Header ── */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#39ff14]/10 border border-[#39ff14]/20 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-[#39ff14]" />
                  </div>
                  <div>
                    <h2 className="text-sm font-display font-bold text-[#E8F5E9]">Secure PDF Viewer</h2>
                    <p className="text-[10px] text-[#9FB8A7] font-mono uppercase tracking-wider">
                      {stage === 'viewing' ? `Viewing: ${fileName}` : 'AES-256 Encrypted · Clarity Only'}
                    </p>
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
              <div className="flex-1 overflow-hidden flex flex-col min-h-0">

                {/* UPLOAD STAGE */}
                {stage === 'upload' && (
                  <div className="p-6 flex flex-col gap-5">
                    {/* Drop zone */}
                    <div
                      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                      onDragLeave={() => setDragging(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`flex flex-col items-center justify-center gap-4 py-12 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
                        dragging
                          ? 'border-[#39ff14]/60 bg-[#39ff14]/5 scale-[1.01]'
                          : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]'
                      }`}
                    >
                      <div className="w-14 h-14 rounded-2xl bg-[#39ff14]/10 border border-[#39ff14]/20 flex items-center justify-center">
                        <Lock className="w-6 h-6 text-[#39ff14]" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-white">Drop your .secure file here</p>
                        <p className="text-xs text-white/30 mt-1">or click to browse</p>
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-[#39ff14]/50 bg-[#39ff14]/5 border border-[#39ff14]/20 px-3 py-1 rounded-full">
                        .secure files only
                      </span>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".secure"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {/* Info pills */}
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { icon: Lock,       label: 'AES-256', sub: 'Encryption' },
                        { icon: ShieldCheck, label: 'MD5',    sub: 'Checksum'   },
                        { icon: FileText,   label: 'Local',   sub: 'Processing' },
                      ].map(({ icon: Icon, label, sub }) => (
                        <div key={label} className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-white/3 border border-white/5">
                          <Icon className="w-4 h-4 text-[#39ff14]/70" />
                          <p className="text-[10px] font-bold text-white/60">{label}</p>
                          <p className="text-[9px] text-white/20 uppercase tracking-widest">{sub}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* LOADING STAGE */}
                {stage === 'loading' && (
                  <div className="flex flex-col items-center justify-center gap-4 py-16 px-6">
                    <Loader2 className="w-10 h-10 text-[#39ff14] animate-spin" />
                    <p className="text-sm font-semibold text-white">Decrypting document…</p>
                    <p className="text-xs text-white/30 font-mono">Verifying checksum &amp; integrity</p>
                  </div>
                )}

                {/* ERROR STAGE */}
                {stage === 'error' && (
                  <div className="flex flex-col items-center justify-center gap-5 py-12 px-6 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-red-400 mb-1">Decryption Failed</p>
                      <p className="text-xs text-white/40 leading-relaxed">{error}</p>
                    </div>
                    <button
                      onClick={handleRetry}
                      className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white/60 hover:text-white hover:border-white/20 transition-colors uppercase tracking-wider"
                    >
                      Try Again
                    </button>
                  </div>
                )}

                {/* VIEWING STAGE */}
                {stage === 'viewing' && (
                  <div className="flex flex-col flex-1 min-h-0">
                    {/* Metadata bar */}
                    {meta && (
                      <div className="flex items-center gap-4 px-6 py-3 border-b border-white/5 flex-shrink-0 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#39ff14] animate-pulse" />
                          <span className="text-[9px] font-bold uppercase tracking-widest text-[#39ff14]/70">Decrypted &amp; Verified</span>
                        </div>
                        {meta.userName && (
                          <div className="flex items-center gap-1 text-[10px] text-white/30">
                            <User className="w-3 h-3" />
                            {meta.userName}
                          </div>
                        )}
                        {meta.created && (
                          <div className="flex items-center gap-1 text-[10px] text-white/30">
                            <Calendar className="w-3 h-3" />
                            {new Date(meta.created).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </div>
                        )}
                        {meta.expiresAt && (
                          <div className="flex items-center gap-1 text-[10px] text-orange-400/70">
                            <Clock className="w-3 h-3" />
                            Expires {new Date(meta.expiresAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    )}

                    {/* PDF iframe — right-click & download deliberately not blocked at HTML level
                        because the Blob URL is ephemeral and meaningless outside this session */}
                    <div className="flex-1 min-h-0 p-4">
                      <iframe
                        src={pdfUrl}
                        title="Secure PDF Document"
                        className="w-full h-full rounded-xl border border-white/8 bg-white"
                        style={{ minHeight: '500px' }}
                      />
                    </div>

                    {/* Warning footer */}
                    <div className="px-6 py-3 border-t border-white/5 flex-shrink-0">
                      <p className="text-[9px] text-white/15 text-center font-mono uppercase tracking-widest">
                        This document is decrypted in-memory only · Blob URL is session-scoped · Cannot be re-used outside Clarity
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
