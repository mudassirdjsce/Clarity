import React from 'react';

export default function StockCard({ name, price, change, isPositive }) {
  const initial = name ? name.substring(0, 1).toUpperCase() : '?';

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group">
      {/* Logo placeholder */}
      <div className="w-10 h-10 bg-gray-100 rounded-lg mb-3 flex items-center justify-center font-bold text-sm text-gray-500 group-hover:bg-green-50 group-hover:text-green-600 transition-colors">
        {initial}
      </div>

      <h3 className="font-semibold text-gray-800 text-sm truncate mb-1">{name}</h3>
      <p className="text-sm font-bold text-gray-900">{price}</p>
      <p className={`text-xs mt-1 font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {change}
      </p>
    </div>
  );
}
