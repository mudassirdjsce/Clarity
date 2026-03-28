import React from 'react';
import { CodeSquare, ChevronRight } from 'lucide-react';

/**
 * ToolsPanelMF
 * Props:
 *  - onCompare : () => void  — opens the Compare Funds drawer
 */
export default function ToolsPanelMF({ onCompare }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden pb-1">
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-800">Products &amp; Tools</h2>
          <p className="text-xs text-gray-400 mt-1">Enhance your mutual fund journey</p>
        </div>
      </div>

      <div className="pt-2">
        <div
          onClick={onCompare}
          className="flex items-center justify-between mx-2 my-1 px-4 py-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
        >
          {/* Left group */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 bg-emerald-50">
              <CodeSquare className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-800 mb-0.5 leading-tight">Compare Funds</h3>
              <p className="text-xs text-gray-400 group-hover:text-gray-500 transition-colors">Compare funds and make informed decisions</p>
            </div>
          </div>

          {/* Right group */}
          <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
        </div>
      </div>
    </div>
  );
}
