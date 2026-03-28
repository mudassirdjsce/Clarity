import React, { useState, useMemo } from "react";
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
// MOCK DATA
// ─────────────────────────────────────────────
const MOCK_NEWS = [
  {
    id: 1,
    title: "RBI Signals Pivot: Rate Cut Expected in Q3 as Inflation Cools",
    summary:
      "The Reserve Bank of India has hinted at a possible rate reduction as CPI dips below 4.5%, boosting bond markets and rate-sensitive sectors like banking and real estate.",
    sentiment: "bullish",
    impact: "high",
    credibilityScore: 92,
    source: "Bloomberg India",
    publishedAt: "2025-07-14T08:30:00Z",
    tags: ["RBI", "Monetary Policy", "Banking", "Bonds"],
    fullAnalysis:
      "The RBI's dovish tone in its latest policy minutes suggests a window for rate cuts in Q3 2025. Analysts at Goldman Sachs and ICICI Securities believe a 25–50 bps reduction is likely if inflation remains anchored. This is expected to trigger significant re-rating in PSU banks, NBFCs, and housing finance companies. Bond yields may compress by 15–20 bps in the near term.",
    relatedAssets: ["SBIN", "HDFC", "LICHF", "IRFC", "10Y GSEC"],
  },
  {
    id: 2,
    title: "Adani Group Under SEC Scrutiny Over US-Listed Bond Disclosures",
    summary:
      "US regulators have opened a preliminary inquiry into disclosure practices for Adani Group's dollar-denominated bonds, sending group stocks down 4–7% intraday.",
    sentiment: "bearish",
    impact: "high",
    credibilityScore: 88,
    source: "Reuters",
    publishedAt: "2025-07-14T07:15:00Z",
    tags: ["Adani", "SEC", "Regulatory", "Bonds"],
    fullAnalysis:
      "The SEC inquiry is preliminary and not a formal investigation, but sentiment around Adani stocks is expected to remain fragile for at least 2–3 weeks. Credit default swap spreads on Adani Green Energy bonds widened by 45 bps. Institutional investors are likely to trim exposure until clarity emerges.",
    relatedAssets: ["ADANIENT", "ADANIGREEN", "ADANIPORTS", "ADANITRANS"],
  },
  {
    id: 3,
    title: "Infosys Raises FY26 Revenue Guidance to 4.5–6.5% in CC Terms",
    summary:
      "Infosys beat Q1FY26 earnings estimates and raised its annual guidance, citing deal wins in AI-led transformation projects across BFSI and manufacturing verticals.",
    sentiment: "bullish",
    impact: "high",
    credibilityScore: 95,
    source: "Infosys IR",
    publishedAt: "2025-07-14T06:00:00Z",
    tags: ["Infosys", "IT Sector", "Earnings", "AI"],
    fullAnalysis:
      "Infosys reported $4.7B revenue (up 3.6% QoQ CC), with operating margins expanding 80 bps to 21.3%. The deal TCV of $4.1B is a record, with 60% being large deals. Management specifically cited generative AI and cloud modernization as growth drivers. Consensus target prices are being revised upward by 8–12%.",
    relatedAssets: ["INFY", "TCS", "WIPRO", "HCLTECH", "NIFTYIT"],
  },
  {
    id: 4,
    title: "Crude Oil Jumps 3.2% on OPEC+ Supply Cut Extension Through 2026",
    summary:
      "OPEC+ members agreed to extend voluntary production cuts of 2.2 million bpd through end of 2026, pushing Brent above $89 per barrel for the first time this year.",
    sentiment: "bearish",
    impact: "high",
    credibilityScore: 90,
    source: "S&P Global Commodity",
    publishedAt: "2025-07-13T21:00:00Z",
    tags: ["Crude Oil", "OPEC+", "Commodities", "Inflation"],
    fullAnalysis:
      "Higher crude is a net negative for India's macro — every $10 rise in Brent adds ~0.4% to CAD and pressures the INR. Sectors most impacted: aviation (IndiGo, Air India), paints (Asian Paints), and OMCs. The INR could depreciate to 84.5–85 range if crude sustains above $90.",
    relatedAssets: ["BPCL", "IOC", "ONGC", "INDIGO", "ASIANPAINT"],
  },
  {
    id: 5,
    title: "SEBI Tightens F&O Margin Norms; Weekly Expiry Contracts Under Review",
    summary:
      "SEBI proposed stricter margin requirements for F&O positions and is considering restricting weekly expiries to index contracts only, aimed at curbing retail speculation.",
    sentiment: "neutral",
    impact: "medium",
    credibilityScore: 85,
    source: "SEBI Official",
    publishedAt: "2025-07-13T14:00:00Z",
    tags: ["SEBI", "F&O", "Regulation", "Derivatives"],
    fullAnalysis:
      "These proposals, if enacted, would significantly reduce F&O volumes on NSE and BSE. Brokers with high F&O revenue (Zerodha, Angel One, Groww) could see 15–25% revenue impact. However, the changes aim to improve market stability. The consultation paper is open for 30 days.",
    relatedAssets: ["ANGELONE", "5PAISA", "BSELTD", "MCX"],
  },
  {
    id: 6,
    title: "Reliance Jio Files for IPO; Valuation Expected at $112 Billion",
    summary:
      "Reliance Industries confirmed Jio Platforms has filed DRHP with SEBI for a primary listing, targeting a $112B valuation — India's largest-ever IPO.",
    sentiment: "bullish",
    impact: "high",
    credibilityScore: 78,
    source: "Economic Times",
    publishedAt: "2025-07-13T10:45:00Z",
    tags: ["Jio", "IPO", "Telecom", "Reliance"],
    fullAnalysis:
      "Jio's IPO would unlock massive value for Reliance Industries shareholders. At $112B, Jio would be valued at ~22x EV/EBITDA — a premium to global telecom comps. The IPO is expected to attract anchor investors including sovereign wealth funds from Middle East and Singapore.",
    relatedAssets: ["RELIANCE", "RJIO", "BHARTIARTL", "VODAIDEA"],
  },
  {
    id: 7,
    title: "Gold Retreats 1.8% as Dollar Strengthens on US Jobs Data Beat",
    summary:
      "Stronger-than-expected US non-farm payrolls reduced Fed rate cut expectations, boosting the dollar index to 104.6 and pulling MCX gold below ₹71,500 per 10g.",
    sentiment: "bearish",
    impact: "medium",
    credibilityScore: 91,
    source: "MCX India",
    publishedAt: "2025-07-12T20:00:00Z",
    tags: ["Gold", "USD", "Fed", "Commodities"],
    fullAnalysis:
      "The US economy added 235K jobs vs 185K expected, reducing near-term Fed cut probability to 62% from 78%. This is negative for gold in the short term but does not change the long-term bullish thesis. Domestic SGB and gold ETF holders may see mark-to-market dip. Support at ₹70,200.",
    relatedAssets: ["GOLDBEES", "SGBSEP25", "MOFSL_GOLD_ETF"],
  },
  {
    id: 8,
    title: "Nifty Smallcap 100 Hits All-Time High; Retail Inflows Sustain Rally",
    summary:
      "Nifty Smallcap 100 crossed 18,500 for the first time on the back of sustained SIP inflows and institutional interest in high-growth micro-cap stocks.",
    sentiment: "bullish",
    impact: "medium",
    credibilityScore: 82,
    source: "NSE India",
    publishedAt: "2025-07-12T15:30:00Z",
    tags: ["Smallcap", "Nifty", "SIP", "Retail"],
    fullAnalysis:
      "SIP inflows have exceeded ₹20,000 crore/month for 6 consecutive months, driving demand in the smallcap and midcap universe. However, valuations are stretched — Nifty Smallcap 100 P/E is at 32x vs historical average of 22x. Investors should be selective.",
    relatedAssets: ["NIFTYSC100", "MIRAE_SC_ETF", "NIPPON_SC_FUND"],
  },
  {
    id: 9,
    title: "India-EU FTA Talks Accelerate; Pharma and IT Services in Focus",
    summary:
      "India and EU negotiators have entered the final rounds of free trade agreement talks, with key breakthroughs in pharma market access and IT services visas.",
    sentiment: "bullish",
    impact: "medium",
    credibilityScore: 74,
    source: "Ministry of Commerce",
    publishedAt: "2025-07-12T11:00:00Z",
    tags: ["FTA", "EU", "Pharma", "IT", "Trade"],
    fullAnalysis:
      "An India-EU FTA would be transformational — EU is India's largest trading partner bloc. The deal could add $40–60B in trade over 5 years. Pharma companies like Sun Pharma, Cipla, and Aurobindo with EU exposure would benefit from preferential market access.",
    relatedAssets: ["SUNPHARMA", "CIPLA", "AUROPHARMA", "TCS", "INFY"],
  },
];

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
      <h3 style={{ fontSize: 15, fontWeight: 700, color: hovered ? "#ffffff" : "#e8e8e8", lineHeight: 1.45, marginBottom: 9, transition: "color 0.2s" }}>
        {news.title}
      </h3>

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
  const [loading] = useState(false);
  const [activeTab, setActiveTab] = useState("All");

  const filteredNews = useMemo(() => {
    return MOCK_NEWS.filter(n => {
      const matchesSearch =
        !searchQuery ||
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        n.source.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSentiment = filters.sentiment === "all" || n.sentiment === filters.sentiment;
      const matchesImpact = filters.impact === "all" || n.impact === filters.impact;
      const matchesCredibility =
        filters.credibility === "all" ||
        (filters.credibility === "high" && n.credibilityScore >= 85) ||
        (filters.credibility === "medium" && n.credibilityScore >= 65 && n.credibilityScore < 85) ||
        (filters.credibility === "low" && n.credibilityScore < 65);
      return matchesSearch && matchesSentiment && matchesImpact && matchesCredibility;
    });
  }, [searchQuery, filters]);

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
        <AnalyticsPanel news={MOCK_NEWS} />

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
            <SidePanel news={filteredNews.length ? filteredNews : MOCK_NEWS} />
          </div>
        </div>
      </main>
    </div>
  );
};


export function Markets() {
  return <NewsInstitution />;
}