import React, { useState } from 'react';

const data = {
  Gainers: [
    { name: 'Tata Motors',   ticker: 'TATAMOTORS', price: '₹1,023.50', change: '+4.5%', vol: '24.5M', isPositive: true },
    { name: 'Zomato',        ticker: 'ZOMATO',     price: '₹188.40',   change: '+3.2%', vol: '68.2M', isPositive: true },
    { name: 'ITC',           ticker: 'ITC',        price: '₹428.90',   change: '+2.1%', vol: '18.4M', isPositive: true },
    { name: 'State Bank',    ticker: 'SBIN',       price: '₹812.30',   change: '+1.8%', vol: '12.1M', isPositive: true },
    { name: 'HDFC Life',     ticker: 'HDFCLIFE',   price: '₹612.70',   change: '+1.3%', vol: '9.8M',  isPositive: true },
  ],
  Losers: [
    { name: 'Wipro',         ticker: 'WIPRO',      price: '₹478.20',   change: '-2.8%', vol: '14.1M', isPositive: false },
    { name: 'HCL Tech',      ticker: 'HCLTECH',    price: '₹1,389.60', change: '-1.9%', vol: '8.3M',  isPositive: false },
    { name: 'BPCL',          ticker: 'BPCL',       price: '₹622.40',   change: '-1.5%', vol: '11.2M', isPositive: false },
    { name: 'Bajaj Finance', ticker: 'BAJFINANCE', price: '₹7,241.00', change: '-1.2%', vol: '3.4M',  isPositive: false },
    { name: 'Coal India',    ticker: 'COALINDIA',  price: '₹441.80',   change: '-0.9%', vol: '7.6M',  isPositive: false },
  ],
  'Volume shockers': [
    { name: 'Adani Ports',   ticker: 'ADANIPORTS', price: '₹1,221.50', change: '+0.4%', vol: '112M',  isPositive: true },
    { name: 'ONGC',          ticker: 'ONGC',       price: '₹282.30',   change: '-0.3%', vol: '98.7M', isPositive: false },
    { name: 'Yes Bank',      ticker: 'YESBANK',    price: '₹22.45',    change: '+5.1%', vol: '284M',  isPositive: true },
    { name: 'Vodafone Idea', ticker: 'IDEA',       price: '₹14.20',    change: '+3.6%', vol: '319M',  isPositive: true },
    { name: 'IRCTC',         ticker: 'IRCTC',      price: '₹816.50',   change: '-0.7%', vol: '76.3M', isPositive: false },
  ],
};

const TABS = ['Gainers', 'Losers', 'Volume shockers'];

export default function MoversTable() {
  const [activeTab, setActiveTab] = useState('Gainers');
  const rows = data[activeTab] || [];

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3.5 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab
                ? 'text-green-600 border-b-2 border-green-500'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wide">
              <th className="font-semibold px-4 py-3 border-b border-gray-100">Company</th>
              <th className="font-semibold px-4 py-3 border-b border-gray-100">Market Price</th>
              <th className="font-semibold px-4 py-3 border-b border-gray-100">% Change</th>
              <th className="font-semibold px-4 py-3 border-b border-gray-100 text-right">Volume</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-50">
            {rows.map((stock, i) => (
              <tr
                key={i}
                className="hover:bg-gray-50 cursor-pointer transition-colors group"
              >
                {/* Company */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 transition-colors flex-shrink-0">
                      {stock.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 leading-tight">{stock.name}</p>
                      <p className="text-xs text-gray-400">{stock.ticker}</p>
                    </div>
                  </div>
                </td>

                {/* Price */}
                <td className="px-4 py-3.5 font-semibold text-gray-800">{stock.price}</td>

                {/* Change */}
                <td className="px-4 py-3.5">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                      stock.isPositive
                        ? 'bg-green-50 text-green-600'
                        : 'bg-red-50 text-red-500'
                    }`}
                  >
                    {stock.change}
                  </span>
                </td>

                {/* Volume */}
                <td className="px-4 py-3.5 text-right text-gray-500 font-medium">{stock.vol}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-100 text-center">
        <button className="text-sm font-semibold text-green-600 hover:text-green-700 transition-colors">
          View All →
        </button>
      </div>
    </div>
  );
}
