import React, { useState } from "react";
import { Layers } from "lucide-react";
import RadarChartDisplay from "./RadarChartDisplay";
import RadarControls from "./RadarControls";

/**
 * RadarSection — Parent orchestrator for the Radar Comparison feature.
 * Sits below the Sankey diagram in the Company Dashboard.
 * UI-only, no backend calls.
 */
export default function RadarSection() {
  // Start with 2 active so the UI looks great on first render
  const [activeCharts, setActiveCharts] = useState([
    "Bitcoin",
    "Gold",
  ]);

  function toggleChart(name) {
    setActiveCharts((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  }

  return (
    <div className="bento-card overflow-hidden">
      {/* ── Section Header ── */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <Layers className="w-5 h-5 text-neon-green" />
            <h3 className="text-xl font-display font-bold">
              Asset Class Comparison
            </h3>
          </div>
          <p className="text-xs text-white/40 ml-8">
            Overlay asset profiles across key financial dimensions
          </p>
        </div>

        {/* Active count badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/3 border border-white/6">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: "#39ff14" }}
          />
          <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">
            {activeCharts.length} Layer{activeCharts.length !== 1 ? "s" : ""} Active
          </span>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        {/* LEFT — Chart (70%) */}
        <div
          className="flex-1 lg:w-[70%] min-h-[380px] rounded-xl border border-white/5 p-4"
          style={{ background: "rgba(255,255,255,0.015)" }}
        >
          <RadarChartDisplay activeCharts={activeCharts} />
        </div>

        {/* RIGHT — Controls (30%) */}
        <div className="lg:w-[30%] w-full flex-shrink-0">
          <RadarControls
            activeCharts={activeCharts}
            onToggle={toggleChart}
          />
        </div>
      </div>
    </div>
  );
}
