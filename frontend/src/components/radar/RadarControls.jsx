import React from "react";
import { CHART_META } from "./radarData";

/**
 * RadarControls — Right-side toggle panel (30% width on desktop)
 * Each button activates/deactivates its radar dataset.
 */
export default function RadarControls({ activeCharts, onToggle }) {
  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="mb-2">
        <p className="text-[10px] font-mono text-white/30 uppercase tracking-[3px] mb-1">
          Asset Classes
        </p>
        <p className="text-xs text-white/40">
          Toggle assets to overlay on the radar.
        </p>
      </div>

      {CHART_META.map((meta) => {
        const isActive = activeCharts.includes(meta.name);
        return (
          <button
            key={meta.name}
            onClick={() => onToggle(meta.name)}
            style={{
              borderColor: isActive ? meta.color : "rgba(255,255,255,0.08)",
              backgroundColor: isActive
                ? `${meta.color}1a`
                : "rgba(255,255,255,0.02)",
              boxShadow: isActive ? `0 0 18px ${meta.color}30` : "none",
            }}
            className="relative w-full text-left px-4 py-3.5 rounded-xl border transition-all duration-300 
                       active:scale-95 hover:border-white/20 group overflow-hidden"
          >
            {/* Active glow strip on left edge */}
            {isActive && (
              <div
                className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl transition-all"
                style={{ backgroundColor: meta.color }}
              />
            )}

            <div className="flex items-center gap-3 pl-1">
              {/* Color dot / indicator */}
              <div
                className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center transition-all duration-300"
                style={{
                  backgroundColor: isActive
                    ? `${meta.color}22`
                    : "rgba(255,255,255,0.05)",
                  border: `1px solid ${isActive ? meta.color + "44" : "rgba(255,255,255,0.08)"}`,
                  color: isActive ? meta.color : "rgba(255,255,255,0.35)",
                  fontFamily: "monospace",
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: 0,
                }}
              >
                {meta.icon}
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-bold truncate transition-colors duration-200"
                  style={{ color: isActive ? meta.color : "rgba(255,255,255,0.7)" }}
                >
                  {meta.name}
                </p>
                <p className="text-[10px] text-white/30 truncate mt-0.5">
                  {meta.description}
                </p>
              </div>

              {/* ON/OFF badge */}
              <span
                className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full flex-shrink-0 transition-all duration-200"
                style={{
                  backgroundColor: isActive ? `${meta.color}25` : "rgba(255,255,255,0.04)",
                  color: isActive ? meta.color : "rgba(255,255,255,0.2)",
                  border: `1px solid ${isActive ? meta.color + "40" : "rgba(255,255,255,0.06)"}`,
                }}
              >
                {isActive ? "ON" : "OFF"}
              </span>
            </div>
          </button>
        );
      })}

      {/* Summary pill */}
      <div className="mt-2 px-4 py-2.5 rounded-xl bg-white/3 border border-white/5 flex items-center justify-between">
        <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
          Active Layers
        </span>
        <span className="text-sm font-mono font-bold text-white/70">
          {activeCharts.length} / {CHART_META.length}
        </span>
      </div>
    </div>
  );
}
