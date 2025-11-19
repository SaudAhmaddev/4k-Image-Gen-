import React from 'react';
import { Sparkles } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Lumina 4K
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              High-Fidelity Imagen 4.0 Generator
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                Gemini Powered
            </span>
        </div>
      </div>
    </header>
  );
};

export default Header;