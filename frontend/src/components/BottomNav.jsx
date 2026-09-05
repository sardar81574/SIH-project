import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  TrendingUp, 
  Plus, 
  Store, 
  Stethoscope 
} from 'lucide-react';

export default function BottomNav() {
  const tabs = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Mandi', path: '/mandi-prices', icon: TrendingUp },
    { name: 'Sell Crop', path: '/sell-crop', icon: Plus, isFab: true },
    { name: 'Bazaar', path: '/marketplace', icon: Store },
    { name: 'AI Doctor', path: '/crop-doctor', icon: Stethoscope },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 pt-1 pointer-events-none">
      <nav className="pointer-events-auto bg-white/90 backdrop-blur-xl border border-emerald-900/10 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] rounded-3xl px-3 py-2 flex justify-around items-center relative">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          if (tab.isFab) {
            return (
              <NavLink
                key={tab.path}
                to={tab.path}
                className="relative -top-5 flex flex-col items-center group focus:outline-none"
              >
                {({ isActive }) => (
                  <div className="flex flex-col items-center">
                    <div className={`p-3.5 rounded-full shadow-[0_10px_25px_rgba(27,94,32,0.35)] border-4 border-white transition-all duration-300 transform active:scale-95 group-hover:scale-105 ${
                      isActive 
                        ? 'bg-gradient-to-tr from-emerald-800 to-green-600 text-white ring-2 ring-emerald-600/30' 
                        : 'bg-gradient-to-tr from-[#1b5e20] to-[#2e7d32] text-white'
                    }`}>
                      <Icon className="w-6 h-6 stroke-[2.5]" />
                    </div>
                    <span className="text-[10px] font-bold text-emerald-900 tracking-tight mt-1">
                      {tab.name}
                    </span>
                  </div>
                )}
              </NavLink>
            );
          }

          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? 'text-emerald-800 font-extrabold scale-105'
                    : 'text-gray-400 hover:text-gray-600 font-medium'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'stroke-[2.5] -translate-y-0.5' : 'stroke-[1.8]'}`} />
                    {isActive && (
                      <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-emerald-600 rounded-full animate-pulse" />
                    )}
                  </div>
                  <span className="text-[10px] tracking-tight mt-1">
                    {tab.name}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}