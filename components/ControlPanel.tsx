
import React, { useState } from 'react';
import { AspectRatio, Platform, Template } from '../types';
import TemplateSelector from './TemplateSelector';

interface ControlPanelProps {
  onGenerate: (params: { prompt: string; aspectRatio: AspectRatio; templateId?: string; promptSuffix?: string }) => void;
  isGenerating: boolean;
  isPro: boolean;
  selectedBaseImage: string | null;
  onClearBaseImage: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  onGenerate, 
  isGenerating, 
  isPro,
  selectedBaseImage,
  onClearBaseImage
}) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('manual');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [promptSuffix, setPromptSuffix] = useState<string>('');

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
    } else {
      // Auto select first template of platform
      // (Optionally could stay null until user picks)
    }
  };

  const ratios: { label: string; value: AspectRatio; icon: React.ReactNode }[] = [
    { label: 'Square', value: '1:1', icon: <div className="w-3.5 h-3.5 border-2 border-current" /> },
    { label: 'Portrait', value: '9:16', icon: <div className="w-2.5 h-4 border-2 border-current" /> },
    { label: 'Landscape', value: '16:9', icon: <div className="w-4 h-2.5 border-2 border-current" /> },
    { label: 'Standard', value: '4:3', icon: <div className="w-3.5 h-3 border-2 border-current" /> },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    onGenerate({ 
      prompt, 
      aspectRatio, 
      templateId: selectedTemplateId || undefined,
      promptSuffix: promptSuffix || undefined
    });
  };

  return (
    <div className="glass rounded-2xl p-6 shadow-2xl space-y-6">
      <div className="space-y-4">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Creative Mode</label>
        <TemplateSelector 
          selectedPlatform={selectedPlatform}
          setSelectedPlatform={handlePlatformChange}
          selectedTemplateId={selectedTemplateId}
          onSelectTemplate={handleSelectTemplate}
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 pt-4 border-t border-slate-800/50">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={selectedPlatform === 'manual' ? "Describe your vision..." : `What should be in your ${selectedPlatform} creative?`}
            className="w-full h-28 bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none text-sm"
          />
          {selectedTemplateId && (
            <div className="mt-2 text-[10px] text-blue-400/70 italic line-clamp-1">
              + Auto-optimizing for {selectedPlatform} style
            </div>
          )}
        </div>

        {selectedBaseImage && (
          <div className="relative group">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Reference Image</label>
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-blue-500/30">
              <img src={selectedBaseImage} alt="Reference" className="w-full h-full object-cover" />
              <button 
                type="button"
                onClick={onClearBaseImage}
                className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {selectedPlatform === 'manual' && (
          <div className="animate-in fade-in duration-300">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-3">Manual Aspect Ratio</label>
            <div className="grid grid-cols-2 gap-2">
              {ratios.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setAspectRatio(r.value)}
                  className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl border text-xs transition-all ${
                    aspectRatio === r.value
                      ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                      : 'bg-slate-900/50 border-slate-800 text-slate-500 hover:bg-slate-800 hover:text-slate-300'
                  }`}
                >
                  {r.icon}
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={!prompt.trim() || isGenerating}
          className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-3 transition-all ${
            !prompt.trim() || isGenerating
              ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700/50'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 shadow-lg shadow-blue-500/20 active:scale-[0.98]'
          }`}
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Generate Design
            </>
          )}
        </button>

        {isPro && (
          <p className="text-[9px] text-center text-purple-400/80 font-medium uppercase tracking-tighter">
            ✨ Gemini Pro Engine Enabled (1K Output)
          </p>
        )}
      </form>
    </div>
  );
};

export default ControlPanel;
