
import React, { useState, useEffect, useRef } from 'react';
import { AspectRatio, Platform, Template } from '../types';
import TemplateSelector from './TemplateSelector';
import { enhancePrompt } from '../services/geminiService';

interface ControlPanelProps {
  onGenerate: (params: { prompt: string; aspectRatio: AspectRatio; templateId?: string; promptSuffix?: string }) => void;
  isGenerating: boolean;
  isPro: boolean;
  selectedBaseImages: string[];
  onClearBaseImages: () => void;
  onRemoveBaseImage: (index: number) => void;
  onImageUpload: (base64: string) => void;
  remixPrompt?: string;
  remixRatio?: AspectRatio;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  onGenerate, 
  isGenerating, 
  isPro,
  selectedBaseImages,
  onClearBaseImages,
  onRemoveBaseImage,
  onImageUpload,
  remixPrompt,
  remixRatio
}) => {
  const [prompt, setPrompt] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [useEnhancer, setUseEnhancer] = useState(true);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('manual');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [promptSuffix, setPromptSuffix] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (remixPrompt) setPrompt(remixPrompt);
    if (remixRatio) setAspectRatio(remixRatio);
  }, [remixPrompt, remixRatio]);

  const handleSelectTemplate = (t: Template) => {
    setSelectedTemplateId(t.id);
    setAspectRatio(t.aspectRatio);
    setPromptSuffix(t.promptSuffix || '');
  };

  const handlePlatformChange = (p: Platform) => {
    setSelectedPlatform(p);
    if (p === 'manual') {
      setSelectedTemplateId(null);
      setPromptSuffix('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      onImageUpload(base64);
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const ratios: { label: string; value: AspectRatio; icon: React.ReactNode }[] = [
    { label: '1:1', value: '1:1', icon: <div className="w-3 h-3 border border-current" /> },
    { label: '9:16', value: '9:16', icon: <div className="w-2 h-4 border border-current" /> },
    { label: '16:9', value: '16:9', icon: <div className="w-4 h-2 border border-current" /> },
    { label: '4:3', value: '4:3', icon: <div className="w-3.5 h-2.5 border border-current" /> },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    let finalPrompt = prompt;
    if (useEnhancer) {
      setIsEnhancing(true);
      finalPrompt = await enhancePrompt(prompt, selectedBaseImages.length);
      setIsEnhancing(false);
    }

    onGenerate({ 
      prompt: finalPrompt, 
      aspectRatio, 
      templateId: selectedTemplateId || undefined,
      promptSuffix: promptSuffix || undefined
    });
  };

  const getButtonContent = () => {
    if (isGenerating) {
      return (
        <div className="flex items-center gap-3">
          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{selectedBaseImages.length > 1 ? `Merging ${selectedBaseImages.length} Realities...` : 'Synthesizing...'}</span>
        </div>
      );
    }

    if (selectedBaseImages.length === 2) {
      return (
        <>
          <span>SYNTHESIZE DUO</span>
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </>
      );
    }

    if (selectedBaseImages.length === 3) {
      return (
        <>
          <span>SYNTHESIZE TRIO</span>
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </>
      );
    }

    return (
      <>
        <span>{selectedBaseImages.length === 1 ? 'CREATE PORTRAIT' : 'CREATE MAGIC'}</span>
        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </>
    );
  };

  return (
    <div className="glass rounded-[2rem] p-6 shadow-2xl space-y-6 border-slate-700/50 backdrop-blur-xl">
      <div className="space-y-4">
        <label className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Platform Preset</span>
          <span className="text-[9px] text-blue-500 font-bold bg-blue-500/10 px-2 py-0.5 rounded-full ring-1 ring-blue-500/20 uppercase tracking-widest">Pro Optimized</span>
        </label>
        <TemplateSelector 
          selectedPlatform={selectedPlatform}
          setSelectedPlatform={handlePlatformChange}
          selectedTemplateId={selectedTemplateId}
          onSelectTemplate={handleSelectTemplate}
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 pt-6 border-t border-slate-800/80">
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Vision Prompt</label>
            <button 
              type="button"
              onClick={() => setUseEnhancer(!useEnhancer)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all ${
                useEnhancer ? 'text-blue-400 bg-blue-400/10 ring-1 ring-blue-400/20' : 'text-slate-600 bg-slate-800/50'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${useEnhancer ? 'bg-blue-400 animate-pulse' : 'bg-slate-600'}`}></span>
              AI ENHANCER
            </button>
          </div>
          <div className="relative group">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={selectedBaseImages.length > 1 ? `Describe the scene for these ${selectedBaseImages.length} people...` : "Describe your vision..."}
              className="w-full h-32 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all resize-none text-sm leading-relaxed"
            />
            {isEnhancing && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center animate-in fade-in duration-300">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest text-center">Calculating Multi-Subject Logic...</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Subject Cast {selectedBaseImages.length > 0 && <span className="text-blue-500 ml-1">({selectedBaseImages.length}/3)</span>}
            </label>
            {selectedBaseImages.length < 3 && (
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[10px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest flex items-center gap-1 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                </svg>
                Add Person
              </button>
            )}
          </div>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileChange}
          />
          
          {selectedBaseImages.length > 0 ? (
            <div className="space-y-3 animate-in fade-in duration-500">
              <div className="grid grid-cols-3 gap-2">
                {selectedBaseImages.map((img, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden aspect-square border-2 border-slate-800/50 hover:border-blue-500/50 transition-colors bg-slate-900">
                    <img src={img} className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => onRemoveBaseImage(idx)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                {selectedBaseImages.length < 3 && (
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-xl border-2 border-dashed border-slate-800 flex items-center justify-center text-slate-600 hover:text-blue-500 hover:border-blue-500/50 transition-all bg-slate-900/40"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-[9px] font-black uppercase tracking-widest italic animate-pulse ${selectedBaseImages.length > 1 ? 'text-purple-400' : 'text-blue-500'}`}>
                  {selectedBaseImages.length === 2 ? 'DUO MODE ACTIVE' : selectedBaseImages.length === 3 ? 'TRIO MODE ACTIVE' : 'IDENTITY LOCK ACTIVE'}
                </span>
                <button type="button" onClick={onClearBaseImages} className="text-[9px] text-red-400 font-black uppercase tracking-widest hover:text-red-300 transition-colors">Clear Cast</button>
              </div>
            </div>
          ) : (
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-8 bg-slate-900/40 border border-slate-800 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 text-slate-600 hover:text-slate-400 hover:border-slate-700 hover:bg-slate-900/60 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="text-center">
                <span className="text-[10px] font-black uppercase tracking-widest block">Upload Cast Photos</span>
                <span className="text-[8px] font-medium text-slate-700 uppercase tracking-widest">Combine 2-3 different people</span>
              </div>
            </button>
          )}
        </div>

        <div className="space-y-3 pt-2">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Output Format</label>
          <div className="grid grid-cols-4 gap-2">
            {ratios.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setAspectRatio(r.value)}
                className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl border transition-all ${
                  aspectRatio === r.value
                    ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.1)] ring-1 ring-blue-500/30'
                    : 'bg-slate-900/40 border-slate-800 text-slate-500 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <span className="opacity-80 scale-110">{r.icon}</span>
                <span className="text-[10px] font-bold">{r.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <button
            type="submit"
            disabled={!prompt.trim() || isGenerating || isEnhancing}
            className={`w-full py-5 rounded-[1.25rem] font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 transition-all relative overflow-hidden group shadow-2xl border ${
              !prompt.trim() || isGenerating || isEnhancing
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed border-slate-700/50'
                : selectedBaseImages.length > 1
                  ? 'bg-purple-600 text-white border-purple-500 hover:bg-purple-500 hover:shadow-purple-500/20'
                  : 'bg-white text-slate-950 border-white hover:shadow-white/10'
            }`}
          >
            {getButtonContent()}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ControlPanel;
