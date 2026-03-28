import React, { useState, useMemo, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import { fetchInstitutionNews } from "../../services/api";

// ─────────────────────────────────────────────
// THEME CONSTANTS
// ─────────────────────────────────────────────
const NEON = "#39FF14";
const NEON_DIM = "rgba(57,255,20,0.15)";
const NEON_BORDER = "rgba(57,255,20,0.3)";
const BG_BASE = "#000000";
const BG_CARD = "#0a0a0a";
const BG_CARD2 = "#111111";
const BORDER = "#1c1c1c";
const BORDER2 = "#222222";
const TEXT_PRIMARY = "#ffffff";
const TEXT_SECONDARY = "#a0a0a0";
const TEXT_MUTED = "#555555";

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function formatTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", hour12: true });
}

// Returns a working URL: stored URL or Google News search fallback
function getArticleUrl(item) {
  if (item.url && item.url.startsWith("http")) return item.url;
  return `https://www.google.com/search?q=${encodeURIComponent(item.title)}&tbm=nws`;
}

// ─────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────

const SentimentBadge = ({ sentiment }) => {
  const config = {
    bullish: { label: "▲ Bullish", color: NEON, bg: NEON_DIM, border: NEON_BORDER },
    bearish: { label: "▼ Bearish", color: "#ff4444", bg: "rgba(255,68,68,0.12)", border: "rgba(255,68,68,0.3)" },
    neutral: { label: "◆ Neutral", color: "#888888", bg: "rgba(136,136,136,0.12)", border: "rgba(136,136,136,0.25)" },
  };
  const { label, color, bg, border } = config[sentiment] || config.neutral;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      background: bg, border: `1px solid ${border}`, borderRadius: 20,
      padding: "3px 10px", fontSize: 11, fontWeight: 700,
      color, letterSpacing: 0.4,
    }}>
      {label}
    </span>
  );
};

const ImpactTag = ({ impact }) => {
  const config = {
    high: { label: "⚡ HIGH", color: "#ff8c00", bg: "rgba(255,140,0,0.12)", border: "rgba(255,140,0,0.3)" },
    medium: { label: "◎ MED", color: "#f5c518", bg: "rgba(245,197,24,0.12)", border: "rgba(245,197,24,0.3)" },
    low: { label: "○ LOW", color: TEXT_MUTED, bg: "rgba(85,85,85,0.12)", border: "rgba(85,85,85,0.25)" },
  };
  const { label, color, bg, border } = config[impact] || config.low;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      background: bg, border: `1px solid ${border}`, borderRadius: 4,
      padding: "2px 8px", fontSize: 10, fontWeight: 800,
      color, letterSpacing: 1.2,
    }}>
      {label}
    </span>
  );
};

const CredibilityBar = ({ score }) => {
  const color = score >= 85 ? NEON : score >= 65 ? "#f5c518" : "#ff4444";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
      <div style={{ flex: 1, height: 3, background: "#1a1a1a", borderRadius: 10, overflow: "hidden" }}>
        <div style={{
          width: `${score}%`, height: "100%",
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          borderRadius: 10, transition: "width 0.7s ease",
          boxShadow: `0 0 6px ${color}66`,
        }} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, color, minWidth: 24, textAlign: "right" }}>{score}</span>
    </div>
  );
};

const FilterBar = ({ filters, setFilters, searchQuery, setSearchQuery }) => (
  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
    <div style={{ position: "relative", flex: "1 1 220px" }}>
      <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: TEXT_MUTED, fontSize: 14 }}>⌕</span>
      <input
        type="text"
        placeholder="Search company, stock, keyword..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          width: "100%", background: BG_CARD2, border: `1px solid ${BORDER2}`,
          color: TEXT_PRIMARY, fontSize: 13, borderRadius: 10,
          padding: "10px 14px 10px 36px", outline: "none",
          transition: "border-color 0.2s",
        }}
        onFocus={e => e.target.style.borderColor = NEON_BORDER}
        onBlur={e => e.target.style.borderColor = BORDER2}
      />
    </div>
    {[
      { key: "sentiment", options: [["all", "All Sentiment"], ["bullish", "Bullish"], ["bearish", "Bearish"], ["neutral", "Neutral"]] },
      { key: "impact", options: [["all", "All Impact"], ["high", "High Impact"], ["medium", "Medium"], ["low", "Low"]] },
      { key: "credibility", options: [["all", "All Credibility"], ["high", "High Trust (85+)"], ["medium", "Medium (65–84)"], ["low", "Low (<65)"]] },
    ].map(({ key, options }) => (
      <select
        key={key}
        value={filters[key]}
        onChange={(e) => setFilters(f => ({ ...f, [key]: e.target.value }))}
        style={{
          background: BG_CARD2, border: `1px solid ${BORDER2}`, color: TEXT_SECONDARY,
          fontSize: 13, borderRadius: 10, padding: "10px 14px", outline: "none", cursor: "pointer",
        }}
      >
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    ))}
  </div>
);

const NewsCard = ({ news }) => {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const sentBorder = {
    bullish: NEON,
    bearish: "#ff4444",
    neutral: "#444444",
  };

  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", hour12: true });
  };

  return (
    <div
      onClick={() => setExpanded(e => !e)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? BG_CARD2 : BG_CARD,
        border: `1px solid ${hovered ? BORDER2 : BORDER}`,
        borderLeft: `3px solid ${sentBorder[news.sentiment] || "#444"}`,
        borderRadius: 14,
        padding: "18px 18px 16px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        transform: hovered ? "translateY(-2px)" : "none",
        boxShadow: hovered ? `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${sentBorder[news.sentiment]}22` : "none",
        position: "relative",
      }}
    >
      {/* Source + Time */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: NEON, letterSpacing: 0.8, textTransform: "uppercase" }}>
          {news.source}
        </span>
        <span style={{ fontSize: 11, color: TEXT_MUTED }}>⏱ {formatTime(news.publishedAt)}</span>
      </div>

      {/* Title */}
      <a
        href={getArticleUrl(news)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={e => e.stopPropagation()}
        style={{ textDecoration: "none" }}
      >
        <h3 style={{
          fontSize: 15, fontWeight: 700,
          color: hovered ? NEON : "#e8e8e8",
          lineHeight: 1.45, marginBottom: 9, transition: "color 0.2s",
        }}>
          {news.title} ↗
        </h3>
      </a>

      {/* Summary */}
      <p style={{ fontSize: 13, color: TEXT_SECONDARY, lineHeight: 1.65, marginBottom: 12,
        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {news.summary}
      </p>

      {/* Badges */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
        <SentimentBadge sentiment={news.sentiment} />
        <ImpactTag impact={news.impact} />
      </div>

      {/* Credibility */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
          <span style={{ fontSize: 10, color: TEXT_MUTED, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600 }}>Credibility</span>
        </div>
        <CredibilityBar score={news.credibilityScore} />
      </div>

      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {news.tags.map(tag => (
          <span key={tag} style={{
            fontSize: 10, background: "#111111", color: TEXT_MUTED,
            border: `1px solid ${BORDER2}`, padding: "2px 8px", borderRadius: 4, fontWeight: 500,
          }}>{tag}</span>
        ))}
      </div>

      {/* Expand Toggle */}
      <div style={{
        position: "absolute", top: 16, right: 16, width: 22, height: 22,
        borderRadius: "50%", background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center",
        color: expanded ? NEON : TEXT_MUTED, fontSize: 9, fontWeight: 800, transition: "all 0.2s",
        border: `1px solid ${expanded ? NEON_BORDER : BORDER}`,
      }}>
        {expanded ? "▲" : "▼"}
      </div>

      {/* Expanded Section */}
      {expanded && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${BORDER2}` }}>
          <p style={{ fontSize: 10, color: TEXT_MUTED, textTransform: "uppercase", letterSpacing: 2, fontWeight: 700, marginBottom: 8 }}>
            Full Analysis
          </p>
          <p style={{ fontSize: 13, color: "#cccccc", lineHeight: 1.7, marginBottom: 14 }}>
            {news.fullAnalysis}
          </p>
          <p style={{ fontSize: 10, color: TEXT_MUTED, textTransform: "uppercase", letterSpacing: 2, fontWeight: 700, marginBottom: 8 }}>
            Related Assets
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {news.relatedAssets.map(a => (
              <span key={a} style={{
                fontSize: 11, background: NEON_DIM, color: NEON,
                border: `1px solid ${NEON_BORDER}`, padding: "3px 10px",
                borderRadius: 5, fontWeight: 700,
              }}>{a}</span>
            ))}
          </div>
          {(
            <a
              href={getArticleUrl(news)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                marginTop: 14, padding: "8px 16px",
                background: NEON_DIM, border: `1px solid ${NEON_BORDER}`,
                borderRadius: 8, color: NEON,
                fontSize: 12, fontWeight: 700, textDecoration: "none",
                transition: "all 0.2s",
              }}
            >
              Read Full Article ↗
            </a>
          )}
        </div>
      )}
    </div>
  );
};

const SidePanel = ({ news }) => {
  const highImpact = news.filter(n => n.impact === "high");
  const trending = [...news].sort((a, b) => b.credibilityScore - a.credibilityScore).slice(0, 5);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 80 }}>
      {/* Most Impactful */}
      <div style={{ background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "18px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <span style={{ fontSize: 14 }}>🔥</span>
          <span style={{ fontSize: 12, fontWeight: 800, color: TEXT_PRIMARY, letterSpacing: 0.5 }}>Most Impactful</span>
          <span style={{
            marginLeft: "auto", fontSize: 10, background: "rgba(255,140,0,0.12)",
            color: "#ff8c00", border: "1px solid rgba(255,140,0,0.3)",
            padding: "2px 8px", borderRadius: 20, fontWeight: 700,
          }}>{highImpact.length} Events</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {highImpact.map(n => (
            <div key={n.id} style={{
              borderLeft: `2px solid ${n.sentiment === "bullish" ? NEON : n.sentiment === "bearish" ? "#ff4444" : "#444"}`,
              paddingLeft: 12, paddingTop: 2, paddingBottom: 2,
            }}>
              <p style={{ fontSize: 12, color: "#d5d5d5", fontWeight: 600, lineHeight: 1.4, marginBottom: 5,
                display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {n.title}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <SentimentBadge sentiment={n.sentiment} />
                <span style={{ fontSize: 10, color: TEXT_MUTED }}>{n.source}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Now */}
      <div style={{ background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "18px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <span style={{ fontSize: 14 }}>📈</span>
          <span style={{ fontSize: 12, fontWeight: 800, color: TEXT_PRIMARY }}>Trending Now</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {trending.map((n, i) => (
            <div key={n.id} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ fontSize: 18, fontWeight: 900, color: "#1e1e1e", lineHeight: 1, minWidth: 20, marginTop: 2 }}>
                {i + 1}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, color: "#cccccc", fontWeight: 600, lineHeight: 1.4, marginBottom: 5,
                  display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {n.title}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {n.tags.slice(0, 2).map(t => (
                    <span key={t} style={{ fontSize: 10, background: "#111111", color: TEXT_MUTED, border: `1px solid ${BORDER}`, padding: "1px 6px", borderRadius: 3 }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AnalyticsPanel = ({ news }) => {
  const bullish = news.filter(n => n.sentiment === "bullish").length;
  const bearish = news.filter(n => n.sentiment === "bearish").length;
  const neutral = news.filter(n => n.sentiment === "neutral").length;
  const highImpact = news.filter(n => n.impact === "high").length;
  const medImpact = news.filter(n => n.impact === "medium").length;

  const pieData = [
    { name: "Bullish", value: bullish, color: NEON },
    { name: "Bearish", value: bearish, color: "#ff4444" },
    { name: "Neutral", value: neutral, color: "#555555" },
  ];

  const barData = [
    { name: "High", count: highImpact, fill: "#ff8c00" },
    { name: "Med", count: medImpact, fill: "#f5c518" },
    { name: "Low", count: news.length - highImpact - medImpact, fill: "#333333" },
  ];

  const metrics = [
    { label: "Total Stories", value: news.length, color: TEXT_PRIMARY },
    { label: "High Impact", value: highImpact, color: "#ff8c00" },
    { label: "Bullish Ratio", value: `${Math.round((bullish / news.length) * 100)}%`, color: NEON },
    { label: "Avg Credibility", value: Math.round(news.reduce((s, n) => s + n.credibilityScore, 0) / news.length) + "/100", color: "#aaaaaa" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14, marginBottom: 20 }}>
      {/* Sentiment Chart */}
      <div style={{ background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "18px 16px" }}>
        <p style={{ fontSize: 10, color: TEXT_MUTED, textTransform: "uppercase", letterSpacing: 2, fontWeight: 700, marginBottom: 14 }}>
          Market Sentiment
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <ResponsiveContainer width={80} height={80}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={24} outerRadius={38} paddingAngle={3} dataKey="value" strokeWidth={0}>
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {pieData.map(d => (
              <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: d.color, flexShrink: 0, boxShadow: `0 0 4px ${d.color}` }} />
                <span style={{ fontSize: 12, color: TEXT_SECONDARY }}>
                  {d.name}: <strong style={{ color: TEXT_PRIMARY }}>{d.value}</strong>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Impact Bar */}
      <div style={{ background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "18px 16px" }}>
        <p style={{ fontSize: 10, color: TEXT_MUTED, textTransform: "uppercase", letterSpacing: 2, fontWeight: 700, marginBottom: 14 }}>
          Impact Distribution
        </p>
        <ResponsiveContainer width="100%" height={80}>
          <BarChart data={barData} barSize={22}>
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: TEXT_MUTED }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {barData.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Bar>
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.02)" }}
              contentStyle={{ background: "#111111", border: `1px solid ${BORDER2}`, borderRadius: 8, fontSize: 11, color: TEXT_PRIMARY }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Key Metrics */}
      <div style={{ background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "18px 16px" }}>
        <p style={{ fontSize: 10, color: TEXT_MUTED, textTransform: "uppercase", letterSpacing: 2, fontWeight: 700, marginBottom: 14 }}>
          Session Overview
        </p>
        {metrics.map(m => (
          <div key={m.label} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "8px 0", borderBottom: `1px solid ${BORDER}`,
          }}>
            <span style={{ fontSize: 12, color: TEXT_SECONDARY }}>{m.label}</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: m.color }}>{m.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div style={{ background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 18 }}>
    {[["40%", 10], ["90%", 16], ["100%", 12], ["75%", 12]].map(([w, h], i) => (
      <div key={i} style={{ height: h, background: BG_CARD2, borderRadius: 6, width: w, marginBottom: 10 }} />
    ))}
    <div style={{ display: "flex", gap: 6 }}>
      <div style={{ height: 22, width: 70, background: BG_CARD2, borderRadius: 20 }} />
      <div style={{ height: 22, width: 50, background: BG_CARD2, borderRadius: 4 }} />
    </div>
  </div>
);

const EmptyState = () => (
  <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "80px 20px" }}>
    <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>📭</div>
    <p style={{ color: TEXT_SECONDARY, fontWeight: 700, fontSize: 15, marginBottom: 6 }}>No news matches your filters</p>
    <p style={{ color: TEXT_MUTED, fontSize: 13 }}>Try adjusting your search or filter criteria</p>
  </div>
);

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
const NewsInstitution = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ sentiment: "all", impact: "all", credibility: "all" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newsData, setNewsData] = useState([]);

  // Fetch from backend with debounce
  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiParams = {
          sentiment: filters.sentiment !== "all" ? filters.sentiment : undefined,
          impact: filters.impact !== "all" ? filters.impact : undefined,
          search: searchQuery || undefined,
        };
        const data = await fetchInstitutionNews(apiParams);
        // Credibility is a range filter — apply client-side
        const credFiltered = data.filter(n => {
          if (filters.credibility === "high") return n.credibilityScore >= 85;
          if (filters.credibility === "medium") return n.credibilityScore >= 65 && n.credibilityScore < 85;
          if (filters.credibility === "low") return n.credibilityScore < 65;
          return true;
        });
        setNewsData(credFiltered);
      } catch (err) {
        setError("Failed to load institutional news. Please try again.");
        setNewsData([]);
      } finally {
        setLoading(false);
      }
    };
    const t = setTimeout(loadNews, 400);
    return () => clearTimeout(t);
  }, [searchQuery, filters]);

  // filteredNews is now the live data (backend already handles sentiment/impact/search)
  const filteredNews = newsData;

  return (
    <div style={{ color: TEXT_PRIMARY, fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        select option { background: #111111; color: #ffffff; }
        input::placeholder { color: #555555; }
        @keyframes glow-pulse { 0%,100%{box-shadow:0 0 6px ${NEON}88} 50%{box-shadow:0 0 14px ${NEON}} }
        @keyframes fadeSlideUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <main style={{ maxWidth: 1360, margin: "0 auto", padding: "0 12px" }}>
        {/* ── Page Title ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: TEXT_PRIMARY, letterSpacing: -0.5, margin: 0 }}>
                News Intelligence{" "}
                <span style={{ color: NEON, textShadow: `0 0 20px ${NEON}66` }}>Dashboard</span>
              </h1>
              <span style={{
                fontSize: 10, fontWeight: 800, background: NEON_DIM, color: NEON,
                border: `1px solid ${NEON_BORDER}`, padding: "3px 10px", borderRadius: 20, letterSpacing: 1,
              }}>INSTITUTION PRO</span>
            </div>
            <p style={{ fontSize: 13, color: TEXT_MUTED, margin: 0 }}>
              Real-time market news with AI-powered sentiment analysis, credibility scoring, and impact classification
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: NEON, display: "inline-block", animation: "glow-pulse 2s infinite" }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: NEON, letterSpacing: 1 }}>LIVE</span>
            </div>
            <span style={{ fontSize: 11, color: TEXT_MUTED }}>
              {new Date().toLocaleString("en-IN", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        </div>

        {/* ── Analytics Panel ── */}
        <AnalyticsPanel news={newsData.length ? newsData : []} />

        {/* ── Filter Bar ── */}
        <div style={{ background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "16px 18px", marginBottom: 22 }}>
          <FilterBar filters={filters} setFilters={setFilters} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>

        {/* ── Main Layout ── */}
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
          {/* ── News Grid ── */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Tab Bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 12, color: TEXT_MUTED, fontWeight: 600 }}>
                <span style={{ color: NEON, fontWeight: 800 }}>{filteredNews.length}</span> Stories
              </span>
              <div style={{ display: "flex", gap: 6 }}>
                {["All", "Bullish", "Bearish"].map(label => {
                  const isActive = (label === "All" && filters.sentiment === "all") || filters.sentiment === label.toLowerCase();
                  return (
                    <button
                      key={label}
                      onClick={() => setFilters(f => ({ ...f, sentiment: label === "All" ? "all" : label.toLowerCase() }))}
                      style={{
                        fontSize: 11, padding: "6px 14px", borderRadius: 8, fontWeight: 700,
                        background: isActive ? NEON_DIM : "transparent",
                        color: isActive ? NEON : TEXT_MUTED,
                        border: `1px solid ${isActive ? NEON_BORDER : BORDER}`,
                        cursor: "pointer", transition: "all 0.15s",
                      }}
                    >{label}</button>
                  );
                })}
              </div>
            </div>

            {/* Card Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
              {loading
                ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                : filteredNews.length === 0
                ? <EmptyState />
                : filteredNews.map(news => <NewsCard key={news.id} news={news} />)
              }
            </div>
          </div>

          {/* ── Side Panel ── */}
          <div style={{ width: 290, flexShrink: 0 }}>
            <SidePanel news={filteredNews.length ? filteredNews : []} />
          </div>
        </div>
      </main>
    </div>
  );
};


export function Markets() {
  return <NewsInstitution />;
}