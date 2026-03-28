import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Zap, 
  BarChart2, 
  TrendingUp,
  Paperclip,
  Mic,
  Maximize2
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export function Assistant({ type = 'company' }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Institutional Node Active. I'm Clarity, your AI financial strategist. I've analyzed the global liquidity pools. How can I assist with your institutional strategy today?",
      timestamp: '09:41 AM',
      type: 'text'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const assistantMessage = {
        role: 'assistant',
        content: "Institutional Analysis: Whale accumulation detected. Strategy: Increase liquidity provision in SOL/USDC pools.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'analysis'
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-extrabold tracking-tight mb-2 flex items-center gap-3">
            Clarity AI Pro
            <div className="px-2 py-0.5 rounded bg-neon-green/10 border border-neon-green/20">
              <span className="text-[10px] font-bold text-neon-green uppercase tracking-widest">Active</span>
            </div>
          </h1>
          <p className="text-white/40 font-medium">Institutional-grade financial intelligence assistant.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-white/5 rounded-xl border border-white/10 transition-colors">
            <Maximize2 className="w-4 h-4 text-white/40" />
          </button>
        </div>
      </div>

      <div className="flex-1 bento-card flex flex-col p-0 overflow-hidden relative">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth"
        >
          {messages.map((msg, i) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={i}
              className={cn(
                "flex gap-4 max-w-[80%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
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
              
              <div className="space-y-2">
                <div className={cn(
                  "p-4 rounded-2xl text-sm leading-relaxed",
                  msg.role === 'assistant' 
                    ? "bg-white/5 border border-white/10" 
                    : "bg-neon-green text-obsidian font-medium"
                )}>
                  {msg.content}
                  
                  {msg.type === 'analysis' && (
                    <div className="mt-4 p-3 rounded-xl bg-obsidian/50 border border-white/5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-3 h-3 text-neon-green" />
                          <span className="text-[10px] font-bold text-white/60 uppercase">Institutional Forecast</span>
                        </div>
                        <span className="text-[10px] font-mono text-neon-green">Strong Buy</span>
                      </div>
                    </div>
                  )}
                </div>
                <p className={cn(
                  "text-[10px] font-mono text-white/20",
                  msg.role === 'user' ? "text-right" : ""
                )}>{msg.timestamp}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="p-6 border-t border-white/10 glass">
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-4 py-2 focus-within:border-neon-green/50 transition-colors">
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
              <Paperclip className="w-5 h-5 text-white/40" />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Enter institutional query..."
              className="flex-1 bg-transparent border-none outline-none text-sm py-2 placeholder:text-white/20"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim()}
              className={cn(
                "p-2 rounded-xl transition-all",
                input.trim() ? "bg-neon-green text-obsidian shadow-lg" : "bg-white/5 text-white/20"
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
