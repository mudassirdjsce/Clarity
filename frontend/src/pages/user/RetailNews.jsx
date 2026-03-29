import { useState, useEffect } from "react";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import { fetchRetailNews } from "../../services/api";
import { useTranslation } from "react-i18next";

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

// ─── MOCK FALLBACK DATA ───────────────────────────────────────────────────────
const MOCK_NEWS = [
  { id: 1, title: "Fed Keeps Rates Same", summary: "The Federal Reserve voted to hold the federal funds rate steady, signaling a stable economic environment.", sentiment: "neutral", impact: "high", credibilityScore: 98, source: "Reuters", publishedAt: "2 min ago", tags: ["GLOBAL MARKETS", "Economy"], relatedAssets: ["NIFTY 50", "USD/INR", "Gold"], featured: true, sparkData: [4, 5, 4.8, 5.2, 4.9, 5.1, 5.0, 5.3, 5.1, 5.4] },
  { id: 2, title: "Chip Stocks Surge on AI Demand", summary: "Global semiconductor stocks rallied strongly as demand from AI data centres hit record highs.", sentiment: "bullish", impact: "high", credibilityScore: 91, source: "Bloomberg", publishedAt: "15 min ago", tags: ["TECH SECTOR"], relatedAssets: ["NVIDIA", "Infosys", "HCL Tech"], featured: false, sparkData: [3.2, 3.8, 4.1, 3.9, 4.5, 4.8, 5.2, 5.6, 5.9, 6.2] },
  { id: 3, title: "Gold Prices Reach Record Highs", summary: "Gold surpassed ₹2,400/oz as global uncertainty pushed investors toward safe-haven assets.", sentiment: "neutral", impact: "medium", credibilityScore: 95, source: "CNBC", publishedAt: "2 min ago", tags: ["INSIGHT", "Commodities"], relatedAssets: ["Gold ETF", "Sovereign Gold Bond"], featured: false, sparkData: [5.1, 5.3, 5.5, 5.4, 5.7, 5.9, 6.1, 6.0, 6.3, 6.5] },
  { id: 4, title: "RBI Holds Repo Rate at 6.5%", summary: "The Reserve Bank of India held the repo rate for the seventh consecutive time, relieving borrowers.", sentiment: "bullish", impact: "high", credibilityScore: 99, source: "RBI Official", publishedAt: "1 hr ago", tags: ["INDIA MACRO"], relatedAssets: ["Bank Nifty", "HDFC Bank", "SBI"], featured: false, sparkData: [4.8, 4.9, 5.1, 5.0, 5.2, 5.4, 5.3, 5.5, 5.6, 5.8] },
  { id: 5, title: "Reliance Q3 Profit Jumps 11%", summary: "RIL reported Q3 net profit of ₹21,930 crore, beating analyst estimates on Jio and Retail strength.", sentiment: "bullish", impact: "medium", credibilityScore: 97, source: "BSE Filing", publishedAt: "3 hr ago", tags: ["EARNINGS", "Large Cap"], relatedAssets: ["RELIANCE", "Nifty 50"], featured: false, sparkData: [3.5, 3.7, 4.0, 3.9, 4.2, 4.4, 4.6, 4.5, 4.8, 5.0] },
  { id: 6, title: "SEBI Tightens F&O Rules for Retail", summary: "SEBI's new F&O framework limits weekly expiry contracts and increases margin requirements.", sentiment: "neutral", impact: "medium", credibilityScore: 100, source: "SEBI Circular", publishedAt: "5 hr ago", tags: ["REGULATORY"], relatedAssets: ["Nifty Options", "Bank Nifty Options"], featured: false, sparkData: [5.0, 4.8, 4.6, 4.7, 4.5, 4.6, 4.4, 4.5, 4.3, 4.4] },
];

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

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function normalizeArticle(raw, idx) {
  return {
    id: raw._id || raw.id || idx,
    title: raw.title || "Untitled",
    summary: raw.summary || "",
    sentiment: raw.sentiment || "neutral",
    impact: raw.impact || "low",
    credibilityScore: raw.credibilityScore ?? 70,
    source: raw.source || "Unknown",
    publishedAt: raw.publishedAt
      ? new Date(raw.publishedAt).toLocaleString("en-IN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" })
      : raw.publishedAt || "",
    tags: raw.tags || [],
    relatedAssets: raw.relatedAssets || [],
    featured: idx === 0,
    sparkData: [4, 4.5, 4.2, 4.8, 5.0, 4.7, 5.2, 5.1, 5.4, 5.3],
  };
}

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────
function LiveBadge({ live }) {
  const { t } = useTranslation();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7, background: NEON_DIM, border: `1px solid ${NEON_BORDER}`, borderRadius: 20, padding: "5px 14px" }}>
      <div style={{ width: 7, height: 7, borderRadius: "50%", background: live ? NEON : "#555", boxShadow: live ? `0 0 8px ${NEON}` : "none", animation: live ? "glow-pulse 2s infinite" : "none" }} />
      <span style={{ fontSize: 11, color: live ? NEON : "#555", fontWeight: 700, letterSpacing: 1 }}>{live ? t('live_scanning') : t('offline_cached')}</span>
    </div>
  );
}

function SentimentBadge({ sentiment, size = "sm" }) {
  const cfg = MARKET_FEELING_MAP[sentiment] || MARKET_FEELING_MAP.neutral;
  const isLg = size === "lg";
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 20, padding: isLg ? "5px 14px" : "3px 10px" }}>
      <span style={{ color: cfg.color, fontSize: isLg ? 15 : 12, fontWeight: 800 }}>{cfg.icon}</span>
      <span style={{ color: cfg.color, fontSize: isLg ? 13 : 11, fontWeight: 700 }}>{cfg.label}</span>
    </div>
  );
}

function ImpactTag({ impact }) {
  const cfg = IMPACT_MAP[impact] || IMPACT_MAP.low;
  return <span style={{ fontSize: 10, letterSpacing: 1.2, padding: "3px 9px", borderRadius: 4, background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color, fontWeight: 800 }}>{cfg.label}</span>;
}

function CategoryTag({ label }) {
  return <span style={{ fontSize: 10, letterSpacing: 1.5, padding: "3px 10px", borderRadius: 4, background: NEON_DIM, border: `1px solid ${NEON_BORDER}`, color: NEON, fontWeight: 700 }}>{label}</span>;
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
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} fill={`url(#sg-${color.replace("#", "")})`} dot={false} />
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
    </div>
  );
}

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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <CategoryTag label={item.tags?.[0] || "NEWS"} />
        <span style={{ fontSize: 11, color: TEXT_MUTED }}>{item.publishedAt}</span>
      </div>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: hovered ? "#ffffff" : "#e8e8e8", lineHeight: 1.4, marginBottom: 10, transition: "color 0.2s" }}>
        {item.title}
      </h3>
      <div style={{ marginBottom: 10 }}>
        <SparkLine data={item.sparkData} color={sparkColor} />
      </div>
      <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 12 }}>{item.summary}</p>
      {expanded && (
        <div style={{ background: "rgba(0,0,0,0.4)", border: `1px solid ${BORDER2}`, borderRadius: 8, padding: "12px 14px", marginBottom: 12 }}>
          {item.relatedAssets?.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 8 }}>
              {item.relatedAssets.map(a => (
                <span key={a} style={{ fontSize: 10, background: NEON_DIM, color: NEON, border: `1px solid ${NEON_BORDER}`, padding: "2px 8px", borderRadius: 4, fontWeight: 700 }}>{a}</span>
              ))}
            </div>
          )}
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <SentimentBadge sentiment={item.sentiment} />
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: (item.credibilityScore || 70) >= 90 ? NEON : "#f5c518", fontWeight: 700 }}>✓ {item.credibilityScore || 70}%</span>
          <ImpactTag impact={item.impact} />
        </div>
      </div>
    </div>
  );
}

function SidePanel({ news }) {
  const { t } = useTranslation();
  const highImpact = news.filter(n => n.impact === "high");
  const trending = news.filter(n => n.sentiment === "bullish").slice(0, 3);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, position: "sticky", top: 80 }}>
      <div style={{ background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "18px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <span>⚡</span>
          <span style={{ fontSize: 10, color: "#ff8c00", fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" }}>{t('high_impact')}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {highImpact.slice(0, 4).map(item => (
            <div key={item.id} style={{ borderLeft: "2px solid #ff8c00", paddingLeft: 12 }}>
              <p style={{ fontSize: 12.5, color: "#d5d5d5", lineHeight: 1.4, margin: "0 0 4px", fontWeight: 600 }}>{item.title}</p>
              <span style={{ fontSize: 10, color: TEXT_MUTED }}>{item.source} · {item.publishedAt}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "18px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <span>🔥</span>
          <span style={{ fontSize: 10, color: NEON, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" }}>{t('trending_bullish')}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {trending.map((item, i) => (
            <div key={item.id} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ fontSize: 18, fontWeight: 900, color: "#1a2a1a", lineHeight: 1, minWidth: 18 }}>0{i + 1}</span>
              <div>
                <p style={{ fontSize: 12.5, color: "#d5d5d5", lineHeight: 1.4, margin: "0 0 4px", fontWeight: 600 }}>{item.title}</p>
                <div style={{ display: "flex", gap: 5 }}>
                  {(item.tags || []).slice(0, 2).map(tag => (
                    <span key={tag} style={{ fontSize: 9, background: BG_CARD2, color: TEXT_MUTED, border: `1px solid ${BORDER}`, padding: "1px 6px", borderRadius: 3, fontWeight: 600 }}>#{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FilterBar({ active, setActive, search, setSearch }) {
  const { t } = useTranslation();
  const FILTER_KEYS = [
    { key: 'filter_all', value: 'All' },
    { key: 'filter_bullish', value: 'Bullish' },
    { key: 'filter_bearish', value: 'Bearish' },
    { key: 'filter_neutral', value: 'Neutral' },
    { key: 'filter_high_impact', value: 'High Impact' },
  ];
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 22, flexWrap: "wrap" }}>
      <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
        <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: TEXT_MUTED, fontSize: 15 }}>⎕</span>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder={t('search_news')}
          style={{ width: "100%", background: BG_CARD, border: `1px solid ${BORDER2}`, borderRadius: 10, padding: "10px 14px 10px 38px", color: TEXT_PRIMARY, fontSize: 13, outline: "none" }}
          onFocus={e => e.target.style.borderColor = NEON_BORDER}
          onBlur={e => e.target.style.borderColor = BORDER2}
        />
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {FILTER_KEYS.map(f => (
          <button key={f.value} onClick={() => setActive(f.value)} style={{
            padding: "8px 16px", borderRadius: 8,
            border: `1px solid ${active === f.value ? NEON_BORDER : BORDER}`,
            background: active === f.value ? NEON_DIM : "transparent",
            color: active === f.value ? NEON : TEXT_MUTED,
            fontSize: 12, cursor: "pointer", transition: "all 0.15s", fontWeight: active === f.value ? 700 : 500,
          }}>{t(f.key)}</button>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function RetailNews() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [news, setNews] = useState([]);
  const [isLive, setIsLive] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchRetailNews();
        if (Array.isArray(data) && data.length > 0) {
          setNews(data.map(normalizeArticle));
          setIsLive(true);
        } else {
          setNews(MOCK_NEWS);
        }
      } catch {
        // Backend not running — fall back to mock
        setNews(MOCK_NEWS);
        setIsLive(false);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = news.filter(n => {
    const matchFilter =
      activeFilter === "All" ? true :
      activeFilter === "Bullish" ? n.sentiment === "bullish" :
      activeFilter === "Bearish" ? n.sentiment === "bearish" :
      activeFilter === "Neutral" ? n.sentiment === "neutral" :
      activeFilter === "High Impact" ? n.impact === "high" : true;
    const matchSearch = search === "" || n.title.toLowerCase().includes(search.toLowerCase()) || (n.tags || []).some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchFilter && matchSearch && !n.featured;
  });

  const featured = news.find(n => n.featured);

  return (
    <div style={{ background: BG_BASE, minHeight: "100vh", color: TEXT_PRIMARY, fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes glow-pulse { 0%,100%{box-shadow:0 0 6px ${NEON}88} 50%{box-shadow:0 0 16px ${NEON}} }
        @keyframes fadeSlideUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        input::placeholder { color: ${TEXT_MUTED}; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #050505; }
        ::-webkit-scrollbar-thumb { background: #1e1e1e; border-radius: 4px; }
      `}</style>

      {/* HEADER */}
      <header style={{ background: "rgba(0,0,0,0.96)", borderBottom: `1px solid ${BORDER}`, backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center", height: 58 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: NEON, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 900, color: "#000", boxShadow: `0 0 12px ${NEON}55` }}>C</div>
            <span style={{ fontSize: 15, fontWeight: 800, color: TEXT_PRIMARY }}>Clarity</span>
            <span style={{ color: BORDER2 }}>|</span>
            <span style={{ fontSize: 12, color: TEXT_MUTED }}>Retail News</span>
          </div>
          <LiveBadge live={isLive} />
        </div>
      </header>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 24px" }}>
        {/* Page Title */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 10, color: TEXT_MUTED, letterSpacing: 3, marginBottom: 7, fontWeight: 700, textTransform: "uppercase" }}>{isLive ? t('live_mongodb') : t('cached_backend')}</div>
          <h1 style={{ fontSize: 36, fontWeight: 900, color: TEXT_PRIMARY, letterSpacing: -0.5, lineHeight: 1 }}>
            {t('news_title')} <span style={{ color: NEON, textShadow: `0 0 24px ${NEON}55` }}>·</span>
          </h1>
          <p style={{ fontSize: 13, color: TEXT_MUTED, marginTop: 8 }}>{t('news_sub')}</p>
        </div>

        {/* Filter Bar */}
        <FilterBar active={activeFilter} setActive={setActiveFilter} search={search} setSearch={setSearch} />

        {/* Content */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>
          <div>
            {loading ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
              </div>
            ) : (
              <>
                {featured && activeFilter === "All" && search === "" && (
                  <div style={{
                    background: BG_CARD, border: `1px solid ${NEON_BORDER}`, borderLeft: `3px solid ${NEON}`,
                    borderRadius: 14, padding: "22px 22px", marginBottom: 16,
                    position: "relative", overflow: "hidden",
                  }}>
                    <div style={{ position: "absolute", top: 10, right: 14, fontSize: 10, fontWeight: 800, color: NEON, background: NEON_DIM, border: `1px solid ${NEON_BORDER}`, padding: "3px 10px", borderRadius: 20 }}>FEATURED</div>
                    <CategoryTag label={featured.tags?.[0] || "NEWS"} />
                    <h2 style={{ fontSize: 22, fontWeight: 800, color: TEXT_PRIMARY, lineHeight: 1.35, margin: "14px 0 12px", maxWidth: "88%" }}>{featured.title}</h2>
                    <p style={{ fontSize: 14, color: TEXT_SECONDARY, lineHeight: 1.65, marginBottom: 16 }}>{featured.summary}</p>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <SentimentBadge sentiment={featured.sentiment} size="lg" />
                      <ImpactTag impact={featured.impact} />
                      <span style={{ fontSize: 11, color: TEXT_MUTED, marginLeft: "auto" }}>{featured.source} · {featured.publishedAt}</span>
                    </div>
                  </div>
                )}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  {filtered.map((item, i) => <SmallCard key={item.id} item={item} index={i} />)}
                </div>
                {filtered.length === 0 && (
                  <div style={{ textAlign: "center", padding: "60px 20px" }}>
                    <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.3 }}>💭</div>
                    <p style={{ fontSize: 14, color: TEXT_MUTED }}>{t('no_news')}</p>
                  </div>
                )}
              </>
            )}
          </div>
          <div>
            {loading ? <><SkeletonCard /><div style={{ marginTop: 14 }}><SkeletonCard /></div></> : <SidePanel news={news} />}
          </div>
        </div>
      </div>
    </div>
  );
}
