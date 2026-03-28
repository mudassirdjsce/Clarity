/**
 * Rule-based Risk Calculator
 * Analyzes stock data and portfolio context to produce a risk level.
 */

/**
 * Calculate risk level from stock quote + financials
 * @param {object} quote - { c, d, dp, h, l, o, pc }
 * @param {object} financials - key metrics from Finnhub
 * @returns {{ riskLevel: string, warning: string|null, metrics: object }}
 */
const calculateStockRisk = (quote, financials = {}) => {
  const warnings = [];
  let riskScore = 0; // 0-10: 0-3=low, 4-6=medium, 7-10=high

  // Rule 1: High intraday volatility (H-L spread > 5% of open)
  if (quote && quote.o > 0) {
    const spread = ((quote.h - quote.l) / quote.o) * 100;
    if (spread > 8) { riskScore += 4; warnings.push("Extreme intraday volatility detected"); }
    else if (spread > 4) { riskScore += 2; warnings.push("Elevated intraday price swings"); }
  }

  // Rule 2: Sharp price drop (more than 5% today)
  if (quote && quote.dp !== undefined) {
    const change = Math.abs(quote.dp);
    if (change > 5) { riskScore += 3; warnings.push(`Sharp price movement: ${quote.dp?.toFixed(2)}% today`); }
    else if (change > 2) { riskScore += 1; }
  }

  // Rule 3: Beta (market sensitivity)
  const beta = financials["beta"] || null;
  if (beta !== null) {
    if (beta > 2)  { riskScore += 3; warnings.push(`High beta (${beta}) — very sensitive to market moves`); }
    else if (beta > 1.5) { riskScore += 1; }
  }

  // Rule 4: 52-week range — trading near low
  const w52High = financials["52WeekHigh"] || null;
  const w52Low  = financials["52WeekLow"]  || null;
  if (w52High && w52Low && quote?.c) {
    const rangePos = (quote.c - w52Low) / (w52High - w52Low);
    if (rangePos < 0.15) { riskScore += 2; warnings.push("Price near 52-week low — potential downtrend"); }
  }

  const riskLevel =
    riskScore >= 7 ? "High" :
    riskScore >= 4 ? "Medium" : "Low";

  return {
    riskLevel,
    warning: warnings.length > 0 ? warnings.join(". ") : null,
    metrics: {
      riskScore,
      intradaySpread: quote && quote.o > 0 ? `${(((quote.h - quote.l) / quote.o) * 100).toFixed(2)}%` : "N/A",
      priceChange: quote?.dp !== undefined ? `${quote.dp?.toFixed(2)}%` : "N/A",
      beta: beta !== null ? beta : "N/A",
    },
  };
};

/**
 * Portfolio overexposure check
 * @param {object} allocations - { "Tech": 60, "Energy": 20, ... } percentages
 * @returns {{ overexposed: boolean, warning: string|null }}
 */
const checkPortfolioExposure = (allocations = {}) => {
  const warnings = [];
  for (const [sector, pct] of Object.entries(allocations)) {
    if (pct > 40) warnings.push(`Overexposed to ${sector} (${pct}%) — exceeds 40% threshold`);
  }
  return {
    overexposed: warnings.length > 0,
    warning: warnings.length > 0 ? warnings.join(". ") : null,
  };
};

module.exports = { calculateStockRisk, checkPortfolioExposure };
