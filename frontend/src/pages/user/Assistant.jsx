import React from 'react';
import { Send, Bot, User, Sparkles, AlertCircle, TrendingUp, Newspaper,
         Briefcase, ShieldAlert, ChevronRight, Plus, MessageSquare,
         Clock, Trash2, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { VoiceInputButton } from '../../components/chat/VoiceInputButton';
import { FileUploadButton } from '../../components/chat/FileUploadButton';
import { SpeakButton } from '../../components/chat/SpeakButton';
import { useTranslation } from 'react-i18next';

// ─── Constants ───────────────────────────────────────────────────────────────
const INTENT_LABELS = {
  stock_analysis: '📈 Stock Analysis',
  news:           '📰 News Intelligence',
  portfolio:      '💼 Portfolio Strategy',
  general:        '💬 General',
};

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

      {recoKey && (
        <div className={cn('inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-bold', RECO_COLOR[recoKey] || RECO_COLOR.Hold)}>
          <span className="text-[9px] uppercase tracking-widest opacity-70">Recommendation</span>
          <span>{recoKey}</span>
        </div>
      )}

      {data.explanation && (
        <p className="text-xs text-white/40 leading-relaxed border-t border-white/5 pt-3">{data.explanation}</p>
      )}
    </div>
  );
}

function StructuredResponse({ data }) {
  if (data == null) return <p className="text-sm text-white/40 italic">No response data.</p>;

  if (typeof data === 'string') {
    const trimmed = data.trim();
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try { return <StructuredResponse data={JSON.parse(trimmed)} />; } catch { /* fall through */ }
    }
    return <p className="text-sm text-white/70 leading-relaxed">{data}</p>;
  }

  if (typeof data !== 'object') return <p className="text-sm text-white/70">{String(data)}</p>;

  if (data.error) return (
    <div className="flex items-start gap-2 text-red-400 text-sm">
      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5"/>
      <span>{data.error}</span>
    </div>
  );

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
  const { t } = useTranslation();
  if (!sources?.length) return null;
  return (
    <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-white/5">
      <span className="text-[9px] uppercase tracking-widest text-white/20 font-bold">{t('sources')}</span>
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

  const ttsText = isUser
    ? msg.content
    : (typeof msg.structured === 'string'
        ? msg.structured
        : msg.structured?.insight || msg.structured?.summary || msg.content || '');

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className={cn('flex gap-3 max-w-3xl group', isUser ? 'ml-auto flex-row-reverse' : '')}
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
        <div className={cn('flex items-center gap-1.5', isUser ? 'justify-end' : 'justify-start')}>
          <span className="text-[9px] font-mono text-white/20">{msg.timestamp}</span>
          <SpeakButton text={ttsText} compact />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Typing Indicator ────────────────────────────────────────────────────────
function TypingIndicator() {
  const { t } = useTranslation();
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
        <span className="text-xs text-white/25 ml-2">{t('analyzing')}</span>
      </div>
    </motion.div>
  );
}

// ─── Chat Sidebar ─────────────────────────────────────────────────────────────
function ChatSidebar({ sessions, activeId, onSelect, onNew, onDelete }) {
  const { t } = useTranslation();

  const formatTime = (ts) => {
    const d = new Date(ts);
    const now = new Date();
    const diffMs = now - d;
    const diffH = diffMs / 3600000;
    if (diffH < 1) return t('just_now');
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
            <span className="text-sm font-bold text-white tracking-tight">{t('clarity_ai')}</span>
            <span className="text-[9px] font-mono text-neon-green/60 block leading-none">{t('financial_intelligence')}</span>
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
          {t('new_chat')}
        </motion.button>
      </div>

      {/* History */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1 pb-4">
        {sessions.length === 0 && (
          <div className="text-center py-8 text-white/20 text-xs">
            {t('no_previous_chats')}
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
          {t('powered_by')}
        </p>
      </div>
    </div>
  );
}

// ─── InputBar ────────────────────────────────────────────────────────────────
function InputBar({ input, setInput, onSend, onFileUpload, isLoading, disabled }) {
  const { t } = useTranslation();

  // Quick actions built inside component so t() is in scope
  const QUICK_ACTIONS = [
    { labelKey: 'quick_action_analyze_stock',   icon: TrendingUp,  prompt: 'Analyze RELIANCE stock'         },
    { labelKey: 'quick_action_market_news',     icon: Newspaper,   prompt: 'Show latest market news'         },
    { labelKey: 'quick_action_build_portfolio', icon: Briefcase,   prompt: 'Suggest a low risk portfolio'    },
    { labelKey: 'quick_action_risk_analysis',   icon: ShieldAlert, prompt: 'What are current market risks?'  },
  ];

  const handleVoiceInput = (text) => {
    setInput(prev => prev ? `${prev} ${text}` : text);
  };

  return (
    <div className="space-y-2.5">
      {/* Quick chips */}
      <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
        {QUICK_ACTIONS.map(({ labelKey, icon: Icon, prompt }) => (
          <motion.button
            key={labelKey}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setInput(prompt)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
                       whitespace-nowrap border border-white/10 bg-white/5 text-white/50
                       hover:border-neon-green/40 hover:text-neon-green hover:bg-neon-green/5
                       transition-all duration-200 shrink-0"
          >
            <Icon className="w-3 h-3 shrink-0"/>
            {t(labelKey)}
          </motion.button>
        ))}
      </div>

      {/* Input row */}
      <div className={cn(
        'flex items-center gap-2 bg-white/5 border rounded-2xl px-3 py-2 transition-all duration-200',
        'focus-within:border-neon-green/40 focus-within:shadow-[0_0_24px_rgba(57,255,20,0.07)]',
        'border-white/10'
      )}>
        <FileUploadButton
          disabled={isLoading || disabled}
          onFileParsed={onFileUpload}
        />
        <input
          type="text"
          value={input}
          disabled={isLoading || disabled}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onSend()}
          placeholder={t('chat_placeholder')}
          className="flex-1 bg-transparent border-none outline-none text-sm py-1.5 px-1 placeholder:text-white/20 text-white"
        />
        <VoiceInputButton
          disabled={isLoading || disabled}
          onTranscript={handleVoiceInput}
        />
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => onSend()}
          disabled={!input.trim() || isLoading}
          className={cn(
            'p-2 rounded-xl transition-all duration-200 shrink-0 ml-1',
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
  const { t } = useTranslation();

  const QUICK_ACTIONS = [
    { labelKey: 'quick_action_analyze_stock',   icon: TrendingUp,  prompt: 'Analyze RELIANCE stock'         },
    { labelKey: 'quick_action_market_news',     icon: Newspaper,   prompt: 'Show latest market news'         },
    { labelKey: 'quick_action_build_portfolio', icon: Briefcase,   prompt: 'Suggest a low risk portfolio'    },
    { labelKey: 'quick_action_risk_analysis',   icon: ShieldAlert, prompt: 'What are current market risks?'  },
  ];

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
          {t('empty_state_heading')}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-white/40 text-sm max-w-sm"
        >
          {t('empty_state_subtext')}
        </motion.p>
      </div>

      {/* Suggestion cards */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-3 w-full max-w-lg"
      >
        {QUICK_ACTIONS.map(({ labelKey, icon: Icon, prompt }) => (
          <button
            key={labelKey}
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
              <p className="text-xs font-semibold text-white/70 group-hover:text-white transition-colors">{t(labelKey)}</p>
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
  const { t } = useTranslation();
  const hasPro = localStorage.getItem('clarityProStatus') === 'true';
  const userMode = (type === 'company' || hasPro) ? 'company' : 'user';

  const [sessions, setSessions]   = React.useState(() => loadSessions());
  const [activeId, setActiveId]   = React.useState(null);
  const [messages, setMessages]   = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError]         = React.useState(null);
  const [input, setInput]         = React.useState('');
  const scrollRef                 = React.useRef(null);

  React.useEffect(() => { saveSessions(sessions); }, [sessions]);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, 60);
  };

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

  const sendMessage = async (text) => {
    if (!text?.trim()) return;

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

  const handleSend = (directInput) => {
    const textToSend = typeof directInput === 'string' ? directInput : input;
    if (!textToSend.trim() || isLoading) return;
    sendMessage(textToSend);
    if (!directInput) setInput('');
  };

  const sendFileMessage = React.useCallback(({ displayText, backendContent }) => {
    if (!backendContent?.trim()) return;

    let sessionId = activeId;
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      const session = makeSession(sessionId);
      setSessions(prev => [...prev, session]);
      setActiveId(sessionId);
    }

    const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { role: 'user', content: displayText, timestamp: ts };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    updateSession(sessionId, nextMessages);
    setIsLoading(true);
    setError(null);
    scrollToBottom();

    fetch('http://localhost:8000/api/chat/', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: backendContent, userMode, sessionId }),
    })
      .then(res => res.ok ? res.json() : res.json().then(d => Promise.reject(d)))
      .then(data => {
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
      })
      .catch(err => {
        setError(err?.detail || err?.message || 'Failed to analyze file.');
      })
      .finally(() => setIsLoading(false));
  }, [activeId, messages, userMode, sessions]);

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
                : t('clarity_ai')
              }
            </h1>
            {activeId && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-neon-green/10 border border-neon-green/20 text-neon-green font-bold uppercase tracking-widest">
                {t('active')}
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
              onFileUpload={sendFileMessage}
              isLoading={isLoading}
            />
            <p className="text-[9px] text-white/15 text-center mt-3 font-mono">
              {t('ai_disclaimer')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
