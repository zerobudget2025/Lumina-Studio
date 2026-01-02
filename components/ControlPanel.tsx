import React, { useState, useEffect } from 'react';
import { AspectRatio, Platform, Template } from '../types';
import TemplateSelector from './TemplateSelector';
import { enhancePrompt } from '../services/geminiService';

interface ControlPanelProps {
  onGenerate: (params: { prompt: string; aspectRatio: AspectRatio; templateId?: string; promptSuffix?: string }) => void;
  isGenerating: boolean;
  isPro: boolean;
  selectedBaseImage: string | null;
  onClearBaseImage: () => void;
  remixPrompt?: string;
  remixRatio?: AspectRatio;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  onGenerate, 
  isGenerating, 
  isPro,
  selectedBaseImage,
  onClearBaseImage,
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

  // Handle Remixing
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
      finalPrompt = await enhancePrompt(prompt);
      setIsEnhancing(false);
    }

    onGenerate({ 
      prompt: finalPrompt, 
      aspectRatio, 
      templateId: selectedTemplateId || undefined,
      promptSuffix: promptSuffix || undefined
    });
  };

  return (
    <div className="glass rounded-[2rem] p-6 shadow-2xl space-y-6 border-slate-700/50 backdrop-blur-xl">
      <div className="space-y-4">
        <label className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Platform Preset</span>
          <span className="text-[9px] text-blue-500 font-bold bg-blue-500/10 px-2 py-0.5 rounded-full ring-1 ring-blue-500/20">Pro Templates</span>
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
              placeholder="A futuristic city with purple neon lights, cinematic lighting..."
              className="w-full h-32 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all resize-none text-sm leading-relaxed"
            />
            {isEnhancing && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center animate-in fade-in duration-300">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Perfecting your vision...</span>
              </div>
            )}
          </div>
        </div>

        {selectedBaseImage && (
          <div className="animate-in zoom-in-95 duration-500">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 px-1 tracking-widest">Image Reference</label>
            <div className="relative rounded-2xl overflow-hidden border-2 border-blue-500/20 group ring-4 ring-blue-500/5">
              <img src={selectedBaseImage} alt="Reference" className="w-full aspect-video object-cover" />
              <button 
                type="button"
                onClick={onClearBaseImage}
                className="absolute top-2 right-2 p-2 bg-red-500/90 backdrop-blur-md rounded-full text-white hover:bg-red-600 transition-all shadow-xl"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Canvas Ratio</label>
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

        <button
          type="submit"
          disabled={!prompt.trim() || isGenerating || isEnhancing}
          className={`w-full py-5 rounded-[1.25rem] font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 transition-all relative overflow-hidden group shadow-2xl ${
            !prompt.trim() || isGenerating || isEnhancing
              ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700/50'
              : 'bg-white text-slate-950 hover:scale-[1.02] active:scale-95 hover:shadow-white/10 border border-white'
          }`}
        >
          {isGenerating ? (
            <div className="flex items-center gap-3">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Generating Masterpiece</span>
            </div>
          ) : (
            <>
              <span>Create Magic</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ControlPanel;