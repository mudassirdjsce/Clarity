import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function InvestmentCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h2 className="text-base font-semibold text-gray-800 mb-1">Your Investments</h2>
      <p className="text-xs text-gray-400 mb-6">Track your portfolio performance</p>

      <div className="flex flex-col items-center justify-center py-6 text-center">
        {/* Illustration */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center mb-4 shadow-inner">
          <TrendingUp className="w-9 h-9 text-green-500" />
        </div>

        <p className="font-semibold text-gray-800 mb-1">You haven't invested yet</p>
        <p className="text-sm text-gray-500 mb-6 max-w-[200px] leading-relaxed">
          Start your investment journey today to build wealth for tomorrow.
        </p>

        <button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 px-6 rounded-xl transition-colors shadow-sm text-sm">
          Start Investing
        </button>
      </div>
    </div>
  );
}
