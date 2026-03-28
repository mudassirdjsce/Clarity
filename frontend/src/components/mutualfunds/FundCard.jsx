import React from 'react';

export default function FundCard({ name, type, returns, duration }) {
  const initial = name ? name.substring(0, 1).toUpperCase() : 'F';

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group flex flex-col justify-between min-h-[140px]">
      
      {/* Top row: Logo and Type/Badge */}
      <div className="flex justify-between items-start mb-3">
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-sm text-gray-500 group-hover:bg-green-50 group-hover:text-green-600 transition-colors">
          {initial}
        </div>
        <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100 uppercase tracking-wide">
          {type}
        </span>
      </div>

      {/* Middle row: Name */}
      <h3 className="font-semibold text-gray-800 text-sm leading-tight mb-3 line-clamp-2">
        {name}
      </h3>

      {/* Bottom row: Returns */}
      <div className="flex items-center gap-1.5 mt-auto">
        <span className="text-sm font-bold text-green-500">{returns}</span>
        <span className="text-xs text-gray-400">({duration})</span>
      </div>
    </div>
  );
}
