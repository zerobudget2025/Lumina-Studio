
import React from 'react';

interface HeaderProps {
  isPro: boolean;
  onTogglePro: () => void;
}

const Header: React.FC<HeaderProps> = ({ isPro, onTogglePro }) => {
  return (
    <header className="sticky top-0 z-50 glass border-b border-slate-800/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight">Lumina <span className="gradient-text">Studio</span></h1>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={onTogglePro}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 border ${
              isPro 
                ? 'bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-500/20' 
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            {isPro ? '✨ PRO ACTIVE' : 'GO PRO'}
          </button>
          
          <div className="hidden sm:flex items-center gap-2 text-slate-400 text-sm">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Gemini 2.5 Active
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
