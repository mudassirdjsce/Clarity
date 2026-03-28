import React from 'react';
import { 
  TrendingUp, 
  Coins, 
  Star, 
  Building2, 
  Briefcase, 
  Sprout 
} from 'lucide-react';

const collections = [
  { label: 'High return', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { label: 'Gold & Silver', icon: Coins, color: 'text-yellow-500', bg: 'bg-yellow-50' },
  { label: '5 Star Funds', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
  { label: 'Large Cap', icon: Building2, color: 'text-blue-500', bg: 'bg-blue-50' },
  { label: 'Mid Cap', icon: Briefcase, color: 'text-purple-500', bg: 'bg-purple-50' },
  { label: 'Small Cap', icon: Sprout, color: 'text-green-600', bg: 'bg-green-50' },
];

export default function Collections() {
  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
      {collections.map((item, i) => {
        const Icon = item.icon;
        return (
          <div 
            key={i} 
            className="flex flex-col items-center justify-center gap-3 p-4 bg-white border border-gray-200 rounded-xl cursor-pointer hover:shadow-md hover:border-green-200 transition-all group group-hover:bg-gray-50"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${item.bg}`}>
              <Icon className={`w-6 h-6 ${item.color}`} />
            </div>
            <span className="text-xs font-semibold text-gray-700 text-center leading-tight">
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
