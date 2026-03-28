import React from 'react';
import { Send, Bot, User, Sparkles, Maximize2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import useChat from '../../hooks/useChat';
import StructuredResponse from '../../components/chat/StructuredResponse';
import ModeToggle from '../../components/chat/ModeToggle';
import QuickActions from '../../components/chat/QuickActions';

const INTENT_LABELS = {
  stock_analysis: '📈 Stock Analysis',
  news:           '📰 News Intelligence',
  portfolio:      '💼 Portfolio Strategy',
  risk:           '⚠️ Risk Assessment',
  general:        '💬 General',
};

export function Assistant({ type = 'user' }) {
  const { messages, isLoading, error, mode, setMode, sendMessage, scrollRef } = useChat(
    type === 'company' ? 'pro' : 'beginner'
  );

  const [input, setInput] = React.useState('');

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput('');
  };

  const WELCOME = type === 'company'
    ? "Institutional Node Active. I'm Clarity, your AI financial strategist. I'll provide institutional-grade analysis with full source attribution and risk profiling."
    : "Hello! I'm Clarity, your AI financial assistant. Ask me to analyze stocks, interpret news, suggest portfolios, or explain financial concepts.";

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col gap-4">
      
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-4xl font-display font-extrabold tracking-tight mb-1 flex items-center gap-3">
            Clarity AI
            <div className="px-2 py-0.5 rounded bg-neon-green/10 border border-neon-green/20">
              <span className="text-[10px] font-bold text-neon-green uppercase tracking-widest">Active</span>
            </div>
          </h1>
          <p className="text-white/40 font-medium text-sm">
            Multi-agent financial intelligence · <span className="text-neon-green/60 font-mono text-xs">{mode.toUpperCase()} MODE</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ModeToggle mode={mode} setMode={setMode} />
          <button className="p-2 hover:bg-white/5 rounded-xl border border-white/10 transition-colors">
            <Maximize2 className="w-4 h-4 text-white/40" />
          </button>
        </div>
      </div>

      {/* ── Quick Actions ──────────────────────────────────────────────────── */}
      <QuickActions onActionClick={(q) => { sendMessage(q); }} />

      {/* ── Error Banner ──────────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* ── Chat Area ─────────────────────────────────────────────────────── */}
      <div className="flex-1 bento-card flex flex-col p-0 overflow-hidden relative">
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth"
        >
          {/* Welcome message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4 max-w-[85%]"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border bg-neon-green/10 border-neon-green/30 text-neon-green">
              <Bot className="w-5 h-5" />
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-sm leading-relaxed text-white/80">
              {WELCOME}
            </div>
          </motion.div>

          {/* Message list */}
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-4",
                msg.role === 'user' ? "ml-auto flex-row-reverse max-w-[70%]" : "max-w-[90%]"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
                msg.role === 'assistant'
                  ? "bg-neon-green/10 border-neon-green/30 text-neon-green"
                  : "bg-white/5 border-white/10 text-white/60"
              )}>
                {msg.role === 'assistant' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>

              <div className="space-y-2 flex-1 min-w-0">
                {/* Intent label for assistant */}
                {msg.role === 'assistant' && msg.intent && (
                  <span className="text-[10px] font-mono text-white/30">
                    {INTENT_LABELS[msg.intent] || msg.intent}
                  </span>
                )}

                <div className={cn(
                  "p-4 rounded-2xl text-sm leading-relaxed",
                  msg.role === 'assistant'
                    ? "bg-white/5 border border-white/10 text-white/80"
                    : "bg-neon-green text-obsidian font-medium"
                )}>
                  {msg.content}

                  {/* Structured response card */}
                  {msg.role === 'assistant' && msg.structured && (
                    <StructuredResponse data={msg.structured} />
                  )}
                </div>

                <p className={cn(
                  "text-[10px] font-mono text-white/20",
                  msg.role === 'user' ? "text-right" : ""
                )}>
                  {msg.timestamp}
                </p>
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-neon-green/10 border border-neon-green/30 flex items-center justify-center">
                <Bot className="w-5 h-5 text-neon-green" />
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex gap-1.5 items-center">
                <div className="w-1.5 h-1.5 bg-neon-green rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-neon-green rounded-full animate-bounce [animation-delay:0.15s]" />
                <div className="w-1.5 h-1.5 bg-neon-green rounded-full animate-bounce [animation-delay:0.3s]" />
                <span className="text-xs text-white/30 ml-2">Analyzing with multi-agent system...</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Input Bar ──────────────────────────────────────────────────── */}
        <div className="p-4 border-t border-white/10 glass">
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-2 focus-within:border-neon-green/50 transition-colors">
            <Sparkles className="w-4 h-4 text-white/20 shrink-0" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about stocks, news, portfolios, or market risk..."
              className="flex-1 bg-transparent border-none outline-none text-sm py-2 placeholder:text-white/20 text-white"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={cn(
                "p-2 rounded-xl transition-all",
                input.trim() && !isLoading
                  ? "bg-neon-green text-obsidian shadow-lg hover:brightness-110"
                  : "bg-white/5 text-white/20 cursor-not-allowed"
              )}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
