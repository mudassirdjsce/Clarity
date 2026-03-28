// ── Hardcoded mock data for the Financial Wrapped experience ──────────────────

export const wrappedData = {
  year: 2026,

  // Slide 2 – Portfolio Overview
  totalInvestment: "₹2,50,000",
  portfolioValue:  "₹2,80,400",
  growth:          "+12.2%",
  growthAmount:    "+₹30,400",

  // Slide 3 – Top Sector
  topSector: "Information Technology",
  topSectorShort: "IT",
  sectorBreakdown: [
    { name: "IT",           pct: 42, color: "#39ff14" },
    { name: "Banking",      pct: 24, color: "#38bdf8" },
    { name: "Pharma",       pct: 18, color: "#f43f5e" },
    { name: "Real Estate",  pct: 10, color: "#f7931a" },
    { name: "Others",       pct: 6,  color: "#555555" },
  ],

  // Slide 4 – Risk Profile
  riskProfile: "Moderate",
  riskScore: 52,            // out of 100
  riskLabel: "You balance growth and safety",

  // Slide 5 – Most Active Asset
  topStock:       "TCS",
  topStockFull:   "Tata Consultancy Services",
  timesChecked:   47,
  stockGrowth:    "+18.3%",

  // Slide 6 – Behavior Insight
  behaviors: [
    "You prefer stable, dividend-paying stocks",
    "You avoided high-volatility assets in Q1",
    "You invested consistently every month",
  ],

  // Slide 7 – AI Insight
  aiInsight:
    "You showed balanced investment behavior this year — maximizing yield while keeping drawdown under control. Your discipline sets you apart from 78% of investors.",

  // Slide 8 – Final
  finalMessage: "Every rupee invested is a step closer to financial freedom.",
  ctaLabel: "Go to Dashboard",
};
