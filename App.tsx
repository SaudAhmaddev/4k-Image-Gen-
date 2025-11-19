import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import AspectRatioSelector from './components/AspectRatioSelector';
import GeneratedGallery from './components/GeneratedGallery';
import { Wand2, Download, Loader2, AlertCircle } from './components/Icons';
import { AppStatus, AspectRatio, GeneratedImage } from './types';
import { enhancePrompt, generateImages } from './services/gemini';
import JSZip from 'jszip';
import FileSaver from 'file-saver';

function App() {
  const [prompt, setPrompt] = useState('');
  const [ratio, setRatio] = useState<AspectRatio>(AspectRatio.SQUARE);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [enhancedPromptText, setEnhancedPromptText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;

    setStatus(AppStatus.ENHANCING);
    setError(null);
    setImages([]);
    setEnhancedPromptText(null);

    try {
      // Step 1: Enhance Prompt
      const improvedPrompt = await enhancePrompt(prompt);
      setEnhancedPromptText(improvedPrompt);

      setStatus(AppStatus.GENERATING);

      // Step 2: Generate Images
      const generatedImages = await generateImages(improvedPrompt, ratio);
      setImages(generatedImages);
      setStatus(AppStatus.COMPLETED);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during generation.");
      setStatus(AppStatus.ERROR);
    }
  }, [prompt, ratio]);

  const handleDownloadZip = useCallback(async () => {
    if (images.length === 0) return;

    try {
      const zip = new JSZip();
      const folder = zip.folder("lumina-images");

      images.forEach((img, index) => {
        folder?.file(`lumina-image-${index + 1}.png`, img.base64, { base64: true });
      });

      const content = await zip.generateAsync({ type: "blob" });
      
      // Handle file-saver import compatibility
      // Some builds export the function as default, others as a named export or property
      const saveAs = (FileSaver as any).saveAs || FileSaver;
      saveAs(content, "lumina-4k-batch.zip");
    } catch (e) {
      console.error("Error creating zip:", e);
      setError("Failed to create download package.");
    }
  }, [images]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Input Section */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-4xl font-bold tracking-tight mb-4 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
              Visualize your Imagination
            </h2>
            <p className="text-slate-400 text-lg">
              Enter a simple idea. Our AI enhances it into a structured prompt and renders it in high fidelity (4MP+).
            </p>
          </div>

          {/* Controls Container */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
            
            {/* Prompt Input */}
            <div className="mb-8">
              <label htmlFor="prompt" className="block text-sm font-medium text-slate-400 mb-2">
                Your Prompt
              </label>
              <div className="relative">
                <textarea
                  id="prompt"
                  rows={4}
                  className="block w-full rounded-xl bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-4 transition-all shadow-inner"
                  placeholder="Describe an image you want to generate (e.g., 'A futuristic city with neon lights in the rain')..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={status === AppStatus.ENHANCING || status === AppStatus.GENERATING}
                />
                <div className="absolute bottom-3 right-3 text-xs text-slate-500">
                  {prompt.length} chars
                </div>
              </div>
            </div>

            {/* Aspect Ratio */}
            <div className="mb-8">
              <AspectRatioSelector 
                selected={ratio} 
                onChange={setRatio} 
                disabled={status === AppStatus.ENHANCING || status === AppStatus.GENERATING}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || status === AppStatus.ENHANCING || status === AppStatus.GENERATING}
                className={`
                  flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl text-base font-semibold shadow-lg transition-all
                  ${!prompt.trim() || status === AppStatus.ENHANCING || status === AppStatus.GENERATING
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-indigo-500/25 hover:-translate-y-0.5'}
                `}
              >
                {status === AppStatus.ENHANCING ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Enhancing Prompt...
                  </>
                ) : status === AppStatus.GENERATING ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Rendering 4 Images...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    Generate 4K Batch
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {status === AppStatus.ERROR && error && (
            <div className="p-4 rounded-xl bg-red-900/20 border border-red-500/50 flex items-start gap-3 text-red-200">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {/* Enhanced Prompt Display (Visible during/after generation) */}
          {enhancedPromptText && (
            <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-5 animate-fade-in">
              <div className="flex items-center gap-2 mb-2 text-indigo-400 text-sm font-medium">
                <Wand2 className="w-4 h-4" />
                AI Enhanced Prompt Structure
              </div>
              <p className="text-slate-300 text-sm italic leading-relaxed">
                "{enhancedPromptText}"
              </p>
            </div>
          )}

          {/* Results Area */}
          {status === AppStatus.COMPLETED && images.length > 0 && (
             <div className="space-y-6">
                <div className="flex justify-end">
                  <button
                    onClick={handleDownloadZip}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5"
                  >
                    <Download className="w-5 h-5" />
                    Download All (ZIP)
                  </button>
                </div>
                <GeneratedGallery images={images} />
             </div>
          )}
        </div>
      </main>
      
      <footer className="border-t border-slate-800 mt-20 py-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} Lumina 4K. Powered by Google Gemini Imagen 4.0.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;