import React from 'react';

const indices = [
  { name: 'NIFTY 50',    value: '22,514.65', change: '+142.20 (0.64%)', isPositive: true },
  { name: 'SENSEX',      value: '74,227.63', change: '+350.81 (0.47%)', isPositive: true },
  { name: 'BANKNIFTY',   value: '48,061.30', change: '-42.10 (0.09%)',  isPositive: false },
  { name: 'MIDCAPNIFTY', value: '21,418.90', change: '+89.50 (0.42%)',  isPositive: true },
];

export default function MarketTicker() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
      {indices.map((idx, i) => (
        <div
          key={i}
          className="flex-shrink-0 bg-white border border-gray-200 rounded-xl px-4 py-3 min-w-[170px] cursor-pointer hover:shadow-md transition-shadow"
        >
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{idx.name}</p>
          <p className="text-base font-bold text-gray-800">{idx.value}</p>
          <p className={`text-xs font-medium mt-0.5 ${idx.isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {idx.change}
          </p>
        </div>
      ))}
    </div>
  );
}
