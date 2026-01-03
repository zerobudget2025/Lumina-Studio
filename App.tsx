
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import ImageDisplay from './components/ImageDisplay';
import HistoryPanel from './components/HistoryPanel';
import { GeneratedImage, AspectRatio } from './types';
import { generateImage, requestProAuth } from './services/geminiService';

const App: React.FC = () => {
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPro, setIsPro] = useState(false);
  const [selectedBaseImages, setSelectedBaseImages] = useState<string[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const [remixPrompt, setRemixPrompt] = useState<string | undefined>();
  const [remixRatio, setRemixRatio] = useState<AspectRatio | undefined>();

  useEffect(() => {
    const saved = localStorage.getItem('lumina_history_v3');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) { console.error(e); }
    }
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
      await requestProAuth();
      setIsPro(true);
      showToast("Pro Features Activated", "success");
    } else {
      setIsPro(false);
      showToast("Flash Tier Active", "success");
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
        baseImages: selectedBaseImages.length > 0 ? selectedBaseImages : undefined
      });

      const newImage: GeneratedImage = {
        id: Math.random().toString(36).substring(7),
        url: result.imageUrl,
        prompt: params.prompt,
        timestamp: Date.now(),
        aspectRatio: params.aspectRatio,
        model: result.model,
        // @ts-ignore
        groundingSources: result.groundingSources
      };

      setCurrentImage(newImage);
      setHistory(prev => [newImage, ...prev].slice(0, 20)); 
      setRemixPrompt(undefined);
      setRemixRatio(undefined);
      showToast(selectedBaseImages.length > 1 ? "Group Shot Synthesized" : "Image Synthesized");
    } catch (err: any) {
      let message = err.message || "Engine failure.";
      if (message.includes("Requested entity was not found")) {
        message = "Key Validation Failed. Please select a valid paid API key.";
        setIsPro(false);
        await requestProAuth();
      }
      setError(message);
      showToast(message, "error");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-500/30 overflow-x-hidden">
      <Header isPro={isPro} onTogglePro={handleTogglePro} onChangeKey={requestProAuth} />
      
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
              selectedBaseImages={selectedBaseImages}
              onClearBaseImages={() => setSelectedBaseImages([])}
              onRemoveBaseImage={(index) => setSelectedBaseImages(prev => prev.filter((_, i) => i !== index))}
              onImageUpload={(base64) => {
                if (selectedBaseImages.length >= 3) {
                  showToast("Maximum 3 people allowed for clarity", "error");
                  return;
                }
                setSelectedBaseImages(prev => [...prev, base64]);
                showToast("Identity Reference Added");
              }}
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
                  <span className="font-black uppercase tracking-widest text-[10px]">System Exception</span>
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
                setSelectedBaseImages([img.url]);
                showToast("Subject Locked from Canvas");
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
    </div>
  );
};

export default App;
