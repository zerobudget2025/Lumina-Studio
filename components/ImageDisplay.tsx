
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

  const handleShare = async () => {
    if (!image) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Masterpiece from Lumina Studio',
          text: `Check out this AI-generated vision: "${image.prompt}"`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(image.url);
        alert('Image link copied to clipboard!');
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (isGenerating) {
    return (
      <div className={`w-full max-w-2xl bg-slate-900/60 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col items-center justify-center p-12 border border-slate-800/50 backdrop-blur-xl ${image ? getAspectClass(image.aspectRatio) : 'aspect-square'}`}>
        <div className="relative flex flex-col items-center">
          <div className="w-40 h-40 rounded-full border-[8px] border-slate-800/50 border-t-blue-500 animate-spin relative">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          </div>
          <div className="mt-16 text-center space-y-3">
            <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Weaving Light...</h3>
            <p className="text-slate-500 text-sm font-bold tracking-widest uppercase opacity-70">NightOwl Creative Engine is processing</p>
          </div>
        </div>
      </div>
    );
  }

  if (!image) {
    return (
      <div className="w-full max-w-2xl aspect-square bg-slate-900/30 rounded-[3rem] overflow-hidden shadow-inner flex flex-col items-center justify-center p-12 border border-slate-800/30 border-dashed group transition-all hover:bg-slate-900/40">
        <div className="w-32 h-32 text-slate-800 mb-8 group-hover:text-blue-500/50 group-hover:scale-110 transition-all duration-700">
          {/* Aethelred Owl Placeholder */}
          <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.5 4L7 6M19.5 4L17 6" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
            <path d="M12 21C16 19.5 19.5 15.5 19.5 9.5C19.5 5 16 3 12 3C8 3 4.5 5 4.5 9.5C4.5 15.5 8 19.5 12 21Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
            <circle cx="9" cy="9.5" r="2" fill="currentColor" fillOpacity="0.2"/>
            <circle cx="15" cy="9.5" r="2" fill="currentColor" fillOpacity="0.2"/>
          </svg>
        </div>
        <h3 className="text-2xl font-black text-slate-500 uppercase tracking-tighter">Canvas Pending</h3>
        <p className="mt-3 text-slate-600 text-center max-w-xs text-sm font-medium italic">Define your prompt and let NightOwl visualize your thoughts.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl space-y-8 animate-in fade-in zoom-in-95 duration-1000">
      <div className={`relative group w-full ${getAspectClass(image.aspectRatio)} bg-slate-900 rounded-[3rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.5)] ring-1 ring-white/10`}>
        <img 
          src={image.url} 
          alt={image.prompt} 
          className="w-full h-full object-cover select-none transition-transform duration-1000 group-hover:scale-[1.02]"
        />
        
        {/* Floating Actions */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-slate-950/40 backdrop-blur-2xl p-3 rounded-[2rem] border border-white/10 shadow-2xl opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
          <a 
            href={image.url} 
            download={`lumina-creation-${image.id}.png`}
            className="w-14 h-14 bg-white/10 hover:bg-white text-white hover:text-slate-950 rounded-2xl flex items-center justify-center transition-all shadow-xl active:scale-90"
            title="Download Full Quality"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </a>
          <button 
            onClick={() => onRefine(image)}
            className="w-14 h-14 bg-blue-500/20 hover:bg-blue-500 text-blue-400 hover:text-white rounded-2xl flex items-center justify-center transition-all shadow-xl active:scale-90 border border-blue-500/20"
            title="Refine this frame"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button 
            onClick={handleShare}
            className="w-14 h-14 bg-purple-500/20 hover:bg-purple-500 text-purple-400 hover:text-white rounded-2xl flex items-center justify-center transition-all shadow-xl active:scale-90 border border-purple-500/20"
            title="Share Vision"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="glass rounded-[2.5rem] p-10 border-slate-800/40 relative overflow-hidden group shadow-2xl backdrop-blur-3xl">
        <div className="absolute -top-12 -right-12 p-8 opacity-5 group-hover:opacity-10 transition-all duration-1000 rotate-12 group-hover:rotate-0 text-slate-500">
           <svg className="w-48 h-48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.5 4L7 6M19.5 4L17 6" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
              <path d="M12 21C16 19.5 19.5 15.5 19.5 9.5C19.5 5 16 3 12 3C8 3 4.5 5 4.5 9.5C4.5 15.5 8 19.5 12 21Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="space-y-6 relative">
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-black tracking-[0.3em] text-blue-500 uppercase px-3 py-1 bg-blue-500/10 rounded-lg border border-blue-500/20">Creative Meta</span>
            <div className="h-px flex-1 bg-gradient-to-r from-slate-800/50 to-transparent"></div>
          </div>
          <p className="text-slate-200 text-lg leading-snug font-medium italic tracking-tight">"{image.prompt}"</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-800/50">
             <div className="flex flex-col gap-1">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Model Engine</span>
               <span className="text-sm font-bold text-slate-100 flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${image.model.includes('pro') ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]' : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]'}`}></div>
                 {image.model === 'gemini-3-pro-image-preview' ? 'Pro 1K (Ultra)' : 'Flash (Fast)'}
               </span>
             </div>
             <div className="flex flex-col gap-1">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Composition</span>
               <span className="text-sm font-bold text-slate-100 uppercase">{image.aspectRatio} Aspect</span>
             </div>
             <div className="flex flex-col gap-1">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Rights</span>
               <span className="text-sm font-bold text-slate-100">Open Source (MIT)</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageDisplay;
