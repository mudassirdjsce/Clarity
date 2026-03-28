import React from 'react';

export default function InvestmentSummary() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      
      {/* Header section (Current Value & returns) */}
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Current Value</h2>
        <p className="text-3xl font-bold text-gray-800 mb-3">₹42,50,000</p>
        
        <div className="flex items-center gap-4 text-sm font-medium">
          <div className="flex flex-col">
            <span className="text-gray-400 text-xs mb-0.5">1D Returns</span>
            <span className="text-green-500 text-sm flex items-center gap-1">
              +₹12,450 <span className="text-xs bg-green-50 px-1 py-0.5 rounded text-green-600">(+0.3%)</span>
            </span>
          </div>
          <div className="w-[1px] h-8 bg-gray-200"></div>
          <div className="flex flex-col">
            <span className="text-gray-400 text-xs mb-0.5">Total Returns</span>
            <span className="text-green-500 text-sm flex items-center gap-1">
              +₹8,25,000 <span className="text-xs bg-green-50 px-1 py-0.5 rounded text-green-600">(+24.1%)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Details section (Invested & XIRR) */}
      <div className="px-6 py-4 bg-gray-50">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500 font-medium">Invested Value</span>
          <span className="text-sm font-semibold text-gray-800">₹34,25,000</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 font-medium tracking-wide">XIRR</span>
          <span className="text-sm font-semibold text-green-500">18.4%</span>
        </div>
      </div>
      
    </div>
  );
}
