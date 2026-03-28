import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup, verifyOtp, resendOtp, saveSession } from "../../services/api";
import clarityLogo from "../../assets/CLARITY1.svg";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "../../components/LanguageSwitcher";

// ── Theme ─────────────────────────────────────────────────────────────────────
const NEON        = "#39FF14";
const NEON_DIM    = "rgba(57,255,20,0.10)";
const NEON_BORDER = "rgba(57,255,20,0.28)";
const BG          = "#000000";
const BORDER      = "#1c1c1c";
const BORDER2     = "#2a2a2a";
const TEXT        = "#ffffff";
const MUTED       = "#555555";
const SUB         = "#a0a0a0";

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

// ── Animated background globe ─────────────────────────────────────────────────
const AnimatedGlobe = () => (
  <div style={{
    position: 'fixed', top: '50%', left: '50%',
    width: '700px', height: '700px',
    marginLeft: '-350px', marginTop: '-350px',
    perspective: '1000px', pointerEvents: 'none', zIndex: 0, opacity: 0.15,
  }}>
    <div style={{
      width: '100%', height: '100%', position: 'relative',
      transformStyle: 'preserve-3d',
      animation: 'spinGlobe 40s linear infinite',
    }}>
      {[0, 20, 40, 60, 80, 100, 120, 140, 160].map(deg => (
        <div key={`long-${deg}`} style={{
          position: 'absolute', inset: 0,
          border: `1px solid ${NEON}`, borderRadius: '50%',
          transform: `rotateY(${deg}deg)`
        }} />
      ))}
      {[
        { t: -300, s: 0.514 }, { t: -230, s: 0.753 }, { t: -150, s: 0.903 },
        { t: -75,  s: 0.976 }, { t: 0,    s: 1      }, { t: 75,   s: 0.976 },
        { t: 150,  s: 0.903 }, { t: 230,  s: 0.753 }, { t: 300,  s: 0.514 },
      ].map((lat, i) => (
        <div key={`lat-${i}`} style={{
          position: 'absolute', top: '50%', left: '50%',
          width: '700px', height: '700px',
          marginLeft: '-350px', marginTop: '-350px',
          border: `1px solid ${NEON}`, borderRadius: '50%',
          transform: `translateY(${lat.t}px) scale(${lat.s}) rotateX(90deg)`
        }} />
      ))}
    </div>
  </div>
);

// ── Password strength ─────────────────────────────────────────────────────────
const getStrength = (pw) => {
  if (!pw) return { score: 0, label: "", color: MUTED };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  const levels = [
    { score: 1, labelKey: "pw_weak",   color: "#ff4444" },
    { score: 2, labelKey: "pw_fair",   color: "#f5c518" },
    { score: 3, labelKey: "pw_good",   color: "#88c8ff" },
    { score: 4, labelKey: "pw_strong", color: NEON },
  ];
  return levels[score - 1] || { score: 0, labelKey: "", color: MUTED };
};

// ── OTP digit input ───────────────────────────────────────────────────────────
const OTP_LENGTH = 6;

function OtpInput({ value, onChange }) {
  const inputs = useRef([]);

  const digits = value.split("").concat(Array(OTP_LENGTH).fill("")).slice(0, OTP_LENGTH);

  const handleKey = (e, idx) => {
    if (e.key === "Backspace") {
      const next = [...digits];
      if (next[idx]) {
        next[idx] = "";
        onChange(next.join(""));
      } else if (idx > 0) {
        next[idx - 1] = "";
        onChange(next.join(""));
        inputs.current[idx - 1]?.focus();
      }
    }
  };

  const handleChange = (e, idx) => {
    const char = e.target.value.replace(/\D/g, "").slice(-1);
    if (!char) return;
    const next = [...digits];
    next[idx] = char;
    onChange(next.join(""));
    if (idx < OTP_LENGTH - 1) inputs.current[idx + 1]?.focus();
  };

  const handlePaste = (e) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (text) {
      onChange(text.padEnd(OTP_LENGTH, "").slice(0, OTP_LENGTH));
      inputs.current[Math.min(text.length, OTP_LENGTH - 1)]?.focus();
    }
    e.preventDefault();
  };

  return (
    <div style={{ display: "flex", gap: 10, justifyContent: "center" }} onPaste={handlePaste}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={el => inputs.current[i] = el}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={e => handleChange(e, i)}
          onKeyDown={e => handleKey(e, i)}
          style={{
            width: 48, height: 58,
            background: d ? NEON_DIM : "#0d0d0d",
            border: `2px solid ${d ? NEON_BORDER : BORDER2}`,
            borderRadius: 12, textAlign: "center",
            fontSize: 22, fontWeight: 800, color: d ? NEON : TEXT,
            outline: "none", fontFamily: "inherit",
            transition: "all 0.2s",
            boxShadow: d ? `0 0 10px ${NEON}33` : "none",
          }}
        />
      ))}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function Signup() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // ── Step 1: form state ──
  const [form, setForm]   = useState({ name: "", email: "", phone: "", password: "" });
  const [role, setRole]   = useState("user");
  const [focused, setFocused] = useState({});
  const strength = getStrength(form.password);

  // ── Step 2: OTP state ──
  const [step, setStep]     = useState(1);   // 1 = sign-up form, 2 = OTP input
  const [otp, setOtp]       = useState("");
  const [cooldown, setCooldown] = useState(0); // seconds until resend allowed

  // ── Shared state ──
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");

  // ── Countdown timer ──
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  const handleChange = (e) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  // ── Step 1: Submit signup form → send OTP ──
  const handleSignup = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (form.password.length < 6) {
      setError(t("pw_too_short"));
      return;
    }
    setLoading(true);
    try {
      const data = await signup({ ...form, role });
      setSuccess(data.message || "OTP sent! Check your inbox.");
      setStep(2);
      setCooldown(60); // 60-second resend cooldown
    } catch (err) {
      setError(err.message || t("signup_failed"));
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP → create account ──
  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length < OTP_LENGTH) {
      setError("Please enter the complete 6-digit code.");
      return;
    }
    setError(""); setSuccess("");
    setLoading(true);
    try {
      const data = await verifyOtp({ email: form.email, otp });
      // If backend returns token + user, log the user in immediately
      if (data.token && data.user) {
        saveSession({ token: data.token, user: data.user });
        navigate(data.user.role === "company" ? "/company/dashboard" : "/user/dashboard");
      } else {
        navigate("/login", { state: { message: "Account created! Please sign in." } });
      }
    } catch (err) {
      setError(err.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Resend OTP ──
  const handleResend = async () => {
    if (cooldown > 0) return;
    setError(""); setSuccess("");
    setLoading(true);
    try {
      const data = await resendOtp({ email: form.email });
      setSuccess(data.message || "New OTP sent!");
      setOtp("");
      setCooldown(60);
    } catch (err) {
      setError(err.message || "Could not resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Shared layout wrapper ──
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
        @keyframes spinGlobe { 0%{transform:rotateX(15deg) rotateY(0deg)} 100%{transform:rotateX(15deg) rotateY(360deg)} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
      `}</style>

      <div style={{ position: "fixed", top: 20, right: 24, zIndex: 100 }}>
        <LanguageSwitcher />
      </div>

      {/* Background grid */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: `radial-gradient(circle at 1px 1px, #1a1a1a 1px, transparent 0)`, backgroundSize: "32px 32px", opacity: 0.4, pointerEvents: "none" }} />
      <div style={{ position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)", width: 500, height: 500, background: `radial-gradient(circle, ${NEON}06 0%, transparent 70%)`, pointerEvents: "none" }} />
      <AnimatedGlobe />

      <div style={{ width: "100%", maxWidth: 460, animation: "fadeUp 0.4s ease both", position: "relative" }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 32 }}>
          <img src={clarityLogo} alt="Clarity" style={{ height: 60, filter: "drop-shadow(0 0 12px rgba(57,255,20,0.5))" }} />
        </div>

        {/* Card */}
        <div style={{
          background: "linear-gradient(145deg, #0a0a0a 0%, #050505 100%)",
          border: `1px solid ${BORDER}`, borderRadius: 24, padding: "40px 32px 36px",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 60px rgba(57,255,20,0.03)",
          position: "relative", overflow: "hidden",
        }}>
          {/* Top accent */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, #39ff14, transparent)", opacity: 0.3 }} />

          {/* ── Step indicator ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
            {[1, 2].map(s => (
              <div key={s} style={{
                flex: 1, height: 3, borderRadius: 3,
                background: step >= s ? NEON : "#1e1e1e",
                boxShadow: step >= s ? `0 0 6px ${NEON}66` : "none",
                transition: "all 0.4s ease",
              }} />
            ))}
          </div>

          {/* ─── STEP 1: Sign-up form ─── */}
          {step === 1 && (
            <>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: TEXT, letterSpacing: -0.5, marginBottom: 6 }}>
                {t("signup_heading")}
              </h1>
              <p style={{ fontSize: 13, color: MUTED, marginBottom: 28 }}>
                {t("signup_subtext")}
              </p>

              {/* Role switcher */}
              <div style={{ display: "flex", background: "#080808", border: `1px solid ${BORDER}`, borderRadius: 10, padding: 4, marginBottom: 24, gap: 4 }}>
                {[
                  { value: "user",    label: t("retail_investor"), sub: t("individual") },
                  { value: "company", label: t("institution"),     sub: t("professional") },
                ].map(r => (
                  <button
                    key={r.value} type="button" onClick={() => setRole(r.value)}
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
                <div style={{ background: "rgba(255,68,68,0.08)", border: "1px solid rgba(255,68,68,0.25)", borderRadius: 8, padding: "10px 14px", marginBottom: 20, display: "flex", alignItems: "center", gap: 8, animation: "shake 0.4s ease" }}>
                  <span style={{ fontSize: 14 }}>⚠</span>
                  <span style={{ fontSize: 13, color: "#ff6666", fontWeight: 500 }}>{error}</span>
                </div>
              )}

              <form onSubmit={handleSignup}>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                  {/* Name */}
                  <div>
                    <label style={labelStyle}>{t("full_name")}</label>
                    <input
                      id="signup-name" name="name" type="text" required
                      value={form.name} onChange={handleChange} placeholder="John Doe"
                      style={inputStyle(focused.name)}
                      onFocus={() => setFocused(f => ({ ...f, name: true }))}
                      onBlur={() => setFocused(f => ({ ...f, name: false }))}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label style={labelStyle}>{t("email_address")}</label>
                    <input
                      id="signup-email" name="email" type="email" required
                      value={form.email} onChange={handleChange} placeholder="you@example.com"
                      style={inputStyle(focused.email)}
                      onFocus={() => setFocused(f => ({ ...f, email: true }))}
                      onBlur={() => setFocused(f => ({ ...f, email: false }))}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label style={labelStyle}>{t("phone_number")}</label>
                    <input
                      id="signup-phone" name="phone" type="tel" required
                      value={form.phone} onChange={handleChange} placeholder="+91 98765 43210"
                      style={inputStyle(focused.phone)}
                      onFocus={() => setFocused(f => ({ ...f, phone: true }))}
                      onBlur={() => setFocused(f => ({ ...f, phone: false }))}
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label style={labelStyle}>{t("password")}</label>
                    <input
                      id="signup-password" name="password" type="password" required
                      value={form.password} onChange={handleChange} placeholder="Min. 6 characters"
                      style={inputStyle(focused.password)}
                      onFocus={() => setFocused(f => ({ ...f, password: true }))}
                      onBlur={() => setFocused(f => ({ ...f, password: false }))}
                    />
                    {form.password.length > 0 && (
                      <div style={{ marginTop: 8 }}>
                        <div style={{ display: "flex", gap: 4 }}>
                          {[1, 2, 3, 4].map(i => (
                            <div key={i} style={{
                              flex: 1, height: 3, borderRadius: 3,
                              background: i <= strength.score ? strength.color : "#1e1e1e",
                              transition: "background 0.3s",
                              boxShadow: i <= strength.score ? `0 0 4px ${strength.color}88` : "none",
                            }} />
                          ))}
                        </div>
                        <span style={{ fontSize: 11, color: strength.color, fontWeight: 700, marginTop: 5, display: "block" }}>
                          {strength.labelKey ? t(strength.labelKey) : ""}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Account type preview */}
                  <div style={{ background: "#080808", border: `1px solid ${BORDER}`, borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 12, color: MUTED }}>{t("account_type")}</span>
                    <span style={{ fontSize: 11, fontWeight: 800, color: NEON, background: NEON_DIM, border: `1px solid ${NEON_BORDER}`, padding: "3px 10px", borderRadius: 20, letterSpacing: 0.5 }}>
                      {role === "company" ? t("institution_badge") : t("retail_badge")}
                    </span>
                  </div>

                  {/* Submit */}
                  <button
                    id="signup-submit-btn"
                    type="submit" disabled={loading}
                    style={{
                      width: "100%", padding: "13px", borderRadius: 10,
                      background: loading ? "rgba(57,255,20,0.4)" : NEON,
                      border: "none", color: "#000", fontSize: 14, fontWeight: 800,
                      cursor: loading ? "not-allowed" : "pointer", transition: "all 0.2s",
                      boxShadow: loading ? "none" : `0 0 20px ${NEON}44`,
                      fontFamily: "inherit", letterSpacing: 0.3, marginTop: 4,
                    }}
                  >
                    {loading ? "Sending OTP…" : t("create_account_btn")}
                  </button>
                </div>
              </form>
            </>
          )}

          {/* ─── STEP 2: OTP Verification ─── */}
          {step === 2 && (
            <>
              <div style={{ textAlign: "center", marginBottom: 28 }}>
                {/* Email icon */}
                <div style={{
                  width: 64, height: 64, borderRadius: "50%",
                  background: NEON_DIM, border: `2px solid ${NEON_BORDER}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 16px", fontSize: 28,
                  boxShadow: `0 0 20px ${NEON}33`,
                }}>
                  ✉️
                </div>
                <h1 style={{ fontSize: 22, fontWeight: 900, color: TEXT, marginBottom: 8 }}>
                  Verify your email
                </h1>
                <p style={{ fontSize: 13, color: SUB, lineHeight: 1.6 }}>
                  We sent a 6-digit code to<br />
                  <span style={{ color: NEON, fontWeight: 700 }}>{form.email}</span>
                </p>
              </div>

              {/* Success message */}
              {success && (
                <div style={{ background: "rgba(57,255,20,0.08)", border: `1px solid ${NEON_BORDER}`, borderRadius: 8, padding: "10px 14px", marginBottom: 20, textAlign: "center" }}>
                  <span style={{ fontSize: 13, color: NEON, fontWeight: 500 }}>✓ {success}</span>
                </div>
              )}

              {/* Error message */}
              {error && (
                <div style={{ background: "rgba(255,68,68,0.08)", border: "1px solid rgba(255,68,68,0.25)", borderRadius: 8, padding: "10px 14px", marginBottom: 20, display: "flex", alignItems: "center", gap: 8, animation: "shake 0.4s ease" }}>
                  <span style={{ fontSize: 14 }}>⚠</span>
                  <span style={{ fontSize: 13, color: "#ff6666", fontWeight: 500 }}>{error}</span>
                </div>
              )}

              <form onSubmit={handleVerify}>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                  {/* OTP digit boxes */}
                  <div>
                    <label style={{ ...labelStyle, textAlign: "center", display: "block", marginBottom: 14 }}>
                      Enter verification code
                    </label>
                    <OtpInput value={otp} onChange={setOtp} />
                  </div>

                  {/* Verify button */}
                  <button
                    id="otp-verify-btn"
                    type="submit"
                    disabled={loading || otp.length < OTP_LENGTH}
                    style={{
                      width: "100%", padding: "13px", borderRadius: 10,
                      background: (loading || otp.length < OTP_LENGTH) ? "rgba(57,255,20,0.4)" : NEON,
                      border: "none", color: "#000", fontSize: 14, fontWeight: 800,
                      cursor: (loading || otp.length < OTP_LENGTH) ? "not-allowed" : "pointer",
                      transition: "all 0.2s",
                      boxShadow: (loading || otp.length < OTP_LENGTH) ? "none" : `0 0 20px ${NEON}44`,
                      fontFamily: "inherit", letterSpacing: 0.3,
                    }}
                  >
                    {loading ? "Verifying…" : "Verify & Create Account"}
                  </button>
                </div>
              </form>

              {/* Resend */}
              <div style={{ textAlign: "center", marginTop: 22 }}>
                {cooldown > 0 ? (
                  <p style={{ fontSize: 13, color: MUTED }}>
                    Resend code in <span style={{ color: NEON, fontWeight: 700 }}>{cooldown}s</span>
                  </p>
                ) : (
                  <button
                    id="otp-resend-btn"
                    type="button" onClick={handleResend} disabled={loading}
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      fontSize: 13, color: SUB, fontFamily: "inherit",
                      textDecoration: "underline", textUnderlineOffset: 3,
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = NEON}
                    onMouseLeave={e => e.currentTarget.style.color = SUB}
                  >
                    Didn't get it? Resend OTP
                  </button>
                )}
              </div>

              {/* Back link */}
              <div style={{ textAlign: "center", marginTop: 12 }}>
                <button
                  type="button"
                  onClick={() => { setStep(1); setError(""); setSuccess(""); setOtp(""); }}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: 12, color: MUTED, fontFamily: "inherit",
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = SUB}
                  onMouseLeave={e => e.currentTarget.style.color = MUTED}
                >
                  ← Change email / Go back
                </button>
              </div>
            </>
          )}

          {/* ── Footer: sign in link (step 1 only) ── */}
          {step === 1 && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
                <div style={{ flex: 1, height: 1, background: BORDER }} />
                <span style={{ fontSize: 11, color: MUTED, fontWeight: 600 }}>{t("already_have_account")}</span>
                <div style={{ flex: 1, height: 1, background: BORDER }} />
              </div>

              <Link to="/login" style={{ textDecoration: "none" }}>
                <button
                  style={{
                    width: "100%", padding: "13px", borderRadius: 10,
                    background: "transparent", border: `1px solid ${BORDER2}`,
                    color: SUB, fontSize: 14, fontWeight: 600, cursor: "pointer",
                    transition: "all 0.2s", fontFamily: "inherit",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = NEON_BORDER; e.currentTarget.style.color = NEON; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER2; e.currentTarget.style.color = SUB; }}
                >
                  {t("sign_in_instead")}
                </button>
              </Link>
            </>
          )}
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: MUTED, marginTop: 20 }}>
          {t("market_footer")}
        </p>
      </div>
    </div>
  );
}
