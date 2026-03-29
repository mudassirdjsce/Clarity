import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRef, useEffect, useState } from "react";
import { LanguageSwitcher } from "../../components/LanguageSwitcher";
import clarityLogo from "../../assets/CLARITY1.svg";
import {
  Activity,
  CheckCircle2,
  Cpu,
  Globe,
  LayoutDashboard,
  Shield,
  Terminal,
  User,
  Zap,
  Brain,
  Lock,
  BarChart3,
  TrendingUp,
  Newspaper,
  Wallet,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Star,
  Camera,
} from "lucide-react";

// ── Typography helpers ─────────────────────────────────────────────────────────
const FONT_DISPLAY = { fontFamily: "'Syne', sans-serif" };
const FONT_BODY    = { fontFamily: "'Inter', sans-serif" };

// ── Animation presets ──────────────────────────────────────────────────────────
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

const fadeUp = {
  initial:     { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true, margin: "-60px" },
  transition:  { duration: 0.7, ease: EASE_OUT_EXPO },
};

// Stagger container — wrap children to cascade animations
const staggerContainer = {
  hidden:  {},
  show:    { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const staggerItem = {
  hidden:  { opacity: 0, y: 28, scale: 0.97 },
  show:    { opacity: 1, y: 0,  scale: 1,
             transition: { duration: 0.6, ease: EASE_OUT_EXPO } },
};

// ── Animated counting number ───────────────────────────────────────────────────
function CountUp({ value, suffix = '' }) {
  const [display, setDisplay] = useState('0');
  const raw = parseFloat(value.replace(/[^0-9.]/g, ''));
  const isDecimal = value.includes('.');
  const prefix = value.match(/^[^0-9]*/)?.[0] ?? '';

  useEffect(() => {
    let start = 0;
    const duration = 1400;
    const step = 16;
    const increment = raw / (duration / step);
    const timer = setInterval(() => {
      start = Math.min(start + increment, raw);
      setDisplay(
        prefix +
        (isDecimal ? start.toFixed(1) : Math.floor(start).toLocaleString()) +
        (value.match(/[^0-9.]+$/)?.[0] ?? '')
      );
      if (start >= raw) clearInterval(timer);
    }, step);
    return () => clearInterval(timer);
  }, []);

  return <>{display}</>;
}

// ── Reusable neon pill label ───────────────────────────────────────────────────
function Pill({ children }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#39ff14]/25 bg-[#39ff14]/8 text-[#39ff14] text-[10px] font-semibold uppercase tracking-[0.18em]"
      style={FONT_BODY}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#39ff14] animate-pulse" />
      {children}
    </span>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// NAVBAR
// ══════════════════════════════════════════════════════════════════════════════
function Navbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
      className="fixed top-0 w-full z-50 border-b transition-all duration-500"
      style={{
        background: scrolled ? "rgba(5,7,5,0.95)" : "rgba(7,9,7,0.7)",
        backdropFilter: "blur(24px)",
        borderColor: scrolled ? "rgba(57,255,20,0.08)" : "rgba(255,255,255,0.04)",
        boxShadow: scrolled ? "0 4px 40px rgba(0,0,0,0.4)" : "none",
      }}
    >
      <div className="flex justify-between items-center px-5 md:px-10 py-4 max-w-screen-xl mx-auto">
        {/* Logo */}
        <div
          className="cursor-pointer hover:scale-105 transition-transform duration-200"
          onClick={() => navigate("/")}
        >
          <img
            src={clarityLogo}
            alt="Clarity"
            className="h-7 md:h-9 w-auto drop-shadow-[0_0_10px_rgba(57,255,20,0.5)]"
          />
        </div>

        {/* Nav links */}
        <div className="hidden lg:flex items-center gap-8" style={FONT_BODY}>
          {[
            { label: t("landing_nav_platform"),     href: "#features" },
            { label: t("landing_nav_intelligence"),  href: "#pulse"    },
            { label: t("landing_nav_security"),      href: "#security" },
            { label: t("landing_nav_pricing"),       href: "#cta"      },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-sm text-white/50 hover:text-white transition-colors duration-200 font-medium tracking-wide"
            >
              {label}
            </a>
          ))}
        </div>

        {/* CTA row */}
        <div className="flex items-center gap-3 md:gap-4">
          <LanguageSwitcher />
          <button
            onClick={() => navigate("/login")}
            className="hidden sm:block text-sm font-medium text-white/50 hover:text-white transition-colors"
            style={FONT_BODY}
          >
            {t("login")}
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="px-5 py-2 text-xs font-bold rounded-full text-black bg-[#39ff14] hover:brightness-110 active:scale-95 transition-all shadow-[0_0_18px_rgba(57,255,20,0.35)]"
            style={FONT_BODY}
          >
            {t("get_started")}
          </button>
        </div>
      </div>
    </motion.nav>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// HERO
// ══════════════════════════════════════════════════════════════════════════════
function Hero() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const blobY     = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const headingY  = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  const headingOp = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Mouse-follow neon glow
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      mouseX.set(e.clientX - r.left);
      mouseY.set(e.clientY - r.top);
    };
    el.addEventListener('mousemove', move);
    return () => el.removeEventListener('mousemove', move);
  }, []);

  const stats = [
    { icon: Activity,        labelKey: "landing_stat_latency", value: "0.002ms", progress: "80%" },
    { icon: LayoutDashboard, labelKey: "landing_stat_assets",  value: "$12.4B",  progress: "60%" },
    { icon: Globe,           labelKey: "landing_stat_nodes",   value: "4,812",   progress: "85%" },
  ];

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden"
      style={{ background: "radial-gradient(ellipse 120% 80% at 50% -10%, rgba(57,255,20,0.08) 0%, transparent 60%), #070907" }}
    >
      {/* Mouse-follow glow */}
      <motion.div
        className="absolute pointer-events-none rounded-full mix-blend-screen"
        style={{
          width: 500, height: 500,
          x: springX, y: springY,
          translateX: '-50%', translateY: '-50%',
          background: 'radial-gradient(circle, rgba(57,255,20,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Static centered blob */}
      <motion.div
        style={{ y: blobY }}
        animate={{ opacity: [0.18, 0.35, 0.18], scale: [1, 1.08, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#39ff14] blur-[200px] rounded-full pointer-events-none mix-blend-screen"
      />

      {/* Grid overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.028 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(57,255,20,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(57,255,20,0.6) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto text-center flex flex-col items-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
          className="mb-8 flex justify-center"
        >
          <Pill>{t("landing_hero_badge")}</Pill>
        </motion.div>


        {/* Headline */}
        <motion.h1
          style={{ y: headingY, opacity: headingOp, ...FONT_DISPLAY }}
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.1, ease: EASE_OUT_EXPO }}
          className="w-full text-center text-[clamp(2.2rem,5.5vw,4.8rem)] font-extrabold text-white tracking-tight leading-[1.1] mb-8"
        >
          {t("landing_hero_h1_1")}{" "}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="text-transparent bg-clip-text bg-gradient-to-r from-[#39ff14] via-[#8EFF71] to-[#39ff14]"
            style={{ backgroundSize: '200%', backgroundPosition: '0%' }}
          >
            {t("landing_hero_h1_2")}
          </motion.span>
          {" "}{t("landing_hero_h1_3")}
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.3, ease: EASE_OUT_EXPO }}
          className="max-w-lg text-base md:text-lg text-white/45 mb-10 leading-relaxed"
          style={FONT_BODY}
        >
          {t("landing_hero_sub")}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: EASE_OUT_EXPO }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full"
        >
          <button
            onClick={() => navigate("/signup")}
            className="group relative w-full sm:w-auto px-8 py-3.5 bg-[#39ff14] text-black font-bold rounded-xl text-sm hover:brightness-110 active:scale-95 transition-all shadow-[0_0_30px_rgba(57,255,20,0.4)] overflow-hidden"
            style={FONT_DISPLAY}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {t("get_started")} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
          <button
            onClick={() => navigate("/login")}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-white/10 text-white/60 font-medium text-sm hover:border-white/20 hover:text-white hover:bg-white/5 transition-all"
            style={FONT_BODY}
          >
            {t("explore_engine")}
          </button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          transition={{ delayChildren: 0.6 }}
          className="mt-16 w-full grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.labelKey}
              variants={staggerItem}
              whileHover={{ y: -4, borderColor: 'rgba(57,255,20,0.2)', transition: { duration: 0.2 } }}
              className="p-6 rounded-2xl border border-white/8 text-left cursor-default"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <div className="flex items-center gap-2.5 mb-4">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: i * 0.8 }}
                >
                  <stat.icon className="w-4 h-4 text-[#39ff14]" />
                </motion.div>
                <span className="text-[10px] tracking-widest text-white/30 uppercase font-medium" style={FONT_BODY}>
                  {t(stat.labelKey)}
                </span>
              </div>
              <motion.div
                className="text-3xl font-bold text-white mb-3"
                style={FONT_DISPLAY}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <CountUp value={stat.value} />
              </motion.div>
              <div className="w-full h-px bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: stat.progress }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.4, delay: 0.6 + i * 0.15, ease: EASE_OUT_EXPO }}
                  className="h-full bg-gradient-to-r from-[#39ff14] to-[#8EFF71] shadow-[0_0_10px_rgba(57,255,20,0.7)]"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// FEATURES SECTION  ← NEW
// ══════════════════════════════════════════════════════════════════════════════
// ── Features data (keys only — titles/descs/tags come from i18n) ──────────────
const FEATURES = [
  { icon: Brain,       titleKey: "feat_ai_title",        descKey: "feat_ai_desc",        tagKey: "feat_ai_tag",        glow: "rgba(57,255,20,0.15)"   },
  { icon: BarChart3,   titleKey: "feat_analytics_title", descKey: "feat_analytics_desc", tagKey: "feat_analytics_tag", glow: "rgba(99,126,234,0.15)"  },
  { icon: TrendingUp,  titleKey: "feat_market_title",    descKey: "feat_market_desc",    tagKey: "feat_market_tag",    glow: "rgba(20,241,149,0.15)"  },
  { icon: Newspaper,   titleKey: "feat_news_title",      descKey: "feat_news_desc",      tagKey: "feat_news_tag",      glow: "rgba(57,255,20,0.15)"   },
  { icon: Lock,        titleKey: "feat_pdf_title",       descKey: "feat_pdf_desc",       tagKey: "feat_pdf_tag",       glow: "rgba(239,68,68,0.12)"   },
  { icon: Camera,      titleKey: "feat_camera_title",    descKey: "feat_camera_desc",    tagKey: "feat_camera_tag",    glow: "rgba(57,255,20,0.15)"   },
  { icon: Wallet,      titleKey: "feat_bank_title",      descKey: "feat_bank_desc",      tagKey: "feat_bank_tag",      glow: "rgba(251,191,36,0.12)"  },
  { icon: ShieldCheck, titleKey: "feat_biometric_title", descKey: "feat_biometric_desc", tagKey: "feat_biometric_tag", glow: "rgba(57,255,20,0.15)"   },
  { icon: Sparkles,    titleKey: "feat_wrapped_title",   descKey: "feat_wrapped_desc",   tagKey: "feat_wrapped_tag",   glow: "rgba(99,126,234,0.15)"  },
];

function FeaturesSection() {
  const { t } = useTranslation();
  return (
    <section id="features" className="py-28 px-5 md:px-10" style={{ background: "#070907" }}>
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div {...fadeUp} className="text-center mb-20">
          <Pill>{t('pill_platform_features')}</Pill>
          <h2
            className="mt-5 text-[clamp(2rem,5vw,3.8rem)] font-extrabold text-white tracking-tight leading-tight"
            style={FONT_DISPLAY}
          >
            {t('features_heading_1')}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#39ff14] to-[#8EFF71]">
              {t('features_heading_2')}
            </span>
          </h2>
          <p className="mt-5 text-white/40 text-lg max-w-2xl mx-auto leading-relaxed" style={FONT_BODY}>
            {t('features_sub')}
          </p>
        </motion.div>

        {/* Bento grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.titleKey}
              variants={staggerItem}
              whileHover={{
                y: -6,
                borderColor: "rgba(57,255,20,0.22)",
                boxShadow: `0 20px 60px ${f.glow}`,
                transition: { duration: 0.25, ease: 'easeOut' },
              }}
              className="group relative p-7 rounded-2xl border border-white/8 overflow-hidden cursor-default"
              style={{ background: "rgba(255,255,255,0.025)" }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                whileHover={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-[50px] pointer-events-none"
                style={{ background: f.glow }}
              />
              <motion.div
                initial={{ rotate: -12, scale: 0.8, opacity: 0 }}
                whileInView={{ rotate: 0, scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.05 * i, ease: EASE_OUT_EXPO }}
                className="w-11 h-11 rounded-xl bg-[#39ff14]/8 border border-[#39ff14]/15 flex items-center justify-center mb-5 group-hover:bg-[#39ff14]/15 transition-colors"
              >
                <f.icon className="w-5 h-5 text-[#39ff14]" />
              </motion.div>
              <span
                className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#39ff14]/50 mb-2 block"
                style={FONT_BODY}
              >
                {t(f.tagKey)}
              </span>
              <h3
                className="text-base font-bold text-white mb-2 leading-snug"
                style={FONT_DISPLAY}
              >
                {t(f.titleKey)}
              </h3>
              <p className="text-sm text-white/40 leading-relaxed" style={FONT_BODY}>
                {t(f.descKey)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// VELOCITY (MODES) SECTION
// ══════════════════════════════════════════════════════════════════════════════
function VelocitySection() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section
      className="py-28 md:py-36 px-5 md:px-10 overflow-hidden"
      style={{ background: "rgba(5,7,5,1)" }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div {...fadeUp} className="mb-16 md:mb-20">
          <Pill>{t('pill_access_modes')}</Pill>
          <h2
            className="mt-5 text-[clamp(2rem,5vw,3.8rem)] font-extrabold text-white tracking-tight"
            style={FONT_DISPLAY}
          >
            {t("velocity_heading")}
          </h2>
          <p className="mt-4 text-white/40 text-lg max-w-xl leading-relaxed" style={FONT_BODY}>
            {t("velocity_sub")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Retail card */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ borderColor: "rgba(57,255,20,0.25)" }}
            onClick={() => navigate("/signup")}
            className="group relative overflow-hidden rounded-2xl border border-white/8 h-[500px] md:h-[580px] flex flex-col justify-end p-8 md:p-10 cursor-pointer transition-all duration-500"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <div className="absolute inset-0 opacity-5 group-hover:opacity-10 flex items-center justify-center transition-all duration-700 pointer-events-none">
              <User className="w-[250px] h-[250px] text-[#39ff14]" strokeWidth={0.5} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-10" />
            <div className="relative z-20">
              <div className="mb-5 flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#39ff14]/10 border border-[#39ff14]/25 flex items-center justify-center">
                  <User className="w-5 h-5 text-[#39ff14]" />
                </div>
                <span className="text-[10px] tracking-[0.2em] text-[#39ff14] uppercase font-semibold" style={FONT_BODY}>
                  Level 01
                </span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-3" style={FONT_DISPLAY}>
                {t("retail_mode")}
              </h3>
              <p className="text-white/50 mb-6 leading-relaxed" style={FONT_BODY}>
                {t("retail_mode_sub")}
              </p>
              <ul className="space-y-3 mb-8">
                {["retail_feature_1", "retail_feature_2", "retail_feature_3"].map((key) => (
                  <li key={key} className="flex items-center gap-2.5 text-white/70 text-sm" style={FONT_BODY}>
                    <CheckCircle2 className="w-4 h-4 text-[#39ff14] shrink-0" />
                    {t(key)}
                  </li>
                ))}
              </ul>
              <button
                onClick={(e) => { e.stopPropagation(); navigate("/signup"); }}
                className="px-7 py-3 rounded-xl border border-[#39ff14]/25 text-[#39ff14] text-sm font-semibold hover:bg-[#39ff14]/10 transition-all"
                style={FONT_BODY}
              >
                {t("start_retail")}
              </button>
            </div>
          </motion.div>

          {/* Pro card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ borderColor: "rgba(57,255,20,0.25)" }}
            className="group relative overflow-hidden rounded-2xl border border-white/8 h-[500px] md:h-[580px] flex flex-col justify-end p-8 md:p-10 transition-all duration-500"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            {/* Neon corner accent */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#39ff14]/5 rounded-full blur-[60px] pointer-events-none" />
            <div className="absolute inset-0 opacity-10 group-hover:opacity-20 flex items-center justify-center transition-all duration-700 pointer-events-none">
              <Terminal className="w-[200px] h-[200px] text-[#39ff14]" strokeWidth={0.5} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-10" />
            <div className="relative z-20">
              <div className="mb-5 flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#39ff14]/15 border border-[#39ff14]/30 flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-[#39ff14]" />
                </div>
                <span className="text-[10px] tracking-[0.2em] text-[#39ff14] uppercase font-semibold" style={FONT_BODY}>
                  Level MAX
                </span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-3" style={FONT_DISPLAY}>
                {t("pro_mode")}
              </h3>
              <p className="text-white/50 mb-8 leading-relaxed" style={FONT_BODY}>
                {t("pro_mode_sub")}
              </p>
              <button
                onClick={() => navigate("/signup")}
                className="px-7 py-3 rounded-xl bg-[#39ff14] text-black font-bold text-sm hover:brightness-110 transition-all shadow-[0_0_20px_rgba(57,255,20,0.25)]"
                style={FONT_DISPLAY}
              >
                {t("access_terminal")}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PULSE SECTION
// ══════════════════════════════════════════════════════════════════════════════
function PulseSection() {
  const { t } = useTranslation();

  return (
    <section
      id="pulse"
      className="py-24 md:py-32 px-5 md:px-10 overflow-hidden"
      style={{ background: "#070907" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        {/* Visual */}
        <div className="w-full lg:w-1/2 order-2 lg:order-1 flex-shrink-0">
          <div className="relative aspect-square max-w-[380px] mx-auto">
            <motion.div
              animate={{ opacity: [0.2, 0.45, 0.2] }}
              transition={{ duration: 4.5, repeat: Infinity }}
              className="absolute inset-0 bg-[radial-gradient(circle_at_center,#39ff14_0%,transparent_70%)] blur-[80px] opacity-35 mix-blend-screen"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="absolute inset-8 border border-[#39ff14]/15 rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              className="absolute inset-16 border border-[#39ff14]/8 rounded-full"
            />
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-6 right-2 px-4 py-3 rounded-xl border border-white/8 text-left"
              style={{ background: "rgba(12,16,12,0.9)", backdropFilter: "blur(12px)" }}
            >
              <div className="text-[#39ff14] font-bold text-lg" style={FONT_DISPLAY}>+12.4%</div>
              <div className="text-white/30 text-[8px] uppercase tracking-widest" style={FONT_BODY}>Alpha Detection</div>
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute bottom-16 left-0 px-4 py-3 rounded-xl border border-white/8 text-left"
              style={{ background: "rgba(12,16,12,0.9)", backdropFilter: "blur(12px)" }}
            >
              <div className="text-[#39ff14] font-bold text-lg" style={FONT_DISPLAY}>LOW</div>
              <div className="text-white/30 text-[8px] uppercase tracking-widest" style={FONT_BODY}>Risk Coefficient</div>
            </motion.div>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div {...fadeUp} className="text-center">
                <Zap className="w-14 h-14 text-[#39ff14] mx-auto" fill="currentColor" />
                <div
                  className="mt-3 text-sm font-bold tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-b from-[#39ff14] to-[rgba(57,255,20,0.3)] uppercase"
                  style={FONT_DISPLAY}
                >
                  Synthetic Pulse
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="w-full lg:w-1/2 order-1 lg:order-2">
          <Pill>{t('pill_neural_engine')}</Pill>
          <motion.h2
            {...fadeUp}
            className="mt-5 text-[clamp(2rem,5vw,3.5rem)] font-extrabold text-white tracking-tight leading-tight mb-10"
            style={FONT_DISPLAY}
          >
            {t("pulse_heading_1")}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#39ff14] to-[rgba(57,255,20,0.5)]">
              {t("pulse_heading_2")}
            </span>
          </motion.h2>
          <div className="space-y-10">
            {[
              { icon: Cpu,    titleKey: "neural_title",  descKey: "neural_desc"  },
              { icon: Shield, titleKey: "quantum_title", descKey: "quantum_desc" },
            ].map((feat, i) => (
              <motion.div
                key={feat.titleKey}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="flex gap-5"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl border border-white/8 flex items-center justify-center text-[#39ff14]"
                  style={{ background: "rgba(57,255,20,0.06)" }}>
                  <feat.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-1.5" style={FONT_DISPLAY}>
                    {t(feat.titleKey)}
                  </h4>
                  <p className="text-white/40 leading-relaxed text-sm" style={FONT_BODY}>
                    {t(feat.descKey)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TESTIMONIALS (SOCIAL PROOF)  ← NEW
// ══════════════════════════════════════════════════════════════════════════════
const TESTIMONIALS = [
  { nameKey: "testimonial_1_name", roleKey: "testimonial_1_role", avatar: "AM", bodyKey: "testimonial_1_body" },
  { nameKey: "testimonial_2_name", roleKey: "testimonial_2_role", avatar: "PS", bodyKey: "testimonial_2_body" },
  { nameKey: "testimonial_3_name", roleKey: "testimonial_3_role", avatar: "RD", bodyKey: "testimonial_3_body" },
];

function TestimonialsSection() {
  const { t } = useTranslation();
  return (
    <section className="py-24 px-5 md:px-10" style={{ background: "rgba(5,7,5,1)" }}>
      <div className="max-w-6xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-16">
          <Pill>{t('pill_social_proof')}</Pill>
          <h2
            className="mt-5 text-[clamp(1.8rem,4vw,3rem)] font-extrabold text-white tracking-tight"
            style={FONT_DISPLAY}
          >
            {t('testimonials_heading_1')}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#39ff14] to-[#8EFF71]">
              {t('testimonials_heading_2')}
            </span>
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((tm, i) => (
            <motion.div
              key={tm.nameKey}
              {...fadeUp}
              transition={{ duration: 0.55, delay: 0.08 * i }}
              className="p-7 rounded-2xl border border-white/8 flex flex-col gap-4"
              style={{ background: "rgba(255,255,255,0.025)" }}
            >
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, si) => (
                  <Star key={si} className="w-3.5 h-3.5 text-[#39ff14] fill-[#39ff14]" />
                ))}
              </div>
              <p className="text-white/60 text-sm leading-relaxed italic" style={FONT_BODY}>
                "{t(tm.bodyKey)}"
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                <div
                  className="w-9 h-9 rounded-full bg-[#39ff14]/10 border border-[#39ff14]/20 flex items-center justify-center text-[#39ff14] text-[11px] font-bold"
                  style={FONT_DISPLAY}
                >
                  {tm.avatar}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold leading-none" style={FONT_DISPLAY}>{t(tm.nameKey)}</p>
                  <p className="text-white/30 text-[10px] mt-0.5" style={FONT_BODY}>{t(tm.roleKey)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// CTA SECTION
// ══════════════════════════════════════════════════════════════════════════════
function CTASection() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section id="cta" className="py-20 md:py-32 px-5 md:px-10" style={{ background: "#070907" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 24 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-5xl mx-auto relative overflow-hidden rounded-3xl border border-[#39ff14]/10 text-center p-10 md:p-20"
        style={{ background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(57,255,20,0.07) 0%, rgba(10,14,10,1) 70%)" }}
      >
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#39ff14]/10 blur-[80px] rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-[#39ff14]/5 blur-[80px] rounded-full" />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="relative z-10"
        >
          <Pill>{t('pill_get_started')}</Pill>
          <h2
            className="mt-6 text-[clamp(2rem,5vw,4rem)] font-extrabold text-white tracking-tight mb-5 leading-tight"
            style={FONT_DISPLAY}
          >
            {t("cta_heading_1")}
            <br />
            <span className="text-[#39ff14] italic">{t("cta_heading_2")}</span>
          </h2>
          <p className="text-white/40 text-lg mb-10 max-w-2xl mx-auto leading-relaxed" style={FONT_BODY}>
            {t("cta_sub")}
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="group inline-flex items-center gap-2 px-10 py-4 bg-[#39ff14] text-black font-bold rounded-2xl text-base hover:brightness-110 active:scale-95 transition-all shadow-[0_0_35px_rgba(57,255,20,0.35)]"
            style={FONT_DISPLAY}
          >
            {t("get_started_now")}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// FOOTER
// ══════════════════════════════════════════════════════════════════════════════
function Footer() {
  const { t } = useTranslation();

  return (
    <footer
      className="border-t border-white/5 py-10 px-6 md:px-12"
      style={{ background: "#040604" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <img
            src={clarityLogo}
            alt="Clarity"
            className="h-6 md:h-8 w-auto drop-shadow-[0_0_8px_rgba(57,255,20,0.3)]"
          />
          <div
            className="text-[9px] tracking-widest uppercase text-white/25"
            style={FONT_BODY}
          >
            {t("footer_copyright")}
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          {[{ key: "footer_privacy" }, { key: "footer_terms" }, { key: "footer_api" }, { key: "footer_contact" }].map(
            (link) => (
              <a
                key={link.key}
                href="#"
                className="text-[9px] tracking-[0.15em] uppercase text-white/25 hover:text-[#39ff14] transition-colors"
                style={FONT_BODY}
              >
                {t(link.key)}
              </a>
            )
          )}
        </div>
        <div className="flex gap-3">
          {[Globe, Terminal].map((Icon, i) => (
            <div
              key={i}
              className="w-9 h-9 rounded-full border border-white/8 flex items-center justify-center hover:border-[#39ff14]/30 hover:text-[#39ff14] text-white/30 cursor-pointer transition-colors"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <Icon className="w-4 h-4" />
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT EXPORT
// ══════════════════════════════════════════════════════════════════════════════
export default function LandingPage() {
  return (
    <div
      className="min-h-screen selection:bg-[#39ff14] selection:text-black"
      style={{ background: "#070907", ...FONT_BODY }}
    >
      <Navbar />
      <main>
        <Hero />
        <FeaturesSection />
        <VelocitySection />
        <PulseSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}