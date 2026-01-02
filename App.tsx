
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import ImageDisplay from './components/ImageDisplay';
import HistoryPanel from './components/HistoryPanel';
import { GeneratedImage, AspectRatio } from './types';
import { generateImage, checkProAuth, requestProAuth } from './services/geminiService';

const App: React.FC = () => {
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPro, setIsPro] = useState(false);
  const [selectedBaseImage, setSelectedBaseImage] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const [remixPrompt, setRemixPrompt] = useState<string | undefined>();
  const [remixRatio, setRemixRatio] = useState<AspectRatio | undefined>();

  // Release heartbeat & PWA logic
  useEffect(() => {
    console.log(
      "%cLUMINA OS %cRELEASE V3.0 STABLE",
      "color: white; background: #3b82f6; padding: 5px 10px; border-radius: 5px 0 0 5px; font-weight: 900;",
      "color: white; background: #10b981; padding: 5px 10px; border-radius: 0 5px 5px 0; font-weight: 900;"
    );

    const saved = localStorage.getItem('lumina_history_v3');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Storage Recovery Failed", e);
      }
    }
  }, []);

  // Keyboard Shortcuts (Cmd+Enter to Generate)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        const submitBtn = document.querySelector('button[type="submit"]') as HTMLButtonElement;
        if (submitBtn && !submitBtn.disabled) submitBtn.click();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('lumina_history_v3', JSON.stringify(history));
    } catch (e) {
      if (history.length > 5) setHistory(prev => prev.slice(0, 5));
    }
  }, [history]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleTogglePro = async () => {
    if (!isPro) {
      const hasKey = await checkProAuth();
      if (!hasKey) {
        await requestProAuth();
      }
      setIsPro(true);
      showToast("Pro Features Activated", "success");
    } else {
      setIsPro(false);
      showToast("Returned to Flash Tier", "success");
    }
  };

  const handleGenerate = async (params: { prompt: string; aspectRatio: AspectRatio; templateId?: string; promptSuffix?: string }) => {
    setIsGenerating(true);
    setError(null);

    const finalPrompt = params.promptSuffix 
      ? `${params.prompt}. ${params.promptSuffix}`
      : params.prompt;

    try {
      const result = await generateImage({
        prompt: finalPrompt,
        aspectRatio: params.aspectRatio,
        isPro,
        baseImage: selectedBaseImage || undefined
      });

      const newImage: GeneratedImage = {
        id: Math.random().toString(36).substring(7),
        url: result.imageUrl,
        prompt: params.prompt,
        timestamp: Date.now(),
        aspectRatio: params.aspectRatio,
        model: result.model,
        // @ts-ignore - passing grounding metadata if available
        groundingSources: result.groundingSources
      };

      setCurrentImage(newImage);
      setHistory(prev => [newImage, ...prev].slice(0, 20)); 
      setSelectedBaseImage(null);
      setRemixPrompt(undefined);
      setRemixRatio(undefined);
      showToast("Masterpiece Generated");
    } catch (err: any) {
      let message = err.message || "Engine failure.";
      if (message.includes("Requested entity was not found")) {
        message = "Pro Auth Expired. Please re-validate.";
        setIsPro(false);
      }
      setError(message);
      showToast(message, "error");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-500/30 overflow-x-hidden">
      <Header isPro={isPro} onTogglePro={handleTogglePro} />
      
      {/* Release Toast */}
      {toast && (
        <div className={`fixed bottom-8 right-8 z-[100] px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-300 ${
          toast.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
        }`}>
          <div className={`w-2 h-2 rounded-full animate-pulse ${toast.type === 'error' ? 'bg-red-400' : 'bg-emerald-400'}`}></div>
          <span className="text-[11px] font-black uppercase tracking-widest">{toast.message}</span>
        </div>
      )}

      <main className="flex-1 container mx-auto px-4 py-12 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-4 space-y-8">
            <ControlPanel 
              onGenerate={handleGenerate} 
              isGenerating={isGenerating} 
              isPro={isPro}
              selectedBaseImage={selectedBaseImage}
              onClearBaseImage={() => setSelectedBaseImage(null)}
              remixPrompt={remixPrompt}
              remixRatio={remixRatio}
            />
            {error && (
              <div className="p-5 bg-red-950/40 border border-red-500/30 rounded-3xl text-red-200 text-xs animate-in slide-in-from-left-4 backdrop-blur-xl shadow-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <span className="font-black uppercase tracking-widest text-[10px]">Engine Exception</span>
                </div>
                <p className="font-medium pl-1 opacity-80">{error}</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-8 flex flex-col items-center">
            <ImageDisplay 
              image={currentImage} 
              isGenerating={isGenerating} 
              onRefine={(img) => {
                setSelectedBaseImage(img.url);
                showToast("Reference Image Set");
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>

        </div>

        <div className="mt-24">
          <div className="flex items-center gap-6 mb-12">
            <h2 className="text-2xl font-black tracking-tight text-slate-100 uppercase italic">Creative Archive</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-slate-800 to-transparent"></div>
          </div>
          <HistoryPanel 
            history={history} 
            onSelect={(img) => {
              setCurrentImage(img);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
            onRemix={(img) => {
              setRemixPrompt(img.prompt);
              setRemixRatio(img.aspectRatio);
              showToast("Prompt Copied to Editor");
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onDelete={(id) => setHistory(prev => prev.filter(img => img.id !== id))}
          />
        </div>
      </main>

      <footer className="py-20 border-t border-slate-900/50 glass flex flex-col items-center justify-center space-y-6">
        <div className="flex items-center gap-4">
          <span className="px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-[9px] font-black text-blue-500 tracking-widest uppercase">v3.0 STABLE</span>
          <span className="text-slate-700 text-[9px] font-black uppercase tracking-widest">&bull;</span>
          <span className="text-slate-500 text-[10px] font-bold tracking-widest uppercase italic">Released by NightOwl</span>
        </div>
        <p className="text-slate-600 text-[10px] uppercase tracking-[0.4em] font-black">
          &copy; 2024 Just Me Media &bull; Open Source Initiative
        </p>
        <div className="flex items-center gap-6">
          <div className="h-px w-12 bg-slate-900"></div>
          <div className="flex gap-4">
            {['GitHub', 'Docs', 'License'].map(link => (
              <span key={link} className="text-[10px] font-black text-slate-500 hover:text-blue-500 cursor-pointer transition-colors uppercase tracking-widest">{link}</span>
            ))}
          </div>
          <div className="h-px w-12 bg-slate-900"></div>
        </div>
      </footer>
    </div>
  );
};

export default App;
