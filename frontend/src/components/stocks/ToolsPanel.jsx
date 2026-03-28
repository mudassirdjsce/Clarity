import React from 'react';
import { Rocket, Gem, BadgeDollarSign, ChevronRight } from 'lucide-react';

const tools = [
  {
    name: 'IPO',
    desc: 'Apply for upcoming IPOs',
    icon: Rocket,
    badge: '2 open',
    badgeColor: 'text-orange-600 bg-orange-50 border-orange-100',
    iconColor: 'text-orange-500',
    iconBg: 'bg-orange-50',
  },
  {
    name: 'Bonds',
    desc: 'Government & corporate bonds',
    icon: BadgeDollarSign,
    badge: null,
    iconColor: 'text-indigo-500',
    iconBg: 'bg-indigo-50',
  },
  {
    name: 'Sovereign Gold Bonds',
    desc: 'RBI-backed gold investments',
    icon: Gem,
    badge: null,
    iconColor: 'text-yellow-600',
    iconBg: 'bg-yellow-50',
  },
];

export default function ToolsPanel() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="px-5 pt-5 pb-2">
        <h2 className="text-base font-semibold text-gray-800">Products &amp; Tools</h2>
        <p className="text-xs text-gray-400 mt-0.5">Explore more investment options</p>
      </div>

      <div className="px-3 pb-3">
        {tools.map((tool, i) => {
          const Icon = tool.icon;
          return (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
            >
              {/* Icon + text */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${tool.iconBg}`}>
                  <Icon className={`w-5 h-5 ${tool.iconColor}`} />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-800 leading-tight">{tool.name}</p>
                  <p className="text-xs text-gray-400">{tool.desc}</p>
                </div>
              </div>

              {/* Badge + chevron */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {tool.badge && (
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${tool.badgeColor}`}>
                    {tool.badge}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-600 transition-colors" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
