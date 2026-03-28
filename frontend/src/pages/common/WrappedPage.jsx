import React, { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import WrappedContainer from "../../components/wrapped/WrappedContainer";
import { useTranslation } from "react-i18next";

/**
 * WrappedPage — standalone page that shows the trigger button.
 * Route: /user/wrapped  or  /company/wrapped
 *
 * You can also import <WrappedTriggerButton /> from this file and drop it
 * anywhere in the dashboard to open the Wrapped overlay inline.
 */
export function WrappedTriggerButton() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen(true)}
        className="relative overflow-hidden px-6 py-3 rounded-2xl font-bold text-sm text-black uppercase tracking-widest"
        style={{
          background: "linear-gradient(135deg, #39ff14, #00d4ff)",
          boxShadow: "0 0 24px rgba(57,255,20,0.35)",
        }}
      >
        <span className="relative z-10">{t('view_wrapped_btn')}</span>
        <motion.div
          className="absolute inset-0 bg-white/20"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
        />
      </motion.button>

      {/* Portal — renders on document.body so fixed positioning is never clipped */}
      {open && createPortal(
        <AnimatePresence>
          <motion.div
            key="wrapped-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <WrappedContainer onClose={() => setOpen(false)} />
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

// Full standalone page
export default function WrappedPage() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center px-4">
      <p className="text-xs font-mono tracking-[5px] text-white/30 uppercase">{t('wrapped_page_eyebrow', { year: new Date().getFullYear() })}</p>
      <h1 className="text-4xl font-black text-white">{t('wrapped_page_heading')}</h1>
      <p className="text-white/40 text-sm max-w-sm">
        {t('wrapped_page_sub')}
      </p>
      <WrappedTriggerButton />

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <WrappedContainer onClose={() => setOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
