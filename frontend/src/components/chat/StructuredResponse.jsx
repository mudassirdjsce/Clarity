import React from "react";
import {
  TrendingUp, TrendingDown, Minus, AlertTriangle,
  Database, BarChart2, BookOpen, Lightbulb, GitCommit, CheckCircle
} from "lucide-react";
import ConfidenceBar from "./ConfidenceBar";
import { cn } from "../../lib/utils";

const RISK_STYLES = {
  High:   { text: "text-red-400",    bg: "bg-red-400/10",    border: "border-red-400/30"   },
  Medium: { text: "text-amber-400",  bg: "bg-amber-400/10",  border: "border-amber-400/30" },
  Low:    { text: "text-neon-green", bg: "bg-neon-green/10", border: "border-neon-green/30" },
};

const INSIGHT_ICON = (insight = "") => {
  const lower = insight.toLowerCase();
  if (lower.includes("bullish") || lower.includes("positive") || lower.includes("upside"))
    return <TrendingUp className="w-4 h-4 text-neon-green" />;
  if (lower.includes("bearish") || lower.includes("negative") || lower.includes("downside"))
    return <TrendingDown className="w-4 h-4 text-red-400" />;
  return <Minus className="w-4 h-4 text-amber-400" />;
};

const StructuredResponse = ({ data }) => {
  if (!data) return null;

  const risk  = RISK_STYLES[data.riskLevel] || RISK_STYLES.Medium;

  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 overflow-hidden text-sm divide-y divide-white/5">
      
      {/* ── Insight Banner ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white/5">
        {INSIGHT_ICON(data.insight)}
        <span className="font-semibold text-white/90 leading-snug">{data.insight}</span>
        <span className={cn("ml-auto px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border", risk.text, risk.bg, risk.border)}>
          {data.riskLevel} Risk
        </span>
      </div>

      {/* ── Warning ────────────────────────────────────────────────────────── */}
      {data.warning && (
        <div className="flex items-start gap-2 px-4 py-3 bg-amber-400/5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span className="text-amber-300/80 text-xs leading-relaxed">{data.warning}</span>
        </div>
      )}

      {/* ── Key Metrics ────────────────────────────────────────────────────── */}
      {data.keyMetrics && Object.keys(data.keyMetrics).length > 0 && (
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 mb-2">
            <BarChart2 className="w-3.5 h-3.5 text-white/40" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Key Metrics</span>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
            {Object.entries(data.keyMetrics).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-2">
                <span className="text-white/40 capitalize text-xs">{k.replace(/([A-Z])/g, " $1").trim()}</span>
                <span className="font-mono text-xs text-white/70">{String(v)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Explanation ────────────────────────────────────────────────────── */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 mb-1.5">
          <BookOpen className="w-3.5 h-3.5 text-white/40" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Explanation</span>
        </div>
        <p className="text-white/70 leading-relaxed text-xs">{data.explanation}</p>
      </div>

      {/* ── Reasoning ──────────────────────────────────────────────────────── */}
      {data.reasoning && data.reasoning.length > 0 && (
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 mb-2">
            <GitCommit className="w-3.5 h-3.5 text-white/40" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Decision Logic</span>
          </div>
          <ul className="space-y-1.5">
            {data.reasoning.map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-white/60">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-neon-green/60 shrink-0" />
                {step}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Suggestion ─────────────────────────────────────────────────────── */}
      <div className="px-4 py-3 bg-neon-green/5">
        <div className="flex items-center gap-2 mb-1.5">
          <Lightbulb className="w-3.5 h-3.5 text-neon-green/70" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-neon-green/60">Suggestion</span>
        </div>
        <p className="text-neon-green/80 text-xs leading-relaxed">{data.suggestion}</p>
      </div>

      {/* ── Data Sources + Confidence ──────────────────────────────────────── */}
      <div className="px-4 py-3">
        {data.dataSources && data.dataSources.length > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <Database className="w-3 h-3 text-white/30" />
            <span className="text-[10px] text-white/30">
              Sources: {data.dataSources.join(" · ")}
            </span>
          </div>
        )}
        <ConfidenceBar score={data.confidenceScore} />
      </div>
    </div>
  );
};

export default StructuredResponse;
