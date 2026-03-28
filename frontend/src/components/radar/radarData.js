// ─── Asset class comparison data for the Radar Section ───────────────────────

export const CHART_META = [
  {
    name: "Bitcoin",
    color: "#f7931a",
    icon: "₿",
    description: "Crypto · High volatility · 24/7 market",
  },
  {
    name: "Mutual Funds",
    color: "#38bdf8",
    icon: "MF",
    description: "Diversified · Managed · Stable returns",
  },
  {
    name: "Gold",
    color: "#39ff14",   // neon green — matches project theme
    icon: "Au",
    description: "Safe haven · Inflation hedge · Low risk",
  },
  {
    name: "Futures & Options",
    color: "#f43f5e",
    icon: "F&O",
    description: "Derivatives · Leverage · High complexity",
  },
];

// Radar axes — realistic, lightly differentiated values (55–82 range)
// Based on real asset class characteristics; close-together for natural overlap.
export const RADAR_DATA = [
  {
    metric: "Return Potential",
    "Bitcoin": 78,
    "Mutual Funds": 60,
    "Gold": 52,
    "Futures & Options": 75,
  },
  {
    metric: "Liquidity",
    "Bitcoin": 74,
    "Mutual Funds": 68,
    "Gold": 70,
    "Futures & Options": 72,
  },
  {
    metric: "Stability",
    "Bitcoin": 42,
    "Mutual Funds": 75,
    "Gold": 78,
    "Futures & Options": 38,
  },
  {
    metric: "Inflation Hedge",
    "Bitcoin": 65,
    "Mutual Funds": 52,
    "Gold": 82,
    "Futures & Options": 44,
  },
  {
    metric: "Accessibility",
    "Bitcoin": 72,
    "Mutual Funds": 82,
    "Gold": 70,
    "Futures & Options": 48,
  },
  {
    metric: "Regulatory Safety",
    "Bitcoin": 44,
    "Mutual Funds": 82,
    "Gold": 80,
    "Futures & Options": 58,
  },
  {
    metric: "Leverage",
    "Bitcoin": 55,
    "Mutual Funds": 28,
    "Gold": 22,
    "Futures & Options": 82,
  },
  {
    metric: "Diversification",
    "Bitcoin": 48,
    "Mutual Funds": 85,
    "Gold": 62,
    "Futures & Options": 52,
  },
];
