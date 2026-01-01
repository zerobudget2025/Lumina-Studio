
import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    const saved = localStorage.getItem('lumina_history_v2');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('lumina_history_v2', JSON.stringify(history));
  }, [history]);

  const handleTogglePro = async () => {
    if (!isPro) {
      const hasKey = await checkProAuth();
      if (!hasKey) {
        await requestProAuth();
      }
      setIsPro(true);
    } else {
      setIsPro(false);
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
        prompt: params.prompt, // Store original prompt for user reference
        timestamp: Date.now(),
        aspectRatio: params.aspectRatio,
        model: result.model
      };

      setCurrentImage(newImage);
      setHistory(prev => [newImage, ...prev].slice(0, 50)); // Keep last 50
      setSelectedBaseImage(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during generation.");
      
      if (err.message && err.message.includes("Requested entity was not found")) {
        setError("Pro Model Error: Please re-select your API key via the Pro button.");
        setIsPro(false);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleHistorySelect = (image: GeneratedImage) => {
    setCurrentImage(image);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteHistory = (id: string) => {
    setHistory(prev => prev.filter(img => img.id !== id));
    if (currentImage?.id === id) {
      setCurrentImage(null);
    }
  };

  const handleRefine = (image: GeneratedImage) => {
    setSelectedBaseImage(image.url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-500/30">
      <Header isPro={isPro} onTogglePro={handleTogglePro} />
      
      <main className="flex-1 container mx-auto px-4 py-8 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-4 space-y-6">
            <ControlPanel 
              onGenerate={handleGenerate} 
              isGenerating={isGenerating} 
              isPro={isPro}
              selectedBaseImage={selectedBaseImage}
              onClearBaseImage={() => setSelectedBaseImage(null)}
            />
            {error && (
              <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-xl text-red-200 text-xs animate-in slide-in-from-left-4">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="font-bold">Error</span>
                </div>
                {error}
              </div>
            )}
          </div>

          <div className="lg:col-span-8 flex flex-col items-center">
            <ImageDisplay 
              image={currentImage} 
              isGenerating={isGenerating} 
              onRefine={handleRefine}
            />
          </div>

        </div>

        <div className="mt-20">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-xl font-bold tracking-tight text-slate-200">Creative Gallery</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-slate-800 to-transparent"></div>
          </div>
          <HistoryPanel 
            history={history} 
            onSelect={handleHistorySelect} 
            onDelete={handleDeleteHistory}
          />
        </div>
      </main>

      <footer className="py-12 border-t border-slate-900 text-center text-slate-600 text-[10px] uppercase tracking-widest font-medium">
        <p>&copy; 2024 Lumina Studio &bull; Next-Gen Social Creative Suite</p>
      </footer>
    </div>
  );
};

export default App;
