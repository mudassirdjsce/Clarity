import React from 'react';
import { Layers, DownloadCloud, CodeSquare, ChevronRight } from 'lucide-react';

const tools = [
  {
    name: 'NFO Live',
    desc: 'Invest in New Fund Offers',
    icon: Layers,
    badge: '5 open',
    badgeColor: 'text-purple-600 bg-purple-50 border-purple-100',
    iconColor: 'text-purple-500',
    iconBg: 'bg-purple-50',
  },
  {
    name: 'Import Funds',
    desc: 'Track all mutual funds in one place',
    icon: DownloadCloud,
    badge: null,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-50',
  },
  {
    name: 'Compare Funds',
    desc: 'Compare funds and make informed decisions',
    icon: CodeSquare,
    badge: null,
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-50',
  },
];

export default function ToolsPanelMF() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden pb-1">
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-800">Products &amp; Tools</h2>
          <p className="text-xs text-gray-400 mt-1">Enhance your mutual fund journey</p>
        </div>
      </div>

      <div className="pt-2">
        {tools.map((tool, i) => {
          const Icon = tool.icon;
          return (
            <div
              key={i}
              className="flex items-center justify-between mx-2 my-1 px-4 py-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
            >
              {/* Left group */}
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${tool.iconBg}`}>
                  <Icon className={`w-5 h-5 ${tool.iconColor}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-800 mb-0.5 leading-tight">{tool.name}</h3>
                  <p className="text-xs text-gray-400 group-hover:text-gray-500 transition-colors">{tool.desc}</p>
                </div>
              </div>

              {/* Right group */}
              <div className="flex items-center gap-3">
                {tool.badge && (
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${tool.badgeColor}`}>
                    {tool.badge}
                  </span>
                )}
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
