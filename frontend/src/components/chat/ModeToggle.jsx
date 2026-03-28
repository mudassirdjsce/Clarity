import React from "react";
import { cn } from "../../lib/utils";

const ModeToggle = ({ mode, setMode }) => {
  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
      <button
        onClick={() => setMode("beginner")}
        className={cn(
          "px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200",
          mode === "beginner"
            ? "bg-neon-green text-obsidian"
            : "text-white/40 hover:text-white"
        )}
      >
        Beginner
      </button>
      <button
        onClick={() => setMode("pro")}
        className={cn(
          "px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200",
          mode === "pro"
            ? "bg-neon-green text-obsidian"
            : "text-white/40 hover:text-white"
        )}
      >
        Pro
      </button>
    </div>
  );
};

export default ModeToggle;
