import { useState, useEffect } from "react";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";

// ─── THEME ────────────────────────────────────────────────────────────────────
const NEON = "#39FF14";
const NEON_DIM = "rgba(57,255,20,0.12)";
const NEON_BORDER = "rgba(57,255,20,0.28)";
const BG_BASE = "#000000";
const BG_CARD = "#0a0a0a";
const BG_CARD2 = "#111111";
const BORDER = "#1c1c1c";
const BORDER2 = "#252525";
const TEXT_PRIMARY = "#ffffff";
const TEXT_SECONDARY = "#a0a0a0";
const TEXT_MUTED = "#505050";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const NEWS_DATA = [
  {
    id: 1,
    title: "Fed Keeps Rates Same",
    summary: "The people who control money decided not to change the interest rate. This usually means things will stay the same for a while.",
    fullSummary: "The Federal Reserve voted unanimously to hold the federal funds rate steady. This decision signals that inflation is cooling and the economy remains stable, which is generally good news for long-term investors. Expect steady market conditions over the next few weeks.",
    sentiment: "neutral",
    impact: "high",
    credibilityScore: 98,
    source: "Reuters",
    publishedAt: "2 min ago",
    tags: ["GLOBAL MARKETS", "Economy"],
    relatedAssets: ["NIFTY 50", "USD/INR", "Gold"],
    featured: true,
    sparkData: [4, 5, 4.8, 5.2, 4.9, 5.1, 5.0, 5.3, 5.1, 5.4],
  },
  {
    id: 2,
    title: "Chip Stocks Surge on AI Demand",
    summary: "More companies are buying chips for AI, causing stock values in the hardware sector to rise quickly.",
    fullSummary: "Global semiconductor stocks rallied strongly as demand from AI data centres hit record highs. Companies like NVIDIA and AMD saw fresh buying interest, and Indian IT hardware plays are likely to benefit from the ripple effect.",
    sentiment: "bullish",
    impact: "high",
    credibilityScore: 91,
    source: "Bloomberg",
    publishedAt: "15 min ago",
    tags: ["TECH SECTOR"],
    relatedAssets: ["NVIDIA", "Infosys", "HCL Tech"],
    featured: false,
    sparkData: [3.2, 3.8, 4.1, 3.9, 4.5, 4.8, 5.2, 5.6, 5.9, 6.2],
  },
  {
    id: 3,
    title: "Gold Prices Reach Record Highs",
    summary: "People are buying gold to stay safe because they are worried about the global economy.",
    fullSummary: "Gold surpassed $2,400/oz as global uncertainty pushed investors toward safe-haven assets. For Indian investors, this means Sovereign Gold Bonds and Gold ETFs may continue to appreciate in the near term.",
    sentiment: "neutral",
    impact: "medium",
    credibilityScore: 95,
    source: "CNBC",
    publishedAt: "2 min ago",
    tags: ["INSIGHT", "Commodities"],
    relatedAssets: ["Gold ETF", "Sovereign Gold Bond"],
    featured: false,
    sparkData: [5.1, 5.3, 5.5, 5.4, 5.7, 5.9, 6.1, 6.0, 6.3, 6.5],
  },
  {
    id: 4,
    title: "RBI Holds Repo Rate at 6.5%",
    summary: "India's central bank kept borrowing costs the same, which is good for home loan holders and stock markets.",
    fullSummary: "The Reserve Bank of India held the repo rate for the seventh consecutive time. This provides relief to borrowers and signals a stable monetary environment. Banking and real-estate stocks typically react positively to such decisions.",
    sentiment: "bullish",
    impact: "high",
    credibilityScore: 99,
    source: "RBI Official",
    publishedAt: "1 hr ago",
    tags: ["INDIA MACRO"],
    relatedAssets: ["Bank Nifty", "HDFC Bank", "SBI"],
    featured: false,
    sparkData: [4.8, 4.9, 5.1, 5.0, 5.2, 5.4, 5.3, 5.5, 5.6, 5.8],
  },
  {
    id: 5,
    title: "Reliance Q3 Profit Jumps 11%",
    summary: "Reliance Industries earned more money this quarter, mostly from its phone and shopping businesses.",
    fullSummary: "RIL reported Q3 net profit of ₹21,930 crore, beating analyst estimates. Jio's subscriber additions and Reliance Retail's strong EBITDA margin expansion were key drivers. The stock is likely to see continued buying interest.",
    sentiment: "bullish",
    impact: "medium",
    credibilityScore: 97,
    source: "BSE Filing",
    publishedAt: "3 hr ago",
    tags: ["EARNINGS", "Large Cap"],
    relatedAssets: ["RELIANCE", "Nifty 50"],
    featured: false,
    sparkData: [3.5, 3.7, 4.0, 3.9, 4.2, 4.4, 4.6, 4.5, 4.8, 5.0],
  },
  {
    id: 6,
    title: "SEBI Tightens F&O Rules for Retail",
    summary: "The stock market regulator made some trading rules stricter to protect everyday investors from big losses.",
    fullSummary: "SEBI's new F&O framework limits weekly expiry contracts and increases margin requirements. While this may reduce short-term trading volumes, it is designed to protect retail investors from excessive speculation and high-risk trades.",
    sentiment: "neutral",
    impact: "medium",
    credibilityScore: 100,
    source: "SEBI Circular",
    publishedAt: "5 hr ago",
    tags: ["REGULATORY"],
    relatedAssets: ["Nifty Options", "Bank Nifty Options"],
    featured: false,
    sparkData: [5.0, 4.8, 4.6, 4.7, 4.5, 4.6, 4.4, 4.5, 4.3, 4.4],
  },
];

const WEEKLY_PULSE = {
  summary: "Overall, markets are showing strong resilience. While some sectors are volatile, the general trend for your retail portfolio remains healthy.",
  topGainer: { name: "NVIDIA", change: "+4.2%" },
  activeInterest: "Energy",
  confidence: 8.4,
};

const MARKET_FEELING_MAP = {
  bullish: { label: "Bullish", icon: "▲", color: NEON, bg: NEON_DIM, border: NEON_BORDER },
  bearish: { label: "Bearish", icon: "▼", color: "#ff4444", bg: "rgba(255,68,68,0.12)", border: "rgba(255,68,68,0.3)" },
  neutral: { label: "Steady", icon: "→", color: "#888888", bg: "rgba(136,136,136,0.1)", border: "rgba(136,136,136,0.25)" },
};

const IMPACT_MAP = {
  high: { label: "HIGH IMPACT", color: "#ff8c00", bg: "rgba(255,140,0,0.12)", border: "rgba(255,140,0,0.3)" },
  medium: { label: "MEDIUM", color: "#f5c518", bg: "rgba(245,197,24,0.12)", border: "rgba(245,197,24,0.3)" },
  low: { label: "LOW", color: TEXT_MUTED, bg: "rgba(80,80,80,0.1)", border: "rgba(80,80,80,0.2)" },
};

const FILTERS = ["All", "Bullish", "Bearish", "Neutral", "High Impact"];

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function LiveBadge() {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 7,
      background: NEON_DIM, border: `1px solid ${NEON_BORDER}`,
      borderRadius: 20, padding: "5px 14px",
    }}>
      <div style={{
        width: 7, height: 7, borderRadius: "50%", background: NEON,
        boxShadow: `0 0 8px ${NEON}`, animation: "glow-pulse 2s infinite",
      }} />
      <span style={{ fontSize: 11, color: NEON, fontWeight: 700, letterSpacing: 1 }}>Scanning 42 Sources</span>
    </div>
  );
}

function SentimentBadge({ sentiment, size = "sm" }) {
  const cfg = MARKET_FEELING_MAP[sentiment];
  const isLg = size === "lg";
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: cfg.bg, border: `1px solid ${cfg.border}`,
      borderRadius: 20, padding: isLg ? "5px 14px" : "3px 10px",
    }}>
      <span style={{ color: cfg.color, fontSize: isLg ? 15 : 12, fontWeight: 800 }}>{cfg.icon}</span>
      <span style={{ color: cfg.color, fontSize: isLg ? 13 : 11, fontWeight: 700, letterSpacing: 0.4 }}>{cfg.label}</span>
    </div>
  );
}

function CredibilityRing({ score }) {
  const color = score >= 90 ? NEON : score >= 70 ? "#f5c518" : "#ff4444";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
      <div style={{
        width: 44, height: 44, borderRadius: "50%",
        border: `2.5px solid ${color}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: `${color}11`,
        boxShadow: `0 0 10px ${color}44`,
      }}>
        <span style={{ fontSize: 13, fontWeight: 800, color, lineHeight: 1 }}>{score}</span>
      </div>
      <span style={{ fontSize: 9, color: TEXT_MUTED, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600 }}>Cred.</span>
    </div>
  );
}

function ImpactTag({ impact }) {
  const cfg = IMPACT_MAP[impact];
  return (
    <span style={{
      fontSize: 10, letterSpacing: 1.2, padding: "3px 9px",
      borderRadius: 4, background: cfg.bg, border: `1px solid ${cfg.border}`,
      color: cfg.color, fontWeight: 800,
    }}>{cfg.label}</span>
  );
}

function CategoryTag({ label }) {
  return (
    <span style={{
      fontSize: 10, letterSpacing: 1.5, padding: "3px 10px",
      borderRadius: 4, background: NEON_DIM,
      border: `1px solid ${NEON_BORDER}`, color: NEON, fontWeight: 700,
    }}>{label}</span>
  );
}

function SparkLine({ data, color = NEON }) {
  const chartData = data.map((v, i) => ({ i, v }));
  return (
    <ResponsiveContainer width="100%" height={42}>
      <AreaChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
        <defs>
          <linearGradient id={`sg-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.25} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5}
          fill={`url(#sg-${color.replace("#", "")})`} dot={false} />
        <Tooltip content={() => null} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function SkeletonCard() {
  return (
    <div style={{ background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 18 }}>
      {[["40%", 10], ["85%", 18], ["100%", 12], ["70%", 12]].map(([w, h], i) => (
        <div key={i} style={{ height: h, background: BG_CARD2, borderRadius: 6, width: w, marginBottom: 10, opacity: 0.6 }} />
      ))}
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ height: 26, width: 90, background: BG_CARD2, borderRadius: 20 }} />
        <div style={{ height: 26, width: 70, background: BG_CARD2, borderRadius: 4 }} />
      </div>
    </div>
  );
}

// ─── FEATURED CARD ────────────────────────────────────────────────────────────
function FeaturedCard({ item }) {
  const [aiText, setAiText] = useState(item.summary);
  const [loadingAI, setLoadingAI] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const fetchAISummary = async () => {
    setLoadingAI(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 150,
          system: "You are a financial news simplifier for everyday retail investors in India. Explain news in plain, friendly language in 2 sentences max.",
          messages: [{ role: "user", content: `Simplify: "${item.title}. ${item.fullSummary}"` }],
        }),
      });
      const data = await res.json();
      setAiText(data.content?.[0]?.text || item.summary);
    } catch { setAiText(item.summary); }
    finally { setLoadingAI(false); }
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#0d0d0d" : BG_CARD,
        border: `1px solid ${hovered ? NEON_BORDER : BORDER}`,
        borderRadius: 16, padding: "24px 26px",
        position: "relative", overflow: "hidden",
        transition: "all 0.25s ease",
        boxShadow: hovered ? `0 12px 40px rgba(0,0,0,0.6), 0 0 0 1px ${NEON_BORDER}` : "none",
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: "absolute", top: -60, left: -60, width: 200, height: 200,
        background: `radial-gradient(circle, ${NEON}08 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", top: 12, right: 16,
        fontSize: 10, fontWeight: 800, background: NEON_DIM, color: NEON,
        border: `1px solid ${NEON_BORDER}`, padding: "3px 10px", borderRadius: 20, letterSpacing: 1,
      }}>FEATURED</div>

      {/* Top Row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <CategoryTag label={item.tags[0]} />
        <CredibilityRing score={item.credibilityScore} />
      </div>

      {/* Headline */}
      <h2 style={{ fontSize: 22, fontWeight: 800, color: TEXT_PRIMARY, lineHeight: 1.35, marginBottom: 16, maxWidth: "88%" }}>
        {item.title}
      </h2>

      {/* AI Summary Box */}
      <div style={{
        background: "rgba(0,0,0,0.5)", border: `1px solid ${NEON_BORDER}22`,
        borderLeft: `3px solid ${NEON}`, borderRadius: 10, padding: "14px 16px", marginBottom: 18,
      }}>
        <span style={{ fontSize: 9, color: NEON, letterSpacing: 2.5, display: "block", marginBottom: 8, fontWeight: 700, textTransform: "uppercase" }}>
          AI Summary
        </span>
        {loadingAI ? (
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: NEON, animation: `bounce 0.8s ${i * 0.15}s infinite` }} />
            ))}
          </div>
        ) : (
          <p style={{ fontSize: 14, color: TEXT_SECONDARY, lineHeight: 1.65, fontStyle: "italic", margin: 0 }}>
            "{aiText}"
          </p>
        )}
      </div>

      {/* Expanded Full Breakdown */}
      {expanded && (
        <div style={{
          background: NEON_DIM, border: `1px solid ${NEON_BORDER}`,
          borderRadius: 10, padding: "14px 16px", marginBottom: 18,
        }}>
          <span style={{ fontSize: 9, color: NEON, letterSpacing: 2.5, display: "block", marginBottom: 8, fontWeight: 700, textTransform: "uppercase" }}>
            Full Breakdown
          </span>
          <p style={{ fontSize: 13, color: TEXT_SECONDARY, lineHeight: 1.7, margin: "0 0 14px 0" }}>{item.fullSummary}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {item.relatedAssets.map(a => (
              <span key={a} style={{
                fontSize: 11, background: BG_CARD2, color: TEXT_SECONDARY,
                border: `1px solid ${BORDER2}`, padding: "3px 10px", borderRadius: 4, fontWeight: 600,
              }}>{a}</span>
            ))}
          </div>
        </div>
      )}

      {/* Bottom */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div>
            <div style={{ fontSize: 9, color: TEXT_MUTED, letterSpacing: 1.5, marginBottom: 5, textTransform: "uppercase", fontWeight: 600 }}>Market Feeling</div>
            <SentimentBadge sentiment={item.sentiment} size="lg" />
          </div>
          <ImpactTag impact={item.impact} />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={fetchAISummary} style={{
            background: "transparent", border: `1px solid ${BORDER2}`,
            color: TEXT_SECONDARY, borderRadius: 8, padding: "8px 14px",
            fontSize: 11, cursor: "pointer", fontWeight: 600, transition: "all 0.2s",
          }}>↺ Refresh AI</button>
          <button onClick={() => setExpanded(e => !e)} style={{
            background: expanded ? NEON_DIM : NEON,
            border: `1px solid ${expanded ? NEON_BORDER : NEON}`,
            color: expanded ? NEON : "#000",
            borderRadius: 8, padding: "8px 20px",
            fontSize: 12, cursor: "pointer", fontWeight: 800,
            transition: "all 0.2s",
            boxShadow: expanded ? "none" : `0 0 16px ${NEON}44`,
          }}>{expanded ? "Close ×" : "Full Breakdown"}</button>
        </div>
      </div>
    </div>
  );
}

// ─── SMALL NEWS CARD ──────────────────────────────────────────────────────────
function SmallCard({ item, index }) {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const sparkColor = item.sentiment === "bullish" ? NEON : item.sentiment === "bearish" ? "#ff4444" : "#555555";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setExpanded(e => !e)}
      style={{
        background: hovered ? "#0d0d0d" : BG_CARD,
        border: `1px solid ${hovered ? BORDER2 : BORDER}`,
        borderRadius: 14, padding: "18px 18px 14px",
        cursor: "pointer", transition: "all 0.2s ease",
        transform: hovered ? "translateY(-2px)" : "none",
        boxShadow: hovered ? "0 10px 36px rgba(0,0,0,0.5)" : "none",
        animation: `fadeSlideUp 0.35s ease ${index * 60}ms both`,
      }}
    >
      {/* Tag + time */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <CategoryTag label={item.tags[0]} />
        <span style={{ fontSize: 11, color: TEXT_MUTED }}>{item.publishedAt}</span>
      </div>

      {/* Headline */}
      <h3 style={{ fontSize: 15, fontWeight: 700, color: hovered ? "#ffffff" : "#e8e8e8", lineHeight: 1.4, marginBottom: 10, transition: "color 0.2s" }}>
        {item.title}
      </h3>

      {/* Sparkline */}
      <div style={{ marginBottom: 10 }}>
        <SparkLine data={item.sparkData} color={sparkColor} />
      </div>

      {/* Summary */}
      <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 12 }}>
        {item.summary}
      </p>

      {/* Expanded */}
      {expanded && (
        <div style={{
          background: "rgba(0,0,0,0.4)", border: `1px solid ${BORDER2}`,
          borderRadius: 8, padding: "12px 14px", marginBottom: 12,
        }}>
          <p style={{ fontSize: 13, color: TEXT_SECONDARY, lineHeight: 1.65, margin: "0 0 10px 0" }}>{item.fullSummary}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {item.relatedAssets.map(a => (
              <span key={a} style={{
                fontSize: 10, background: NEON_DIM, color: NEON,
                border: `1px solid ${NEON_BORDER}`, padding: "2px 8px", borderRadius: 4, fontWeight: 700,
              }}>{a}</span>
            ))}
          </div>
        </div>
      )}

      {/* Bottom */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <SentimentBadge sentiment={item.sentiment} />
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            fontSize: 11, color: item.credibilityScore >= 90 ? NEON : "#f5c518", fontWeight: 700,
          }}>✓ {item.credibilityScore}%</span>
          <ImpactTag impact={item.impact} />
        </div>
      </div>
    </div>
  );
}

// ─── WEEKLY PULSE ─────────────────────────────────────────────────────────────
function WeeklyPulseCard() {
  return (
    <div style={{ background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "20px 22px", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 18, color: NEON }}>✦</span>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: TEXT_PRIMARY, margin: 0 }}>The Weekly Pulse</h3>
      </div>
      <p style={{ fontSize: 13, color: TEXT_SECONDARY, lineHeight: 1.65, marginBottom: 16 }}>
        {WEEKLY_PULSE.summary}
      </p>
      <div style={{ display: "flex", gap: 12 }}>
        {[
          { label: "TOP GAINER", value: WEEKLY_PULSE.topGainer.name, sub: WEEKLY_PULSE.topGainer.change, subColor: NEON },
          { label: "ACTIVE INTEREST", value: WEEKLY_PULSE.activeInterest, sub: "Sector", subColor: TEXT_MUTED },
        ].map(card => (
          <div key={card.label} style={{
            flex: 1, background: BG_CARD2, border: `1px solid ${BORDER2}`,
            borderRadius: 10, padding: "12px 14px",
          }}>
            <div style={{ fontSize: 9, color: TEXT_MUTED, letterSpacing: 1.8, marginBottom: 6, fontWeight: 700, textTransform: "uppercase" }}>{card.label}</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: TEXT_PRIMARY }}>{card.value}</div>
            <div style={{ fontSize: 13, color: card.subColor, marginTop: 3, fontWeight: 700 }}>{card.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConfidenceCard() {
  const score = WEEKLY_PULSE.confidence;
  const color = score >= 7 ? NEON : score >= 5 ? "#f5c518" : "#ff4444";
  return (
    <div style={{
      background: BG_CARD, border: `1px solid ${BORDER}`,
      borderRadius: 14, padding: "20px", display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12,
    }}>
      <div style={{
        width: 38, height: 38, background: NEON_DIM, borderRadius: 10,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize: 20 }}>📊</span>
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 9, color: TEXT_MUTED, letterSpacing: 2, marginBottom: 5, fontWeight: 700, textTransform: "uppercase" }}>Daily Confidence</div>
        <div style={{ fontSize: 34, fontWeight: 900, color, lineHeight: 1 }}>
          {score}<span style={{ fontSize: 14, color: TEXT_MUTED }}>/10</span>
        </div>
      </div>
      <div style={{ width: "100%", height: 4, background: BG_CARD2, borderRadius: 4 }}>
        <div style={{
          width: `${(score / 10) * 100}%`, height: "100%",
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          borderRadius: 4, boxShadow: `0 0 8px ${color}66`,
          transition: "width 1s ease",
        }} />
      </div>
    </div>
  );
}

// ─── SIDE PANEL ───────────────────────────────────────────────────────────────
function SidePanel({ news }) {
  const highImpact = news.filter(n => n.impact === "high");
  const trending = news.filter(n => n.sentiment === "bullish").slice(0, 3);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, position: "sticky", top: 80 }}>
      {/* High Impact */}
      <div style={{ background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "18px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <span style={{ fontSize: 13 }}>⚡</span>
          <span style={{ fontSize: 10, color: "#ff8c00", fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" }}>High Impact</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {highImpact.map(item => (
            <div key={item.id} style={{ borderLeft: "2px solid #ff8c00", paddingLeft: 12 }}>
              <p style={{ fontSize: 12.5, color: "#d5d5d5", lineHeight: 1.4, margin: "0 0 4px", fontWeight: 600 }}>{item.title}</p>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <span style={{ fontSize: 10, color: TEXT_MUTED }}>{item.source}</span>
                <span style={{ fontSize: 10, color: BORDER2 }}>·</span>
                <span style={{ fontSize: 10, color: TEXT_MUTED }}>{item.publishedAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Bullish */}
      <div style={{ background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "18px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <span style={{ fontSize: 13 }}>🔥</span>
          <span style={{ fontSize: 10, color: NEON, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" }}>Trending Bullish</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {trending.map((item, i) => (
            <div key={item.id} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ fontSize: 18, fontWeight: 900, color: "#1a2a1a", lineHeight: 1, minWidth: 18 }}>0{i + 1}</span>
              <div>
                <p style={{ fontSize: 12.5, color: "#d5d5d5", lineHeight: 1.4, margin: "0 0 4px", fontWeight: 600 }}>{item.title}</p>
                <div style={{ display: "flex", gap: 5 }}>
                  {item.tags.map(t => (
                    <span key={t} style={{
                      fontSize: 9, background: BG_CARD2, color: TEXT_MUTED,
                      border: `1px solid ${BORDER}`, padding: "1px 6px", borderRadius: 3, fontWeight: 600,
                    }}>#{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Source Reliability */}
      <div style={{ background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "18px 16px" }}>
        <div style={{ marginBottom: 14 }}>
          <span style={{ fontSize: 10, color: TEXT_MUTED, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" }}>Source Reliability</span>
        </div>
        {[
          { name: "RBI Official", score: 99 },
          { name: "BSE Filing", score: 97 },
          { name: "Reuters", score: 94 },
          { name: "SEBI Circular", score: 100 },
        ].map(src => {
          const c = src.score >= 95 ? NEON : "#f5c518";
          return (
            <div key={src.name} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 12, color: "#bbbbbb", fontWeight: 500 }}>{src.name}</span>
                <span style={{ fontSize: 12, color: c, fontWeight: 800 }}>{src.score}%</span>
              </div>
              <div style={{ height: 3, background: BG_CARD2, borderRadius: 3 }}>
                <div style={{
                  width: `${src.score}%`, height: "100%",
                  background: `linear-gradient(90deg, ${c}66, ${c})`,
                  borderRadius: 3, boxShadow: `0 0 4px ${c}44`,
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── AI INSIGHT BANNER ────────────────────────────────────────────────────────
function AIInsightBanner() {
  const [insight, setInsight] = useState("Markets are showing steady momentum today. RBI's stable stance and strong Q3 earnings from major companies signal a healthy environment for long-term investors.");
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 80,
          system: "You are a friendly market commentator for everyday Indian retail investors. Write ONE sentence (max 25 words) in very simple terms.",
          messages: [{ role: "user", content: "Give today's market insight for retail investors." }],
        }),
      });
      const data = await res.json();
      setInsight(data.content?.[0]?.text || insight);
    } catch { }
    finally { setLoading(false); }
  };

  return (
    <div style={{
      background: `linear-gradient(90deg, ${NEON_DIM} 0%, transparent 100%)`,
      border: `1px solid ${NEON_BORDER}`,
      borderLeft: `3px solid ${NEON}`,
      borderRadius: 12, padding: "14px 20px",
      display: "flex", alignItems: "center",
      justifyContent: "space-between", gap: 16, marginBottom: 22,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{
          width: 34, height: 34, background: NEON_DIM, borderRadius: 9,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          boxShadow: `0 0 12px ${NEON}22`,
        }}>
          <span style={{ fontSize: 17, color: NEON }}>✦</span>
        </div>
        <div>
          <div style={{ fontSize: 9, color: NEON, letterSpacing: 2.5, marginBottom: 4, fontWeight: 800, textTransform: "uppercase" }}>Today's Market Insight</div>
          {loading ? (
            <div style={{ display: "flex", gap: 5, alignItems: "center", height: 20 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: NEON, animation: `bounce 0.8s ${i * 0.15}s infinite` }} />
              ))}
            </div>
          ) : (
            <p style={{ fontSize: 13.5, color: "#d5d5d5", margin: 0, lineHeight: 1.5 }}>{insight}</p>
          )}
        </div>
      </div>
      <button onClick={refresh} style={{
        background: NEON_DIM, border: `1px solid ${NEON_BORDER}`,
        color: NEON, borderRadius: 8, padding: "7px 16px",
        fontSize: 11, cursor: "pointer", whiteSpace: "nowrap",
        transition: "all 0.2s", flexShrink: 0, fontWeight: 700,
      }}>↺ Refresh</button>
    </div>
  );
}

// ─── FILTER BAR ───────────────────────────────────────────────────────────────
function FilterBar({ active, setActive, search, setSearch }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 22, flexWrap: "wrap" }}>
      <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
        <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: TEXT_MUTED, fontSize: 15 }}>⌕</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search company, stock, sector..."
          style={{
            width: "100%", background: BG_CARD, border: `1px solid ${BORDER2}`,
            borderRadius: 10, padding: "10px 14px 10px 38px",
            color: TEXT_PRIMARY, fontSize: 13, outline: "none", transition: "border-color 0.2s",
          }}
          onFocus={e => e.target.style.borderColor = NEON_BORDER}
          onBlur={e => e.target.style.borderColor = BORDER2}
        />
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {FILTERS.map(f => {
          const isActive = active === f;
          return (
            <button key={f} onClick={() => setActive(f)} style={{
              padding: "8px 16px", borderRadius: 8,
              border: `1px solid ${isActive ? NEON_BORDER : BORDER}`,
              background: isActive ? NEON_DIM : "transparent",
              color: isActive ? NEON : TEXT_MUTED,
              fontSize: 12, cursor: "pointer", transition: "all 0.15s", fontWeight: isActive ? 700 : 500,
            }}>{f}</button>
          );
        })}
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export function Markets() {
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [news, setNews] = useState([]);

  useEffect(() => {
    const t = setTimeout(() => { setNews(NEWS_DATA); setLoading(false); }, 1200);
    return () => clearTimeout(t);
  }, []);

  const featured = news.find(n => n.featured);
  const filtered = news.filter(n => {
    const matchFilter =
      activeFilter === "All" ? true :
      activeFilter === "Bullish" ? n.sentiment === "bullish" :
      activeFilter === "Bearish" ? n.sentiment === "bearish" :
      activeFilter === "Neutral" ? n.sentiment === "neutral" :
      activeFilter === "High Impact" ? n.impact === "high" : true;
    const matchSearch = search === "" || n.title.toLowerCase().includes(search.toLowerCase()) || n.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchFilter && matchSearch && !n.featured;
  });

  return (
    <div style={{ color: TEXT_PRIMARY, fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        @keyframes glow-pulse { 0%,100%{box-shadow:0 0 6px ${NEON}88} 50%{box-shadow:0 0 16px ${NEON}} }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes fadeSlideUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        input::placeholder { color: ${TEXT_MUTED}; }
      `}</style>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 12px" }}>
        {/* ── PAGE HEADER ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 10, color: TEXT_MUTED, letterSpacing: 3, marginBottom: 7, fontWeight: 700, textTransform: "uppercase" }}>Live Intelligence</div>
            <h1 style={{ fontSize: 36, fontWeight: 900, color: TEXT_PRIMARY, letterSpacing: -0.5, lineHeight: 1 }}>
              Market News
              <span style={{ color: NEON, textShadow: `0 0 24px ${NEON}55` }}> ·</span>
            </h1>
            <p style={{ fontSize: 13, color: TEXT_MUTED, marginTop: 8 }}>Simplified for everyday investors</p>
          </div>
          <LiveBadge />
        </div>

        {/* ── AI INSIGHT BANNER ── */}
        <AIInsightBanner />

        {/* ── FILTER BAR ── */}
        <FilterBar active={activeFilter} setActive={setActiveFilter} search={search} setSearch={setSearch} />

        {/* ── CONTENT GRID ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>

          {/* LEFT: News Feed */}
          <div>
            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <SkeletonCard />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <SkeletonCard /><SkeletonCard />
                </div>
              </div>
            ) : news.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 20px" }}>
                <div style={{ fontSize: 44, marginBottom: 14, opacity: 0.3 }}>📭</div>
                <p style={{ fontSize: 16, color: TEXT_MUTED }}>No news found matching your filters.</p>
              </div>
            ) : (
              <>
                {/* Featured */}
                {featured && activeFilter === "All" && search === "" && (
                  <div style={{ marginBottom: 16 }}>
                    <FeaturedCard item={featured} />
                  </div>
                )}

                {/* Cards Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  {filtered.map((item, i) => (
                    <SmallCard key={item.id} item={item} index={i} />
                  ))}
                </div>

                {/* Bottom row */}
                {activeFilter === "All" && search === "" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 14, marginTop: 14 }}>
                    <WeeklyPulseCard />
                    <div style={{ width: 155 }}><ConfidenceCard /></div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* RIGHT: Side Panel */}
          <div>
            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <SkeletonCard /><SkeletonCard />
              </div>
            ) : (
              <SidePanel news={news} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}