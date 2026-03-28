import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
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
  Zap 
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0b0f0b]/80 backdrop-blur-xl border-b border-[#454943]/15 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
      <div className="flex justify-between items-center px-4 md:px-8 py-4 max-w-screen-2xl mx-auto">
        <div className="cursor-pointer transition-transform hover:scale-105" onClick={() => navigate("/")}>
          <img src={clarityLogo} alt="Clarity" className="h-8 md:h-10 w-auto drop-shadow-[0_0_8px_rgba(57,255,20,0.5)]" />
        </div>
        <div className="hidden lg:flex items-center gap-8">
          {["Platform", "Intelligence", "Security", "Pricing"].map((item, idx) => (
            <a 
              key={item}
              className={`font-headline uppercase tracking-[0.05rem] text-sm transition-colors ${
                idx === 0 ? "text-primary border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-[#fafdf5]"
              }`} 
              href="#"
            >
              {item}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <button
            onClick={() => navigate("/login")}
            className="font-headline uppercase tracking-[0.05rem] text-xs md:text-sm text-on-surface-variant hover:text-[#fafdf5] transition-colors active:scale-95 duration-200 ease-out"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="bg-primary text-on-primary font-headline uppercase tracking-[0.05rem] text-xs md:text-sm font-bold px-4 py-2 md:px-6 md:py-2.5 rounded-full hover:bg-primary-dim transition-all active:scale-95 duration-200 ease-out shadow-[0_0_15px_rgba(57,255,20,0.3)]"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

const animateScroll = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, margin: "-50px" },
  transition: { duration: 0.6 }
};

const Hero = () => {
  const navigate = useNavigate();
  return (
  <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden hero-gradient">
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 0.5, scale: 1 }}
      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#39ff14] blur-[150px] rounded-full pointer-events-none mix-blend-screen"
    />
    
    <div className="relative z-10 max-w-7xl mx-auto px-6 text-center mt-12 md:mt-0">
      <motion.div 
        {...animateScroll}
        className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 rounded-full glass-effect border border-outline-variant/20 mb-8"
      >
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
        <span className="font-label text-[8px] md:text-[10px] tracking-widest uppercase text-primary">System Online: v2.4 Pulse Engine</span>
      </motion.div>

      <motion.h1 
        {...animateScroll}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="font-headline font-bold text-4xl sm:text-6xl md:text-8xl lg:text-9xl text-[#fafdf5] tracking-tighter leading-tight md:leading-none mb-6 md:mb-8"
      >
        FINANCIAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dim">INTELLIGENCE</span> <br/>AT THE SPEED OF LIGHT
      </motion.h1>

      <motion.p 
        {...animateScroll}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-2xl mx-auto font-body text-lg md:text-2xl text-on-surface-variant mb-10 md:mb-12 leading-relaxed"
      >
        A dual-mode AI platform for retail simplicity and institutional precision. 
        Built for those who demand clarity in chaos.
      </motion.p>

      <motion.div 
        {...animateScroll}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 md:gap-6 w-full max-w-md mx-auto sm:max-w-none"
      >
        <button
          onClick={() => navigate("/signup")}
          className="group relative w-full sm:w-auto px-8 py-4 md:px-10 md:py-5 bg-primary text-on-primary rounded-full font-headline font-bold text-base md:text-lg tracking-wide hover:bg-primary-dim transition-all active:scale-95 shadow-[0_0_30px_rgba(57,255,20,0.4)] overflow-hidden"
        >
          <span className="relative z-10 uppercase">GET STARTED</span>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        </button>
        <button
          onClick={() => navigate("/login")}
          className="w-full sm:w-auto px-8 py-4 md:px-10 md:py-5 rounded-full border border-outline-variant/30 font-headline font-bold text-base md:text-lg text-[#fafdf5] hover:bg-surface-variant transition-all active:scale-95 glass-effect"
        >
          EXPLORE ENGINE
        </button>
      </motion.div>

      <div className="mt-24 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: Activity, label: "Latency", value: "0.002ms", progress: "80%" },
          { icon: LayoutDashboard, label: "Assets Managed", value: "$12.4B", progress: "60%" },
          { icon: Globe, label: "Global Nodes", value: "4,812", progress: "85%" }
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            {...animateScroll}
            transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
            className="glass-effect p-6 rounded-xl border border-outline-variant/10 text-left"
          >
            <div className="flex items-center gap-3 mb-4">
              <stat.icon className="w-4 h-4 text-primary" />
              <span className="font-label text-[10px] tracking-widest text-on-surface-variant uppercase">{stat.label}</span>
            </div>
            <div className="font-headline text-3xl font-bold text-[#fafdf5]">{stat.value}</div>
            <div className="mt-2 w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: stat.progress }}
                viewport={{ once: false }}
                transition={{ duration: 1, delay: 0.8 + i * 0.1 }}
                className="h-full bg-primary shadow-[0_0_8px_#39ff14]"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
  );
};

const VelocitySection = () => {
  const navigate = useNavigate();
  return (
  <section className="py-24 md:py-32 px-4 md:px-6 bg-surface overflow-hidden">
    <div className="max-w-7xl mx-auto">
      <motion.div 
        {...animateScroll}
        className="mb-16 md:mb-20 text-center md:text-left"
      >
        <h2 className="font-headline text-3xl md:text-6xl font-bold text-[#fafdf5] tracking-tight mb-4">
          CHOOSE YOUR <span className="text-primary italic">VELOCITY</span>
        </h2>
        <p className="font-body text-on-surface-variant text-base md:text-lg max-w-2xl mx-auto md:mx-0">
          Switch seamlessly between intuitive personal wealth management and high-frequency institutional execution.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          whileHover={{ borderColor: "rgba(57, 255, 20, 0.2)" }}
          className="lg:col-span-6 group relative overflow-hidden rounded-xl bg-surface-container-low border border-outline-variant/5 h-[450px] md:h-[600px] flex flex-col justify-end p-8 md:p-12 transition-all duration-500"
          onClick={() => navigate("/signup")}
        >
          <div className="absolute inset-0 z-0 opacity-10 group-hover:opacity-20 flex items-center justify-center transition-all duration-700 pointer-events-none">
            <User className="w-[200px] h-[200px] md:w-[300px] md:h-[300px] text-primary" strokeWidth={1} />
          </div>
          <div className="absolute inset-0 z-0 opacity-40 group-hover:scale-105 transition-transform duration-700 mix-blend-overlay">
            <img 
              alt="Retail mode financial interface" 
              className="w-full h-full object-cover" 
              src="https://picsum.photos/seed/finance-retail/1200/800"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10"></div>
          <div className="relative z-20">
            <div className="mb-4 md:mb-6 flex items-center gap-3 animate-fade-in">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/30">
                <User className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </div>
              <span className="font-label tracking-[0.2rem] text-primary uppercase text-xs md:text-sm">Level 01</span>
            </div>
            <h3 className="font-headline text-3xl md:text-4xl font-bold text-[#fafdf5] mb-2 md:mb-4">RETAIL MODE</h3>
            <p className="font-body text-on-surface-variant text-sm md:text-lg mb-6 max-w-md">
              Simplified AI-driven insights for everyday growth. Zero-knowledge trading with one-tap rebalancing and risk mitigation.
            </p>
            <ul className="space-y-2 md:space-y-4 mb-6">
              {["Automated Portfolio Shield", "Social Sentiment Analysis"].map(item => (
                <li key={item} className="flex items-center gap-3 text-xs md:text-base text-[#fafdf5]/80">
                  <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={(e) => { e.stopPropagation(); navigate("/signup"); }}
              className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 glass-effect border border-primary/20 text-primary md:font-bold rounded-full hover:bg-primary/10 transition-all text-sm md:text-base"
            >
              START RETAIL
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          whileHover={{ borderColor: "rgba(57, 255, 20, 0.2)" }}
          className="lg:col-span-6 group relative overflow-hidden rounded-xl bg-surface-container-high border border-outline-variant/10 h-[450px] md:h-[600px] flex flex-col justify-end p-8 md:p-12 transition-all duration-500"
        >
          <div className="absolute inset-0 z-0 opacity-30 group-hover:scale-105 transition-transform duration-700 mix-blend-overlay">
            <img 
              alt="Institutional pro trading terminal" 
              className="w-full h-full object-cover" 
              src="https://picsum.photos/seed/trading-pro/800/800"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10"></div>
          <div className="relative z-20">
            <div className="mb-4 md:mb-6 flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary-dim/20 flex items-center justify-center border border-primary-dim/40">
                <Terminal className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </div>
              <span className="font-label tracking-[0.2rem] text-primary uppercase text-xs md:text-sm">Level MAX</span>
            </div>
            <h3 className="font-headline text-3xl md:text-4xl font-bold text-[#fafdf5] mb-2 md:mb-4">PRO MODE</h3>
            <p className="font-body text-on-surface-variant text-sm md:text-lg mb-6">
              Institutional precision. Full API access, custom algorithmic execution, and sub-millisecond liquidity routing.
            </p>
            <button
              onClick={() => navigate("/signup")}
              className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 bg-primary text-on-primary md:font-bold rounded-full hover:bg-primary-dim transition-all shadow-[0_0_20px_rgba(57,255,20,0.2)] text-sm md:text-base"
            >
              ACCESS TERMINAL
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
  );
};

const PulseSection = () => (
  <section className="py-20 md:py-24 px-4 md:px-6 bg-surface-container-lowest overflow-hidden">
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
      <div className="w-full lg:w-1/2 order-2 lg:order-1">
        <div className="relative aspect-square max-w-[400px] md:max-w-none mx-auto">
          <motion.div 
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#39ff14_0%,_transparent_70%)] blur-[80px] opacity-40 mix-blend-screen"
          />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-6 md:inset-10 border border-primary/20 rounded-full"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute inset-12 md:inset-20 border border-primary/10 rounded-full"
          />
          
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-4 md:top-10 right-0 glass-effect p-3 md:p-4 rounded-xl shadow-xl border border-white/5"
          >
            <div className="text-primary font-headline font-bold text-lg md:text-xl">+12.4%</div>
            <div className="text-on-surface-variant font-label text-[7px] md:text-[8px] uppercase">Alpha Detection</div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute bottom-10 md:bottom-20 left-0 glass-effect p-3 md:p-4 rounded-xl shadow-xl border border-white/5"
          >
            <div className="text-primary font-headline font-bold text-lg md:text-xl">LOW</div>
            <div className="text-on-surface-variant font-label text-[7px] md:text-[8px] uppercase">Risk Coefficient</div>
          </motion.div>

          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              {...animateScroll}
              className="text-center"
            >
              <Zap className="w-12 h-12 md:w-16 md:h-16 text-primary mx-auto" fill="currentColor" />
              <div className="mt-2 md:mt-4 font-headline text-lg md:text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-br from-[#39ff14] to-[rgba(57,255,20,0.3)] uppercase">SYNTHETIC PULSE</div>
            </motion.div>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 order-1 lg:order-2 text-center lg:text-left">
        <motion.h2 
          {...animateScroll}
          className="font-headline text-3xl md:text-6xl font-bold text-[#fafdf5] tracking-tight mb-8"
        >
          POWERED BY THE <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#39ff14] to-[rgba(57,255,20,0.4)]">SYNTHETIC PULSE</span>
        </motion.h2>
        <div className="space-y-12">
          {[
            { 
              icon: Cpu, 
              title: "Neural Arbitrage", 
              desc: "Our LLM-integrated engine scans 4.2 billion data points per second to identify cross-asset discrepancies before they hit the public order book." 
            },
            { 
              icon: Shield, 
              title: "Quantum Encryption", 
              desc: "Assets are secured using post-quantum cryptographic standards, ensuring your intelligence remains private and your capital remains yours." 
            }
          ].map((feature, i) => (
            <motion.div 
              key={feature.title} 
              {...animateScroll}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="flex gap-6"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                <feature.icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-headline text-xl font-bold mb-2">{feature.title}</h4>
                <p className="text-on-surface-variant leading-relaxed">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const CTASection = () => {
  const navigate = useNavigate();
  return (
  <section className="py-20 md:py-32 px-4 md:px-6">
    <motion.div 
      initial={{ opacity: 0, scale: 0.8, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: false, margin: "-100px" }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="max-w-5xl mx-auto glass-effect rounded-2xl md:rounded-xl p-8 md:p-12 lg:p-24 border border-primary/10 text-center relative overflow-hidden"
    >
      <div className="absolute -top-12 -right-12 md:-top-24 md:-right-24 w-32 h-32 md:w-64 md:h-64 bg-primary/20 blur-[60px] md:blur-[100px] rounded-full"></div>
      <div className="absolute -bottom-12 -left-12 md:-bottom-24 md:-left-24 w-32 h-32 md:w-64 md:h-64 bg-primary/10 blur-[60px] md:blur-[100px] rounded-full"></div>
      <motion.h2 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ delay: 0.2 }}
        className="font-headline text-3xl sm:text-4xl md:text-6xl font-bold text-[#fafdf5] mb-6 md:mb-8 relative z-10"
      >
        READY TO ACHIEVE <br/><span className="text-primary italic">TOTAL CLARITY?</span>
      </motion.h2>
      <motion.p 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ delay: 0.3 }}
        className="text-on-surface-variant text-base md:text-xl mb-8 md:mb-12 max-w-2xl mx-auto relative z-10"
      >
        Join 50,000+ traders and institutions leveraging the world's most advanced financial intelligence engine.
      </motion.p>
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 relative z-10 max-w-sm mx-auto sm:max-w-none"
      >
        <button
          onClick={() => navigate("/signup")}
          className="w-full sm:w-auto px-10 py-4 md:px-12 md:py-5 bg-primary text-on-primary rounded-full font-headline font-bold text-base md:text-xl shadow-[0_0_30px_rgba(57,255,20,0.3)] hover:scale-105 transition-transform active:scale-95"
        >
          GET STARTED NOW
        </button>
      </motion.div>
    </motion.div>
  </section>
  );
};

const Footer = () => (
  <footer className="w-full py-10 md:py-12 border-t border-[#454943]/15 bg-[#000000]">
    <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-12 gap-6 max-w-screen-2xl mx-auto">
      <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
        <img src={clarityLogo} alt="Clarity" className="h-6 md:h-8 w-auto mb-1 drop-shadow-[0_0_8px_rgba(57,255,20,0.3)]" />
        <div className="font-label text-[8px] md:text-[10px] tracking-widest uppercase text-on-surface-variant">
          © 2024 CLARITY SYNTHETIC PULSE. ALL RIGHTS RESERVED.
        </div>
      </div>
      <div className="flex flex-wrap justify-center md:justify-end gap-6 md:gap-8 mt-4 md:mt-0">
        {["Privacy Policy", "Terms of Service", "API Status", "Contact Support"].map(link => (
          <a key={link} className="font-label text-[8px] md:text-[10px] tracking-widest uppercase text-on-surface-variant hover:text-primary transition-colors block text-center" href="#">
            {link}
          </a>
        ))}
      </div>
      <div className="flex justify-center gap-4 mt-2 md:mt-0">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full glass-effect flex items-center justify-center border border-white/5 hover:border-primary/40 transition-colors cursor-pointer">
          <Globe className="w-4 h-4 md:w-5 md:h-5 text-on-surface-variant" />
        </div>
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full glass-effect flex items-center justify-center border border-white/5 hover:border-primary/40 transition-colors cursor-pointer">
          <Terminal className="w-4 h-4 md:w-5 md:h-5 text-on-surface-variant" />
        </div>
      </div>
    </div>
  </footer>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-on-primary">
      <Navbar />
      <main>
        <Hero />
        <VelocitySection />
        <PulseSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}