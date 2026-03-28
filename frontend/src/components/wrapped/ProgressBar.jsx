import React from "react";
import { motion } from "framer-motion";

/**
 * Story-style segmented progress bar.
 * @param {number} total      – total number of slides
 * @param {number} current    – current slide index (0-based)
 * @param {number} duration   – ms each slide stays
 * @param {boolean} paused    – whether the timer is paused
 */
export default function ProgressBar({ total, current, duration, paused }) {
  return (
    <div className="flex gap-1.5 w-full px-4 pt-4 absolute top-0 left-0 right-0 z-50">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="h-0.5 flex-1 rounded-full overflow-hidden bg-white/20"
        >
          {i < current && (
            // Already seen → full
            <div className="h-full w-full bg-white/80" />
          )}
          {i === current && (
            // Currently active → animate fill
            <motion.div
              className="h-full bg-white/90 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: paused ? undefined : "100%" }}
              transition={{ duration: duration / 1000, ease: "linear" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
