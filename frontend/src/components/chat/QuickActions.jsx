import React from "react";
import { cn } from "../../lib/utils";

const ACTIONS = [
  { label: "Analyze AAPL", query: "Analyze Apple stock AAPL" },
  { label: "Market Summary", query: "Give me a current market summary and outlook" },
  { label: "Portfolio Idea", query: "Suggest a balanced portfolio for long-term growth" },
  { label: "Risk Check TSLA", query: "What is the risk level for TSLA right now?" },
  { label: "Latest Crypto News", query: "What are the latest news about cryptocurrency?" },
];

const QuickActions = ({ onActionClick }) => {
  return (
    <div className="flex gap-2 flex-wrap">
      {ACTIONS.map((action) => (
        <button
          key={action.label}
          onClick={() => onActionClick(action.query)}
          className={cn(
            "px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-200",
            "bg-white/5 border-white/10 text-white/50",
            "hover:bg-neon-green/10 hover:border-neon-green/30 hover:text-neon-green"
          )}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
