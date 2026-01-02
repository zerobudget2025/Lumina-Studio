
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
            <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
            <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-2xl relative overflow-hidden border border-slate-800 group-hover:border-blue-500/50 transition-colors ring-1 ring-white/5 shadow-inner">
              {/* Refined NightOwl "Aethelred" Logo */}
              <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* The "V" Horns/Tufts */}
                <path d="M4.5 4L7 6M19.5 4L17 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                {/* Head Silhouette */}
                <path d="M12 21C16 19.5 19.5 15.5 19.5 9.5C19.5 5 16 3 12 3C8 3 4.5 5 4.5 9.5C4.5 15.5 8 19.5 12 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                {/* Facial Disk Overlay */}
                <path d="M12 18.5C15 17 18 13.5 18 9.5C18 7 15.5 5.5 12 5.5C8.5 5.5 6 7 6 9.5C6 13.5 9 17 12 18.5Z" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2" strokeLinejoin="round"/>
                {/* Vision Centers */}
                <circle cx="9" cy="9.5" r="2" fill="currentColor"/>
                <circle cx="15" cy="9.5" r="2" fill="currentColor"/>
                {/* Contrast Pupils */}
                <circle cx="9.5" cy="9" r="0.5" fill="black" fillOpacity="0.4"/>
                <circle cx="15.5" cy="9" r="0.5" fill="black" fillOpacity="0.4"/>
                {/* Beak */}
                <path d="M11.5 13.5L12 15L12.5 13.5H11.5Z" fill="currentColor"/>
              </svg>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tighter leading-none uppercase">Lumina</h1>
              <span className="px-1.5 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-[9px] font-black text-blue-400 tracking-widest">OS</span>
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1 italic opacity-70">by NightOwl Studio</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end mr-2">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Global Engine</span>
            <span className={`text-[10px] font-black uppercase ${isPro ? 'text-purple-400' : 'text-blue-400'}`}>
              {isPro ? 'Gemini 3 Pro' : 'Gemini 2.5 Flash'}
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
