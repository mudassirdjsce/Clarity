import React from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { CHART_META, RADAR_DATA } from "./radarData";

// ─── Custom Tooltip ──────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div
      style={{
        background: "#0b0f0b",
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: 12,
        padding: "10px 14px",
        minWidth: 160,
      }}
    >
      <p
        style={{
          fontSize: 10,
          color: "rgba(255,255,255,0.4)",
          textTransform: "uppercase",
          letterSpacing: "2px",
          marginBottom: 8,
          fontFamily: "monospace",
        }}
      >
        {label}
      </p>
      {payload.map((entry) => (
        <div
          key={entry.dataKey}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            marginBottom: 4,
          }}
        >
          <span style={{ fontSize: 11, color: entry.color, fontWeight: 600 }}>
            {entry.dataKey}
          </span>
          <span
            style={{
              fontSize: 13,
              color: "#fff",
              fontWeight: 800,
              fontFamily: "monospace",
            }}
          >
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Placeholder when nothing is selected ────────────────────────────────────
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full gap-4 select-none">
    <div
      className="w-24 h-24 rounded-full flex items-center justify-center text-4xl"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      📡
    </div>
    <div className="text-center">
      <p className="text-base font-bold text-white/30 mb-1">No Dataset Selected</p>
      <p className="text-xs text-white/20">
        Toggle a category on the right to visualize comparison
      </p>
    </div>
  </div>
);

// ─── Main Chart Display ───────────────────────────────────────────────────────
export default function RadarChartDisplay({ activeCharts }) {
  const colorMap = Object.fromEntries(CHART_META.map((m) => [m.name, m.color]));

  return (
    <div className="w-full h-full flex flex-col">
      {/* Chart area */}
      <div className="flex-1" style={{ minHeight: 340 }}>
        {activeCharts.length === 0 ? (
          <EmptyState />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart
              data={RADAR_DATA}
              margin={{ top: 10, right: 30, bottom: 10, left: 30 }}
            >
              <PolarGrid
                stroke="rgba(255,255,255,0.06)"
                strokeDasharray="3 3"
              />
              <PolarAngleAxis
                dataKey="metric"
                tick={{
                  fill: "rgba(255,255,255,0.45)",
                  fontSize: 11,
                  fontFamily: "monospace",
                  fontWeight: 600,
                }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 9 }}
                axisLine={false}
                tickCount={4}
              />

              {activeCharts.map((name) => (
                <Radar
                  key={name}
                  name={name}
                  dataKey={name}
                  stroke={colorMap[name]}
                  fill={colorMap[name]}
                  fillOpacity={0.18}
                  strokeWidth={2}
                  dot={{ r: 3, fill: colorMap[name], strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: colorMap[name], strokeWidth: 0 }}
                  isAnimationActive={true}
                  animationDuration={500}
                  animationEasing="ease-out"
                />
              ))}

              <Tooltip content={<CustomTooltip />} />

              {activeCharts.length > 1 && (
                <Legend
                  formatter={(value) => (
                    <span
                      style={{
                        color: colorMap[value],
                        fontSize: 10,
                        fontFamily: "monospace",
                        fontWeight: 700,
                      }}
                    >
                      {value}
                    </span>
                  )}
                  wrapperStyle={{ paddingTop: 12 }}
                />
              )}
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Metric legend pills */}
      {activeCharts.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3 justify-center">
          {activeCharts.map((name) => (
            <span
              key={name}
              className="text-[10px] font-mono font-bold px-3 py-1 rounded-full"
              style={{
                backgroundColor: `${colorMap[name]}18`,
                border: `1px solid ${colorMap[name]}44`,
                color: colorMap[name],
              }}
            >
              ● {name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
