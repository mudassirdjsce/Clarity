import React from 'react';
import { Search, ShoppingCart, User } from 'lucide-react';

export default function HeaderMF() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top bar */}
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="text-2xl font-bold tracking-tight text-gray-900">
              Clarity<span className="text-green-500">.</span>
            </div>
            {/* Primary Product Tabs */}
            <nav className="hidden md:flex gap-6 h-16 items-end">
              <a href="#" className="font-medium text-gray-500 hover:text-gray-800 transition pb-5 text-sm">Stocks</a>
              <a href="#" className="font-medium text-gray-500 hover:text-gray-800 transition pb-5 text-sm">F&amp;O</a>
              <a href="#" className="font-medium text-gray-800 border-b-2 border-green-500 pb-5 text-sm">Mutual Funds</a>
            </nav>
          </div>

          <div className="flex items-center gap-4 flex-1 justify-end ml-8">
            <div className="relative hidden md:block w-64 lg:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="What are you looking for today?"
                className="w-full bg-gray-100 rounded-full pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition"
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="text-gray-500 hover:text-gray-800 hover:bg-gray-100 p-2 rounded-full transition">
                <ShoppingCart className="w-5 h-5" />
              </button>
              <button className="bg-gray-100 w-9 h-9 rounded-full flex items-center justify-center hover:ring-2 hover:ring-gray-300 transition">
                <User className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar (Sub-navigation) */}
        <div className="h-12 flex items-center gap-8 -mb-[1px]">
          <nav className="flex gap-6 h-full items-center">
            <a href="#" className="text-sm font-semibold text-green-600 border-b-2 border-green-500 h-full flex items-center">Explore</a>
            <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-800 transition h-full flex items-center">Dashboard</a>
            <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-800 transition h-full flex items-center">SIPs</a>
            <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-800 transition h-full flex items-center">Watchlist</a>
          </nav>
        </div>

      </div>
    </header>
  );
}
