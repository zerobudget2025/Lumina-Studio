
import React from 'react';

interface HeaderProps {
  isPro: boolean;
  onTogglePro: () => void;
}

const Header: React.FC<HeaderProps> = ({ isPro, onTogglePro }) => {
  return (
    <header className="sticky top-0 z-50 glass border-b border-slate-800/30">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between max-w-7xl">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-500 rounded-xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity"></div>
            <div className="w-12 h-12 bg-white text-slate-950 rounded-2xl flex items-center justify-center shadow-2xl relative">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter leading-none">LUMINA <span className="text-blue-500">PRO</span></h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">by NightOwl Studio</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end mr-2">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Active Model</span>
            <span className={`text-[10px] font-black uppercase ${isPro ? 'text-purple-400' : 'text-blue-400'}`}>
              {isPro ? 'Gemini 3 Pro 1K' : 'Gemini 2.5 Flash'}
            </span>
          </div>
          
          <button 
            onClick={onTogglePro}
            className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 border-2 ${
              isPro 
                ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20 scale-105' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            {isPro ? 'PRO ACTIVE' : 'UPGRADE'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
