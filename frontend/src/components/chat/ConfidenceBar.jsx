import React from "react";
import { cn } from "../../lib/utils";

const SCORE_COLOR = (score) => {
  if (score >= 75) return "bg-neon-green";
  if (score >= 50) return "bg-amber-400";
  return "bg-red-400";
};

const ConfidenceBar = ({ score = 0 }) => {
  const clamped = Math.min(100, Math.max(0, score));
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Confidence</span>
        <span className={cn("text-[10px] font-bold font-mono", clamped >= 75 ? "text-neon-green" : clamped >= 50 ? "text-amber-400" : "text-red-400")}>
          {clamped}%
        </span>
      </div>
      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-700 ease-out", SCORE_COLOR(clamped))}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};

export default ConfidenceBar;
