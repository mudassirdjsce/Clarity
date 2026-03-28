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

// ── User Goals ───────────────────────────────────────────────────────────────
export const fetchUserGoals = (email) => apiFetch("/auth/goals", { email });
export const addUserGoal = (payload) => apiPost("/auth/goals", payload);
export const addGoalFunds = (payload) => apiPost("/auth/goals/add-funds", payload);
export const deleteUserGoal = (id) => apiDelete(`/auth/goals/${id}`);

// ── Events & Festivals ───────────────────────────────────────────────────────
export const fetchUserFestivals = (email) => apiFetch("/auth/festivals", { email });
export const addUserFestival = (payload) => apiPost("/auth/festivals", payload);
export const addFestivalExpense = (id, payload) => apiPost(`/auth/festivals/${id}/expenses`, payload);
export const deleteUserFestival = (id) => apiDelete(`/auth/festivals/${id}`);

// ── Bank Accounts ─────────────────────────────────────────────────────────────
export const fetchBankAccounts = (email) => apiFetch("/auth/bank-accounts", { email });
export const connectBankAccount = (payload) => apiPost("/auth/bank-accounts/connect", payload);

// ── Health ───────────────────────────────────────────────────────────────────
export const checkHealth = () => apiFetch("/health");

// ── Auth ─────────────────────────────────────────────────────────────────────
const apiPost = async (path, body) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
};

const apiDelete = async (path) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
};

export const signup = (payload) => apiPost("/auth/signup", payload);
export const login  = (payload) => apiPost("/auth/login", payload);

// ── Token helpers ─────────────────────────────────────────────────────────────
export const saveSession = ({ token, user }) => {
  localStorage.setItem("clarity_token", token);
  localStorage.setItem("clarity_user", JSON.stringify(user));
};

export const getSession = () => {
  const user = localStorage.getItem("clarity_user");
  return { token: localStorage.getItem("clarity_token"), user: user ? JSON.parse(user) : null };
};

export const clearSession = () => {
  localStorage.removeItem("clarity_token");
  localStorage.removeItem("clarity_user");
};
