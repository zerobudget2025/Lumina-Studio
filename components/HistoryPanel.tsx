import React from 'react';
import { GeneratedImage } from '../types';

interface HistoryPanelProps {
  history: GeneratedImage[];
  onSelect: (image: GeneratedImage) => void;
  onRemix: (image: GeneratedImage) => void;
  onDelete: (id: string) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelect, onRemix, onDelete }) => {
  if (history.length === 0) {
    return (
      <div className="p-20 glass rounded-[3rem] border border-dashed border-slate-800/50 text-center flex flex-col items-center">
        <div className="w-16 h-16 text-slate-800 mb-6">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
          </svg>
        </div>
        <p className="text-slate-600 font-bold uppercase tracking-widest text-xs">Awaiting your first generation...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {history.map((item) => (
        <div 
          key={item.id} 
          className="group relative aspect-square rounded-[2rem] overflow-hidden bg-slate-900 border border-slate-800/50 hover:ring-4 hover:ring-blue-500/20 transition-all cursor-pointer shadow-xl"
          onClick={() => onSelect(item)}
        >
          <img 
            src={item.url} 
            alt={item.prompt} 
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
            loading="lazy"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-5">
             <p className="text-[11px] text-white line-clamp-2 font-medium italic mb-4 leading-relaxed tracking-tight opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all delay-100">"{item.prompt}"</p>
             <div className="flex items-center gap-2 translate-y-4 group-hover:translate-y-0 transition-all delay-200">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemix(item);
                  }}
                  className="flex-1 py-2 bg-white text-slate-950 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-500 hover:text-white transition-colors"
                >
                  Remix
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item.id);
                  }}
                  className="w-9 h-9 flex items-center justify-center bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                  title="Delete Forever"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
             </div>
          </div>

          <div className="absolute top-3 left-3 px-2 py-1 bg-black/40 backdrop-blur-md rounded-lg border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[8px] font-black text-white/80 uppercase tracking-widest">{item.aspectRatio}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistoryPanel;