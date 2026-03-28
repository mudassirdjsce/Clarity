// ── Base URL ─────────────────────────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ── Generic fetch helper ─────────────────────────────────────────────────────
const apiFetch = async (path, params = {}) => {
  const url = new URL(`${BASE_URL}${path}`);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "" && v !== "all") url.searchParams.set(k, v);
  });

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
};

// ── News ─────────────────────────────────────────────────────────────────────

/**
 * Fetch news for retail users (simplified fields).
 * @param {{ sentiment?: string, impact?: string, search?: string }} filters
 */
export const fetchRetailNews = (filters = {}) =>
  apiFetch("/news", { mode: "retail", ...filters });

/**
 * Fetch full news for institution users (all fields).
 * @param {{ sentiment?: string, impact?: string, credibility?: string, search?: string }} filters
 */
export const fetchInstitutionNews = (filters = {}) =>
  apiFetch("/news", { mode: "institution", ...filters });

// ── Insights ─────────────────────────────────────────────────────────────────

/**
 * Fetch AI-generated market insights.
 */
export const fetchInsights = () => apiFetch("/insights");

// ── Health ───────────────────────────────────────────────────────────────────
export const checkHealth = () => apiFetch("/health");
