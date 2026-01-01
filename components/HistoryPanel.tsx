
import React from 'react';
import { GeneratedImage } from '../types';

interface HistoryPanelProps {
  history: GeneratedImage[];
  onSelect: (image: GeneratedImage) => void;
  onDelete: (id: string) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelect, onDelete }) => {
  if (history.length === 0) {
    return (
      <div className="p-12 glass rounded-3xl border border-dashed border-slate-800 text-center">
        <p className="text-slate-600">No images generated yet. Start creating!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {history.map((item) => (
        <div 
          key={item.id} 
          className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:ring-2 hover:ring-blue-500/50 transition-all cursor-pointer"
          onClick={() => onSelect(item)}
        >
          <img 
            src={item.url} 
            alt={item.prompt} 
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            loading="lazy"
          />
          
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform">
             <p className="text-[10px] text-white line-clamp-2 italic">{item.prompt}</p>
          </div>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500/80 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

export default HistoryPanel;
