import React from 'react';
import { Send, Bot, User, Sparkles, AlertCircle, TrendingUp, Newspaper,
         Briefcase, ShieldAlert, ChevronRight, Plus, MessageSquare,
         Clock, Trash2, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

// ─── Constants ───────────────────────────────────────────────────────────────
const INTENT_LABELS = {
  stock_analysis: '📈 Stock Analysis',
  news:           '📰 News Intelligence',
  portfolio:      '💼 Portfolio Strategy',
  general:        '💬 General',
};

const QUICK_ACTIONS = [
  { label: 'Analyze Stock',   icon: TrendingUp,  prompt: 'Analyze RELIANCE stock'         },
  { label: 'Market News',     icon: Newspaper,   prompt: 'Show latest market news'         },
  { label: 'Build Portfolio', icon: Briefcase,   prompt: 'Suggest a low risk portfolio'    },
  { label: 'Risk Analysis',   icon: ShieldAlert, prompt: 'What are current market risks?'  },
];

const RISK_COLOR = {
  Low:    'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  Medium: 'text-amber-400   bg-amber-400/10  border-amber-400/20',
  High:   'text-red-400     bg-red-400/10    border-red-400/20',
};

const RECO_COLOR = {
  'Strong Buy':  'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'Buy':         'bg-green-500/20   text-green-400   border-green-500/30',
  'Hold':        'bg-amber-500/20   text-amber-400   border-amber-500/30',
  'Sell':        'bg-orange-500/20  text-orange-400  border-orange-500/30',
  'Strong Sell': 'bg-red-500/20     text-red-400     border-red-500/30',
};

const SENTIMENT_COLOR = {
  Bullish: 'text-emerald-400 bg-emerald-400/10',
  Bearish: 'text-red-400     bg-red-400/10',
  Neutral: 'text-amber-400   bg-amber-400/10',
};

const STORAGE_KEY = 'clarity_chat_sessions';

// ─── Local Storage helpers ───────────────────────────────────────────────────
function loadSessions() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}

function saveSessions(sessions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

function makeSession(id) {
  return { id, title: 'New Chat', messages: [], createdAt: Date.now() };
}

// ─── Structured response sub-components ─────────────────────────────────────
function UserResponse({ data }) {
  const riskKey = ['Low','Medium','High'].find(r => data.risk?.includes(r)) || 'Medium';
  return (
    <div className="space-y-3 text-sm">
      {data.insight && <p className="text-white/85 leading-relaxed">{data.insight}</p>}
      <div className="grid grid-cols-2 gap-2">
        {data.risk && (
          <div className={cn('flex flex-col gap-1 p-3 rounded-xl border', RISK_COLOR[riskKey])}>
            <span className="text-[9px] uppercase tracking-widest opacity-70 font-bold">Risk Level</span>
            <span className="font-semibold text-sm">{data.risk}</span>
          </div>
        )}
        {data.suggestion && (
          <div className="flex flex-col gap-1 p-3 rounded-xl border border-neon-green/20 bg-neon-green/5 text-neon-green">
            <span className="text-[9px] uppercase tracking-widest opacity-70 font-bold">Suggestion</span>
            <span className="font-medium text-xs leading-snug">{data.suggestion}</span>
          </div>
        )}
      </div>
      {data.explanation && (
        <p className="text-xs text-white/40 leading-relaxed border-t border-white/5 pt-3">{data.explanation}</p>
      )}
    </div>
  );
}

function CompanyResponse({ data }) {
  const riskKey = ['Low','Medium','High'].find(r => data.risk_analysis?.level?.includes(r)) || 'Medium';
  const sentimentKey = ['Bullish','Bearish','Neutral'].find(s => data.sentiment?.market_sentiment?.includes(s)) || 'Neutral';
  const recoKey = data.recommendation;

  // Safely parse a field that could be a string or an object
  const safeObj = (val) => {
    if (!val) return null;
    if (typeof val === 'object') return val;
    try { return JSON.parse(val); } catch { return null; }
  };

  const financials   = safeObj(data.financials);
  const riskAnalysis = safeObj(data.risk_analysis);
  const sentiment    = safeObj(data.sentiment);
  const outlook      = safeObj(data.outlook);

  return (
    <div className="space-y-3 text-sm">
      {data.summary && <p className="text-white/85 leading-relaxed font-medium">{data.summary}</p>}

      {/* Financials Grid */}
      {financials && typeof financials === 'object' && (
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(financials).map(([k, v]) => (
            <div key={k} className="p-2.5 rounded-xl bg-white/5 border border-white/8 space-y-1">
              <span className="text-[9px] uppercase tracking-widest text-white/30 font-bold block">{k.replace(/_/g,' ')}</span>
              <span className="text-white/80 text-xs font-semibold leading-tight">{typeof v === 'string' ? v : JSON.stringify(v)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Risk & Sentiment Row */}
      <div className="grid grid-cols-2 gap-2">
        {riskAnalysis && (
          <div className={cn('p-3 rounded-xl border', RISK_COLOR[riskKey])}>
            <span className="text-[9px] uppercase tracking-widest opacity-60 font-bold block mb-1.5">Risk</span>
            <span className="font-bold text-sm block mb-2">{riskAnalysis.level}</span>
            {Array.isArray(riskAnalysis.factors) && (
              <ul className="space-y-1">
                {riskAnalysis.factors.slice(0,3).map((f,i) => (
                  <li key={i} className="flex items-start gap-1 text-[10px] opacity-80">
                    <ChevronRight className="w-2.5 h-2.5 mt-0.5 shrink-0"/>
                    {f}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {sentiment && (
          <div className="p-3 rounded-xl border border-white/8 bg-white/5 space-y-2">
            <span className="text-[9px] uppercase tracking-widest text-white/30 font-bold block">Sentiment</span>
            <span className={cn('inline-block px-2 py-0.5 rounded-full text-xs font-bold', SENTIMENT_COLOR[sentimentKey])}>
              {sentiment.market_sentiment}
            </span>
            {sentiment.news_impact && (
              <p className="text-[10px] text-white/40 leading-snug">{sentiment.news_impact}</p>
            )}
          </div>
        )}
      </div>

      {/* Outlook */}
      {outlook && typeof outlook === 'object' && (
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(outlook).map(([k,v]) => (
            <div key={k} className="p-2.5 rounded-xl bg-white/5 border border-white/8 space-y-1">
              <span className="text-[9px] uppercase tracking-widest text-white/30 font-bold block">{k.replace(/_/g,' ')}</span>
              <p className="text-xs text-white/70 leading-snug">{typeof v === 'string' ? v : JSON.stringify(v)}</p>
            </div>
          ))}
        </div>
      )}

      {/* Recommendation */}
      {recoKey && (
        <div className={cn('inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-bold', RECO_COLOR[recoKey] || RECO_COLOR.Hold)}>
          <span className="text-[9px] uppercase tracking-widest opacity-70">Recommendation</span>
          <span>{recoKey}</span>
        </div>
      )}

      {/* Explanation */}
      {data.explanation && (
        <p className="text-xs text-white/40 leading-relaxed border-t border-white/5 pt-3">{data.explanation}</p>
      )}
    </div>
  );
}

function StructuredResponse({ data }) {
  // Handle null/undefined
  if (data == null) return <p className="text-sm text-white/40 italic">No response data.</p>;

  // If data is a string, attempt re-parse (Groq sometimes wraps JSON in a string)
  if (typeof data === 'string') {
    const trimmed = data.trim();
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try { return <StructuredResponse data={JSON.parse(trimmed)} />; } catch { /* fall through */ }
    }
    return <p className="text-sm text-white/70 leading-relaxed">{data}</p>;
  }

  if (typeof data !== 'object') return <p className="text-sm text-white/70">{String(data)}</p>;

  // Error state
  if (data.error) return (
    <div className="flex items-start gap-2 text-red-400 text-sm">
      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5"/>
      <span>{data.error}</span>
    </div>
  );

  // Safety net: if insight is itself a JSON string, re-parse and re-render
  if (data.insight && typeof data.insight === 'string') {
    const trimmed = data.insight.trim();
    if (trimmed.startsWith('{')) {
      try {
        const reParsed = JSON.parse(trimmed);
        if (typeof reParsed === 'object' && (reParsed.insight || reParsed.summary)) {
          return <StructuredResponse data={reParsed} />;
        }
      } catch { /* keep going */ }
    }
  }

  return data.summary ? <CompanyResponse data={data} /> : <UserResponse data={data} />;
}

function Sources({ sources = [] }) {
  if (!sources?.length) return null;
  return (
    <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-white/5">
      <span className="text-[9px] uppercase tracking-widest text-white/20 font-bold">Sources</span>
      {sources.map((s, i) =>
        typeof s === 'string' && s.startsWith('http') ? (
          <a key={i} href={s} target="_blank" rel="noreferrer"
             className="text-[10px] text-neon-green/60 hover:text-neon-green underline underline-offset-2 transition-colors">[{i+1}]</a>
        ) : (
          <span key={i} className="text-[10px] text-white/30 bg-white/5 px-1.5 py-0.5 rounded-md">{s}</span>
        )
      )}
    </div>
  );
}

// ─── MessageBubble ───────────────────────────────────────────────────────────
function MessageBubble({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className={cn('flex gap-3 max-w-3xl', isUser ? 'ml-auto flex-row-reverse' : '')}
    >
      <div className={cn(
        'w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border',
        isUser ? 'bg-white/5 border-white/10 text-white/40' : 'bg-neon-green/10 border-neon-green/30 text-neon-green'
      )}>
        {isUser ? <User className="w-4 h-4"/> : <Bot className="w-4 h-4"/>}
      </div>
      <div className="space-y-1 min-w-0 flex-1">
        {!isUser && msg.intent && (
          <span className="text-[9px] font-mono text-white/25 block">{INTENT_LABELS[msg.intent] || msg.intent}</span>
        )}
        <div className={cn(
          'rounded-2xl text-sm leading-relaxed',
          isUser
            ? 'bg-neon-green text-obsidian font-semibold px-4 py-3 rounded-tr-sm'
            : 'bg-white/5 border border-white/10 p-4 space-y-3 rounded-tl-sm'
        )}>
          {isUser
            ? msg.content
            : <><StructuredResponse data={msg.structured}/><Sources sources={msg.structured?.sources}/></>
          }
        </div>
        <span className={cn('text-[9px] font-mono text-white/20 block', isUser ? 'text-right' : '')}>
          {msg.timestamp}
        </span>
      </div>
    </motion.div>
  );
}

// ─── Typing Indicator ────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      className="flex gap-3"
    >
      <div className="w-8 h-8 rounded-xl bg-neon-green/10 border border-neon-green/30 flex items-center justify-center shrink-0">
        <Bot className="w-4 h-4 text-neon-green"/>
      </div>
      <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white/5 border border-white/10 flex gap-1.5 items-center">
        {[0,150,300].map(d => (
          <motion.div key={d} className="w-1.5 h-1.5 bg-neon-green rounded-full"
            animate={{ y: [0,-5,0] }} transition={{ duration: 0.8, repeat: Infinity, delay: d/1000 }}/>
        ))}
        <span className="text-xs text-white/25 ml-2">Analyzing…</span>
      </div>
    </motion.div>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────
function ChatSidebar({ sessions, activeId, onSelect, onNew, onDelete }) {
  const formatTime = (ts) => {
    const d = new Date(ts);
    const now = new Date();
    const diffMs = now - d;
    const diffH = diffMs / 3600000;
    if (diffH < 1) return 'Just now';
    if (diffH < 24) return `${Math.floor(diffH)}h ago`;
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="w-64 h-full flex flex-col border-r border-white/8"
         style={{ background: 'rgba(8,8,8,0.7)', backdropFilter: 'blur(20px)' }}>

      {/* Logo / Brand */}
      <div className="p-4 border-b border-white/8">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-neon-green/20 border border-neon-green/30 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-neon-green"/>
          </div>
          <div>
            <span className="text-sm font-bold text-white tracking-tight">Clarity AI</span>
            <span className="text-[9px] font-mono text-neon-green/60 block leading-none">Financial Intelligence</span>
          </div>
        </div>
      </div>

      {/* New Chat */}
      <div className="p-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onNew}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-white/10
                     bg-white/5 hover:bg-neon-green/5 hover:border-neon-green/30 text-white/60
                     hover:text-neon-green transition-all duration-200 text-sm font-medium"
        >
          <Plus className="w-4 h-4"/>
          New Chat
        </motion.button>
      </div>

      {/* History */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1 pb-4">
        {sessions.length === 0 && (
          <div className="text-center py-8 text-white/20 text-xs">
            No previous chats
          </div>
        )}
        {[...sessions].reverse().map(session => (
          <motion.div
            key={session.id}
            whileHover={{ x: 2 }}
            onClick={() => onSelect(session.id)}
            className={cn(
              'group relative flex items-start gap-2 p-2.5 rounded-xl cursor-pointer transition-all duration-150',
              activeId === session.id
                ? 'bg-neon-green/10 border border-neon-green/20'
                : 'hover:bg-white/5 border border-transparent'
            )}
          >
            <MessageSquare className={cn(
              'w-3.5 h-3.5 shrink-0 mt-0.5',
              activeId === session.id ? 'text-neon-green' : 'text-white/30'
            )}/>
            <div className="flex-1 min-w-0">
              <p className={cn(
                'text-xs font-medium truncate',
                activeId === session.id ? 'text-white' : 'text-white/60'
              )}>
                {session.title}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <Clock className="w-2.5 h-2.5 text-white/20"/>
                <span className="text-[9px] text-white/25">{formatTime(session.createdAt)}</span>
              </div>
            </div>
            {/* Delete button */}
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(session.id); }}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:text-red-400 text-white/30"
            >
              <Trash2 className="w-3 h-3"/>
            </button>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-white/8">
        <p className="text-[9px] text-white/15 text-center font-mono">
          Powered by Groq · Finnhub · NewsAPI
        </p>
      </div>
    </div>
  );
}

// ─── InputBar ────────────────────────────────────────────────────────────────
function InputBar({ input, setInput, onSend, isLoading, disabled }) {
  return (
    <div className="space-y-2.5">
      {/* Quick chips */}
      <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
        {QUICK_ACTIONS.map(({ label, icon: Icon, prompt }) => (
          <motion.button
            key={label}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setInput(prompt)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
                       whitespace-nowrap border border-white/10 bg-white/5 text-white/50
                       hover:border-neon-green/40 hover:text-neon-green hover:bg-neon-green/5
                       transition-all duration-200 shrink-0"
          >
            <Icon className="w-3 h-3 shrink-0"/>
            {label}
          </motion.button>
        ))}
      </div>

      {/* Input row */}
      <div className={cn(
        'flex items-center gap-3 bg-white/5 border rounded-2xl px-4 py-2.5 transition-all duration-200',
        'focus-within:border-neon-green/40 focus-within:shadow-[0_0_24px_rgba(57,255,20,0.07)]',
        'border-white/10'
      )}>
        <Sparkles className="w-4 h-4 text-white/15 shrink-0"/>
        <input
          type="text"
          value={input}
          disabled={isLoading || disabled}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onSend()}
          placeholder="Ask about stocks, portfolios, news, or market risk…"
          className="flex-1 bg-transparent border-none outline-none text-sm py-1.5 placeholder:text-white/20 text-white"
        />
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={onSend}
          disabled={!input.trim() || isLoading}
          className={cn(
            'p-2 rounded-xl transition-all duration-200',
            input.trim() && !isLoading
              ? 'bg-neon-green text-obsidian hover:brightness-110 shadow-lg shadow-neon-green/20'
              : 'bg-white/5 text-white/20 cursor-not-allowed'
          )}
        >
          <Send className="w-4 h-4"/>
        </motion.button>
      </div>
    </div>
  );
}

// ─── Empty State ─────────────────────────────────────────────────────────────
function EmptyState({ onPrompt }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-8 text-center">
      <div>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'backOut' }}
          className="w-16 h-16 rounded-2xl bg-neon-green/10 border border-neon-green/30 flex items-center justify-center mx-auto mb-4"
        >
          <Sparkles className="w-7 h-7 text-neon-green"/>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-bold text-white mb-2"
        >
          How can I help you today?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-white/40 text-sm max-w-sm"
        >
          Ask about stocks, build portfolios, get market news, or analyze financial risk.
        </motion.p>
      </div>

      {/* Suggestion cards */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-3 w-full max-w-lg"
      >
        {QUICK_ACTIONS.map(({ label, icon: Icon, prompt }) => (
          <button
            key={label}
            onClick={() => onPrompt(prompt)}
            className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/10
                       hover:bg-neon-green/5 hover:border-neon-green/20 text-left
                       transition-all duration-200 group"
          >
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center
                            group-hover:bg-neon-green/10 group-hover:border-neon-green/20 transition-all shrink-0">
              <Icon className="w-4 h-4 text-white/40 group-hover:text-neon-green transition-colors"/>
            </div>
            <div>
              <p className="text-xs font-semibold text-white/70 group-hover:text-white transition-colors">{label}</p>
              <p className="text-[10px] text-white/30 mt-0.5 leading-snug">{prompt}</p>
            </div>
          </button>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Main Assistant Component ─────────────────────────────────────────────────
export function Assistant({ type = 'user' }) {
  const userMode = type === 'company' ? 'company' : 'user';

  const [sessions, setSessions]   = React.useState(() => loadSessions());
  const [activeId, setActiveId]   = React.useState(null);
  const [messages, setMessages]   = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError]         = React.useState(null);
  const [input, setInput]         = React.useState('');
  const scrollRef                 = React.useRef(null);

  // Sync to localStorage
  React.useEffect(() => { saveSessions(sessions); }, [sessions]);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, 60);
  };

  // --- Session management ---
  const startNewChat = React.useCallback(() => {
    const id = crypto.randomUUID();
    const session = makeSession(id);
    setSessions(prev => [...prev, session]);
    setActiveId(id);
    setMessages([]);
    setError(null);
    setInput('');
  }, []);

  const loadSession = (id) => {
    const session = sessions.find(s => s.id === id);
    if (!session) return;
    setActiveId(id);
    setMessages(session.messages);
    setError(null);
    scrollToBottom();
  };

  const deleteSession = (id) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    if (activeId === id) {
      setActiveId(null);
      setMessages([]);
    }
  };

  const updateSession = (id, newMessages) => {
    setSessions(prev => prev.map(s => s.id !== id ? s : {
      ...s,
      title: newMessages.find(m => m.role === 'user')?.content?.slice(0, 40) || 'New Chat',
      messages: newMessages,
    }));
  };

  // --- Send message ---
  const sendMessage = async (text) => {
    if (!text?.trim()) return;

    // Ensure there's an active session
    let sessionId = activeId;
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      const session = makeSession(sessionId);
      setSessions(prev => [...prev, session]);
      setActiveId(sessionId);
    }

    const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { role: 'user', content: text, timestamp: ts };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    updateSession(sessionId, nextMessages);
    setIsLoading(true);
    setError(null);
    scrollToBottom();

    try {
      const res = await fetch('http://localhost:8000/api/chat/', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, userMode, sessionId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.message || 'Server error');

      const botMsg = {
        role:       'assistant',
        content:    data.response?.insight || data.response?.summary || '',
        structured: data.response,
        intent:     data.intent,
        timestamp:  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      const finalMessages = [...nextMessages, botMsg];
      setMessages(finalMessages);
      updateSession(sessionId, finalMessages);
      scrollToBottom();
    } catch (err) {
      setError(err.message || 'Failed to reach AI service. Ensure it is running on port 8000.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput('');
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden rounded-2xl border border-white/8"
         style={{ background: 'rgba(6,6,6,0.9)' }}>

      {/* SIDEBAR */}
      <ChatSidebar
        sessions={sessions}
        activeId={activeId}
        onSelect={loadSession}
        onNew={startNewChat}
        onDelete={deleteSession}
      />

      {/* MAIN CHAT */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-white/8"
             style={{ background: 'rgba(8,8,8,0.6)', backdropFilter: 'blur(16px)' }}>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold text-white/80">
              {activeId
                ? sessions.find(s => s.id === activeId)?.title || 'Chat'
                : 'Clarity AI'
              }
            </h1>
            {activeId && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-neon-green/10 border border-neon-green/20 text-neon-green font-bold uppercase tracking-widest">
                Active
              </span>
            )}
          </div>
          <div className="text-[9px] font-mono text-white/20">
            {userMode.toUpperCase()} MODE · Groq-2 · Finnhub
          </div>
        </div>

        {/* Error banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 border-b border-red-500/20 text-red-400 text-xs"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0"/>
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-smooth">
          {messages.length === 0
            ? <EmptyState onPrompt={(p) => { setInput(p); }}/>
            : (
              <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
                {messages.map((msg, i) => <MessageBubble key={i} msg={msg}/>)}
                <AnimatePresence>
                  {isLoading && <TypingIndicator/>}
                </AnimatePresence>
              </div>
            )
          }
        </div>

        {/* Input area */}
        <div className="px-6 pb-6 pt-4 border-t border-white/8"
             style={{ background: 'rgba(6,6,6,0.8)', backdropFilter: 'blur(16px)' }}>
          <div className="max-w-3xl mx-auto">
            <InputBar
              input={input}
              setInput={setInput}
              onSend={handleSend}
              isLoading={isLoading}
            />
            <p className="text-[9px] text-white/15 text-center mt-3 font-mono">
              Clarity AI can make mistakes. Always verify financial information independently.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
