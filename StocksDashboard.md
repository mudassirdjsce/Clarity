# Stocks Dashboard Implementation

Here is the complete React code for the Stocks Dashboard replicating the Groww-like experience. You can copy this or provide it directly to Claude.

## `src/pages/Stocks.jsx`
```jsx
import React from 'react';
import Header from '../components/stocks/Header';
import MarketTicker from '../components/stocks/MarketTicker';
import StockCard from '../components/stocks/StockCard';
import MoversTable from '../components/stocks/MoversTable';
import InvestmentCard from '../components/stocks/InvestmentCard';
import ToolsPanel from '../components/stocks/ToolsPanel';

const topStocks = [
  { name: 'Reliance Ind.', price: '₹2,950.40', change: '+1.2%', isPositive: true },
  { name: 'TCS', price: '₹3,840.10', change: '+0.8%', isPositive: true },
  { name: 'HDFC Bank', price: '₹1,440.50', change: '-0.5%', isPositive: false },
  { name: 'Infosys', price: '₹1,480.20', change: '+2.1%', isPositive: true },
];

export default function Stocks() {
  return (
    <div className="min-h-screen bg-gray-50 pb-10 font-sans text-gray-800">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <MarketTicker />
        
        <div className="grid grid-cols-12 gap-6 mt-6">
          {/* LEFT SECTION */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            
            {/* Most Bought Stocks */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Most Bought on Clarity</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {topStocks.map((stock, idx) => (
                  <StockCard key={idx} {...stock} />
                ))}
              </div>
            </section>

            {/* Top Movers */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Top Movers Today</h2>
                <select className="border border-gray-200 bg-white rounded-lg px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option>NIFTY 100</option>
                  <option>NIFTY 50</option>
                </select>
              </div>
              <MoversTable />
            </section>
            
          </div>
          
          {/* RIGHT SECTION */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <InvestmentCard />
            <ToolsPanel />
          </div>
        </div>
      </main>
    </div>
  );
}
```

## `src/components/stocks/Header.jsx`
```jsx
import React from 'react';
import { Search, Bell, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo & Navigation */}
        <div className="flex items-center gap-8">
          <div className="text-2xl font-bold tracking-tight text-gray-900">
            Clarity<span className="text-green-500">.</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#" className="font-medium inline-block border-b-2 border-gray-800 text-gray-800 pb-[19px] mt-[19px]">Stocks</a>
            <a href="#" className="font-medium text-gray-500 hover:text-gray-800 transition">F&O</a>
            <a href="#" className="font-medium text-gray-500 hover:text-gray-800 transition">Mutual Funds</a>
          </nav>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-6 flex-1 justify-end">
          <div className="relative hidden md:block w-72 lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="What are you looking for today?" 
              className="w-full bg-gray-100 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition transition-shadow"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <button className="text-gray-500 hover:text-gray-800 hover:bg-gray-100 p-2 rounded-full transition">
              <Bell className="w-5 h-5" />
            </button>
            <button className="bg-gray-100 w-9 h-9 rounded-full flex items-center justify-center hover:ring-2 hover:ring-gray-200 transition">
              <User className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
```

## `src/components/stocks/MarketTicker.jsx`
```jsx
import React from 'react';

const indices = [
  { name: 'NIFTY 50', value: '22,514.65', change: '+142.20 (0.64%)', isPositive: true },
  { name: 'SENSEX', value: '74,227.63', change: '+350.81 (0.47%)', isPositive: true },
  { name: 'BANKNIFTY', value: '48,061.30', change: '-42.10 (0.09%)', isPositive: false },
  { name: 'FINNIFTY', value: '21,418.90', change: '+89.50 (0.42%)', isPositive: true },
];

export default function MarketTicker() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
      {indices.map((idx, i) => (
        <div key={i} className="flex-shrink-0 bg-white border border-gray-200 rounded-xl px-4 py-3 min-w-[180px] cursor-pointer hover:shadow-md transition-shadow">
          <p className="text-sm font-medium text-gray-500 mb-1">{idx.name}</p>
          <p className="text-lg font-semibold text-gray-800">{idx.value}</p>
          <p className={`text-xs font-medium mt-0.5 ${idx.isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {idx.change}
          </p>
        </div>
      ))}
    </div>
  );
}
```

## `src/components/stocks/StockCard.jsx`
```jsx
import React from 'react';

export default function StockCard({ name, price, change, isPositive }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition duration-200 group">
      <div className="w-10 h-10 bg-gray-100 rounded-lg mb-3 flex items-center justify-center font-bold text-gray-400 group-hover:bg-gray-200 transition">
        {name.substring(0, 1)}
      </div>
      <h3 className="font-medium text-gray-800 truncate mb-1">{name}</h3>
      <p className="text-sm font-semibold">{price}</p>
      <p className={`text-xs mt-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {change}
      </p>
    </div>
  );
}
```

## `src/components/stocks/MoversTable.jsx`
```jsx
import React, { useState } from 'react';

const gainers = [
  { name: 'Tata Motors', price: '₹1,023.50', change: '+4.5%', vol: '24.5M' },
  { name: 'Zomato', price: '₹188.40', change: '+3.2%', vol: '68.2M' },
  { name: 'ITC', price: '₹428.90', change: '+2.1%', vol: '18.4M' },
  { name: 'SBI', price: '₹812.30', change: '+1.8%', vol: '12.1M' },
];

export default function MoversTable() {
  const [activeTab, setActiveTab] = useState('Gainers');

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {['Gainers', 'Losers', 'Volume shockers'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm font-medium transition ${
              activeTab === tab 
                ? 'text-green-600 border-b-2 border-green-500 bg-green-50/30' 
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-xs text-gray-500">
              <th className="font-medium p-4 border-b border-gray-200">Company</th>
              <th className="font-medium p-4 border-b border-gray-200">Market Price</th>
              <th className="font-medium p-4 border-b border-gray-200 text-right">Volume</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {gainers.map((stock, i) => (
              <tr key={i} className="group hover:bg-gray-50 cursor-pointer transition border-b border-gray-100 last:border-0">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-500">
                    {stock.name[0]}
                  </div>
                  <span className="font-medium text-gray-800">{stock.name}</span>
                </td>
                <td className="p-4 relative">
                  <div>{stock.price}</div>
                  <div className="text-green-500 text-xs">{stock.change}</div>
                </td>
                <td className="p-4 text-right text-gray-600">{stock.vol}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-3 border-t border-gray-200 text-center">
        <button className="text-sm font-medium text-green-600 hover:text-green-700">View All</button>
      </div>
    </div>
  );
}
```

## `src/components/stocks/InvestmentCard.jsx`
```jsx
import React from 'react';
import { Briefcase } from 'lucide-react';

export default function InvestmentCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 text-left mb-6">Your Investments</h2>
      
      <div className="py-8 flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
          <Briefcase className="w-8 h-8 text-blue-400" />
        </div>
        <p className="font-medium text-gray-800 mb-1">You haven't invested yet</p>
        <p className="text-sm text-gray-500 mb-6 max-w-[200px]">
          Start your investment journey today to build your wealth for tomorrow.
        </p>
        <button className="bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 px-6 rounded-lg transition-colors shadow-sm">
          Start Investing
        </button>
      </div>
    </div>
  );
}
```

## `src/components/stocks/ToolsPanel.jsx`
```jsx
import React from 'react';
import { Rocket, FileText, Smartphone, ChevronRight } from 'lucide-react';

const tools = [
  { name: 'IPO', icon: Rocket, badge: '2 open', color: 'text-orange-500', bg: 'bg-orange-50' },
  { name: 'Sovereign Gold Bonds', icon: FileText, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { name: 'Clarity Pay', icon: Smartphone, badge: 'New', color: 'text-blue-500', bg: 'bg-blue-50' },
];

export default function ToolsPanel() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 p-5 pb-2">Products & Tools</h2>
      
      <div className="px-2 pb-3">
        {tools.map((tool, i) => {
          const Icon = tool.icon;
          return (
            <div key={i} className="flex items-center justify-between p-3 mx-2 my-1 hover:bg-gray-50 rounded-lg cursor-pointer transition group">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tool.bg}`}>
                  <Icon className={`w-5 h-5 ${tool.color}`} />
                </div>
                <span className="font-medium text-gray-800">{tool.name}</span>
              </div>
              
              <div className="flex items-center gap-3">
                {tool.badge && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                    {tool.badge}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-800 transition" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

## Additional Instructions for Claude
- Ensure `lucide-react` is installed (`npm install lucide-react`).
- This layout relies on Tailwind CSS classes (`grid-cols-12`, formatting modifiers, etc).
- Check that global settings include the React router setup or replace empty placeholder anchor tags in the `Header` with appropriate semantic routing links (`<Link>`).
