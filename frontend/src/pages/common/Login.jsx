import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { login, saveSession } from "../../services/api";
import clarityLogo from "../../assets/CLARITY1.svg";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "../../components/LanguageSwitcher";

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

// ── Shared input style ────────────────────────────────────────────────────────
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
  fontSize: 12,
  fontWeight: 700,
  color: SUB,
  letterSpacing: 0.5,
  marginBottom: 6,
  display: "block",
};

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.message || "";
  const [form, setForm] = useState({ email: "", password: "" });
  const [role, setRole] = useState("user");
  const [focused, setFocused] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login({ ...form, role });
      saveSession(data);
      navigate(data.user.role === "company" ? "/company/dashboard" : "/user/dashboard");
    } catch (err) {
      setError(t('login_failed'));
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

      {/* Fixed language switcher — top right */}
      <div style={{ position: 'fixed', top: 20, right: 24, zIndex: 100 }}>
        <LanguageSwitcher />
      </div>

      {/* Background grid effect */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: `radial-gradient(circle at 1px 1px, #1a1a1a 1px, transparent 0)`, backgroundSize: "32px 32px", opacity: 0.4, pointerEvents: "none" }} />

      {/* Ambient glow */}
      <div style={{ position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)", width: 400, height: 400, background: `radial-gradient(circle, ${NEON}08 0%, transparent 70%)`, pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 440, animation: "fadeUp 0.4s ease both", position: "relative" }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 32 }}>
          <img src={clarityLogo} alt="Clarity" style={{ height: 60, filter: "drop-shadow(0 0 12px rgba(57,255,20,0.5))" }} />
        </div>

        {/* Card */}
        <div style={{
          background: "linear-gradient(145deg, #0a0a0a 0%, #050505 100%)",
          border: `1px solid ${BORDER}`,
          borderRadius: 24, padding: "40px 32px 36px",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 60px rgba(57,255,20,0.03)",
          position: "relative",
          overflow: "hidden"
        }}>
          {/* subtle accent top border highlight */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, #39ff14, transparent)", opacity: 0.3 }} />
          {/* Heading */}
          <h1 style={{ fontSize: 24, fontWeight: 900, color: TEXT, letterSpacing: -0.5, marginBottom: 6 }}>
            {t('login_heading')}
          </h1>
          <p style={{ fontSize: 13, color: MUTED, marginBottom: 28 }}>
            {t('login_subtext')}
          </p>



          {/* Success banner from signup */}
          {successMessage && (
            <div style={{ background: "rgba(57,255,20,0.08)", border: "1px solid rgba(57,255,20,0.28)", borderRadius: 8, padding: "10px 14px", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14 }}>✓</span>
              <span style={{ fontSize: 13, color: "#39FF14", fontWeight: 500 }}>{successMessage}</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{ background: "rgba(255,68,68,0.08)", border: "1px solid rgba(255,68,68,0.25)", borderRadius: 8, padding: "10px 14px", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14 }}>⚠</span>
              <span style={{ fontSize: 13, color: "#ff6666", fontWeight: 500 }}>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

              {/* Email */}
              <div>
                <label style={labelStyle}>{t('email_address')}</label>
                <input
                  name="email" type="email" required
                  value={form.email} onChange={handleChange}
                  placeholder="you@example.com"
                  style={inputStyle(focused.email)}
                  onFocus={() => setFocused(f => ({ ...f, email: true }))}
                  onBlur={() => setFocused(f => ({ ...f, email: false }))}
                />
              </div>

              {/* Password */}
              <div>
                <label style={labelStyle}>{t('password')}</label>
                <input
                  name="password" type="password" required
                  value={form.password} onChange={handleChange}
                  placeholder="••••••••"
                  style={inputStyle(focused.password)}
                  onFocus={() => setFocused(f => ({ ...f, password: true }))}
                  onBlur={() => setFocused(f => ({ ...f, password: false }))}
                />
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
                {loading ? t('signing_in') : t('sign_in')}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
            <div style={{ flex: 1, height: 1, background: BORDER }} />
            <span style={{ fontSize: 11, color: MUTED, fontWeight: 600 }}>{t('new_to_clarity')}</span>
            <div style={{ flex: 1, height: 1, background: BORDER }} />
          </div>

          {/* Signup link */}
          <Link to="/signup" style={{ textDecoration: "none" }}>
            <button style={{
              width: "100%", padding: "13px", borderRadius: 10,
              background: "transparent", border: `1px solid ${BORDER2}`,
              color: SUB, fontSize: 14, fontWeight: 600, cursor: "pointer",
              transition: "all 0.2s", fontFamily: "inherit",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = NEON_BORDER; e.currentTarget.style.color = NEON; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER2; e.currentTarget.style.color = SUB; }}
            >
              {t('create_account')}
            </button>
          </Link>
        </div>

        {/* Footer */}
        <p style={{ textAlign: "center", fontSize: 11, color: MUTED, marginTop: 20 }}>
          {t('market_footer')}
        </p>
      </div>
    </div>
  );
}
