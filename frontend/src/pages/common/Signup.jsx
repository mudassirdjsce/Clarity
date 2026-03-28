import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../../services/api";

// ── Theme ─────────────────────────────────────────────────────────────────────
const NEON = "#39FF14";
const NEON_DIM = "rgba(57,255,20,0.10)";
const NEON_BORDER = "rgba(57,255,20,0.28)";
const BG = "#000000";
const CARD = "#0a0a0a";
const BORDER = "#1c1c1c";
const BORDER2 = "#2a2a2a";
const TEXT = "#ffffff";
const MUTED = "#555555";
const SUB = "#a0a0a0";

const inputStyle = (focused) => ({
  width: "100%",
  background: "#0d0d0d",
  border: `1px solid ${focused ? NEON_BORDER : BORDER2}`,
  borderRadius: 10,
  padding: "13px 16px",
  color: TEXT,
  fontSize: 14,
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  boxShadow: focused ? `0 0 0 3px rgba(57,255,20,0.06)` : "none",
  fontFamily: "inherit",
});

const labelStyle = {
  fontSize: 12, fontWeight: 700, color: SUB,
  letterSpacing: 0.5, marginBottom: 6, display: "block",
};

// ── Password strength ─────────────────────────────────────────────────────────
const getStrength = (pw) => {
  if (!pw) return { score: 0, label: "", color: MUTED };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  const levels = [
    { score: 1, label: "Weak", color: "#ff4444" },
    { score: 2, label: "Fair", color: "#f5c518" },
    { score: 3, label: "Good", color: "#88c8ff" },
    { score: 4, label: "Strong", color: NEON },
  ];
  return levels[score - 1] || { score: 0, label: "", color: MUTED };
};

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [role, setRole] = useState("user");
  const [focused, setFocused] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const strength = getStrength(form.password);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await signup({ ...form, role });
      navigate("/login", { state: { message: "Account created successfully! Please sign in." } });
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: BG, display: "flex",
      alignItems: "center", justifyContent: "center",
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      padding: "24px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: #404040; }
        @keyframes glow-pulse { 0%,100%{box-shadow:0 0 8px ${NEON}66} 50%{box-shadow:0 0 20px ${NEON}99} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Background grid */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: `radial-gradient(circle at 1px 1px, #1a1a1a 1px, transparent 0)`, backgroundSize: "32px 32px", opacity: 0.4, pointerEvents: "none" }} />

      {/* Ambient glow */}
      <div style={{ position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)", width: 500, height: 500, background: `radial-gradient(circle, ${NEON}06 0%, transparent 70%)`, pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 460, animation: "fadeUp 0.4s ease both", position: "relative" }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: NEON,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 900, color: "#000",
            boxShadow: `0 0 16px ${NEON}55, 0 0 40px ${NEON}22`,
            animation: "glow-pulse 3s ease infinite",
          }}>C</div>
          <span style={{ fontSize: 20, fontWeight: 900, color: TEXT, letterSpacing: -0.5 }}>Clarity</span>
          <span style={{ fontSize: 11, color: MUTED, marginLeft: 4, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Finance</span>
        </div>

        {/* Card */}
        <div style={{
          background: CARD, border: `1px solid ${BORDER}`,
          borderRadius: 18, padding: "32px 32px 28px",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
        }}>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: TEXT, letterSpacing: -0.5, marginBottom: 6 }}>
            Create your account
          </h1>
          <p style={{ fontSize: 13, color: MUTED, marginBottom: 28 }}>
            Join Clarity and get AI-powered market intelligence
          </p>

          {/* Role Switcher */}
          <div style={{ display: "flex", background: "#080808", border: `1px solid ${BORDER}`, borderRadius: 10, padding: 4, marginBottom: 24, gap: 4 }}>
            {[
              { value: "user", label: "📰 Retail Investor", sub: "Individual · /user" },
              { value: "company", label: "🏦 Institution", sub: "Professional · /company" },
            ].map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}
                style={{
                  flex: 1, padding: "10px 8px", borderRadius: 7,
                  border: role === r.value ? `1px solid ${NEON_BORDER}` : "1px solid transparent",
                  background: role === r.value ? NEON_DIM : "transparent",
                  color: role === r.value ? NEON : MUTED,
                  fontSize: 12, fontWeight: 700, cursor: "pointer",
                  transition: "all 0.2s", fontFamily: "inherit",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                }}
              >
                <span>{r.label}</span>
                <span style={{ fontSize: 10, opacity: 0.7 }}>{r.sub}</span>
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: "rgba(255,68,68,0.08)", border: "1px solid rgba(255,68,68,0.25)", borderRadius: 8, padding: "10px 14px", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14 }}>⚠</span>
              <span style={{ fontSize: 13, color: "#ff6666", fontWeight: 500 }}>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Name */}
              <div>
                <label style={labelStyle}>Full Name</label>
                <input
                  name="name" type="text" required
                  value={form.name} onChange={handleChange}
                  placeholder="John Doe"
                  style={inputStyle(focused.name)}
                  onFocus={() => setFocused(f => ({ ...f, name: true }))}
                  onBlur={() => setFocused(f => ({ ...f, name: false }))}
                />
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle}>Email Address</label>
                <input
                  name="email" type="email" required
                  value={form.email} onChange={handleChange}
                  placeholder="you@example.com"
                  style={inputStyle(focused.email)}
                  onFocus={() => setFocused(f => ({ ...f, email: true }))}
                  onBlur={() => setFocused(f => ({ ...f, email: false }))}
                />
              </div>

              {/* Phone */}
              <div>
                <label style={labelStyle}>Phone Number</label>
                <input
                  name="phone" type="tel" required
                  value={form.phone} onChange={handleChange}
                  placeholder="+91 98765 43210"
                  style={inputStyle(focused.phone)}
                  onFocus={() => setFocused(f => ({ ...f, phone: true }))}
                  onBlur={() => setFocused(f => ({ ...f, phone: false }))}
                />
              </div>

              {/* Password */}
              <div>
                <label style={labelStyle}>Password</label>
                <input
                  name="password" type="password" required
                  value={form.password} onChange={handleChange}
                  placeholder="Min. 6 characters"
                  style={inputStyle(focused.password)}
                  onFocus={() => setFocused(f => ({ ...f, password: true }))}
                  onBlur={() => setFocused(f => ({ ...f, password: false }))}
                />
                {/* Strength bar */}
                {form.password.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} style={{
                          flex: 1, height: 3, borderRadius: 3,
                          background: i <= strength.score ? strength.color : "#1e1e1e",
                          transition: "background 0.3s",
                          boxShadow: i <= strength.score ? `0 0 4px ${strength.color}88` : "none",
                        }} />
                      ))}
                    </div>
                    <span style={{ fontSize: 11, color: strength.color, fontWeight: 700, marginTop: 5, display: "block" }}>
                      {strength.label}
                    </span>
                  </div>
                )}
              </div>

              {/* Role badge preview */}
              <div style={{
                background: "#080808", border: `1px solid ${BORDER}`,
                borderRadius: 10, padding: "12px 14px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <span style={{ fontSize: 12, color: MUTED }}>Account type</span>
                <span style={{
                  fontSize: 11, fontWeight: 800, color: NEON,
                  background: NEON_DIM, border: `1px solid ${NEON_BORDER}`,
                  padding: "3px 10px", borderRadius: 20, letterSpacing: 0.5,
                }}>
                  {role === "company" ? "INSTITUTION" : "RETAIL INVESTOR"}
                </span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%", padding: "13px", borderRadius: 10,
                  background: loading ? "rgba(57,255,20,0.4)" : NEON,
                  border: "none", color: "#000",
                  fontSize: 14, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  boxShadow: loading ? "none" : `0 0 20px ${NEON}44`,
                  fontFamily: "inherit", letterSpacing: 0.3,
                  marginTop: 4,
                }}
              >
                {loading ? "Creating account…" : "Create Account →"}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
            <div style={{ flex: 1, height: 1, background: BORDER }} />
            <span style={{ fontSize: 11, color: MUTED, fontWeight: 600 }}>ALREADY HAVE AN ACCOUNT?</span>
            <div style={{ flex: 1, height: 1, background: BORDER }} />
          </div>

          {/* Login link */}
          <Link to="/login" style={{ textDecoration: "none" }}>
            <button style={{
              width: "100%", padding: "13px", borderRadius: 10,
              background: "transparent", border: `1px solid ${BORDER2}`,
              color: SUB, fontSize: 14, fontWeight: 600, cursor: "pointer",
              transition: "all 0.2s", fontFamily: "inherit",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = NEON_BORDER; e.currentTarget.style.color = NEON; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER2; e.currentTarget.style.color = SUB; }}
            >
              Sign In Instead
            </button>
          </Link>
        </div>

        {/* Footer */}
        <p style={{ textAlign: "center", fontSize: 11, color: MUTED, marginTop: 20 }}>
          Market Intelligence · AI-Powered · Real-time Data
        </p>
      </div>
    </div>
  );
}
