
import React from 'react';
import { GeneratedImage } from '../types';

interface ImageDisplayProps {
  image: GeneratedImage | null;
  isGenerating: boolean;
  onRefine: (image: GeneratedImage) => void;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ image, isGenerating, onRefine }) => {
  const getAspectClass = (ratio: string) => {
    switch (ratio) {
      case '1:1': return 'aspect-square';
      case '9:16': return 'aspect-[9/16]';
      case '16:9': return 'aspect-video';
      case '4:3': return 'aspect-[4/3]';
      default: return 'aspect-square';
    }
  };

  if (isGenerating) {
    return (
      <div className={`w-full max-w-2xl bg-slate-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center justify-center p-12 border border-slate-800 ${image ? getAspectClass(image.aspectRatio) : 'aspect-square'}`}>
        <div className="relative">
          <div className="w-24 h-24 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-12 h-12 bg-blue-500 rounded-full blur-xl animate-pulse"></div>
          </div>
        </div>
        <h3 className="mt-8 text-xl font-semibold text-slate-300">Rendering Masterpiece</h3>
        <p className="mt-2 text-slate-500 text-center max-w-xs">Our AI is processing your request and creating high-fidelity pixels...</p>
      </div>
    );
  }

  if (!image) {
    return (
      <div className="w-full max-w-2xl aspect-square bg-slate-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center justify-center p-12 border border-slate-800 border-dashed">
        <div className="w-20 h-20 text-slate-700 mb-6">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-slate-500">Ready for Creation</h3>
        <p className="mt-2 text-slate-600 text-center">Enter a prompt on the left to begin your journey.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl space-y-6 animate-in fade-in duration-700">
      <div className={`relative group w-full ${getAspectClass(image.aspectRatio)} bg-slate-900 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-800`}>
        <img 
          src={image.url} 
          alt={image.prompt} 
          className="w-full h-full object-cover select-none"
        />
        
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
          <a 
            href={image.url} 
            download={`lumina-${image.id}.png`}
            className="p-4 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all active:scale-90"
            title="Download Image"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </a>
          <button 
            onClick={() => onRefine(image)}
            className="p-4 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all active:scale-90"
            title="Use as Reference (Image-to-Image)"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      <div className="glass rounded-2xl p-6 border border-slate-800/50">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase">PROMPT</span>
            <p className="text-slate-300 mt-1 leading-relaxed">{image.prompt}</p>
          </div>
          <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-500 whitespace-nowrap">
            {new Date(image.timestamp).toLocaleTimeString()}
          </span>
        </div>
        <div className="flex gap-4 items-center pt-4 border-t border-slate-800/50">
           <div className="flex flex-col">
             <span className="text-[10px] text-slate-500 uppercase">Model</span>
             <span className="text-xs font-mono text-slate-300">{image.model}</span>
           </div>
           <div className="flex flex-col">
             <span className="text-[10px] text-slate-500 uppercase">Ratio</span>
             <span className="text-xs font-mono text-slate-300">{image.aspectRatio}</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ImageDisplay;
