import React from 'react';
import { AspectRatio } from '../types';
import { Maximize2 } from './Icons';

interface AspectRatioSelectorProps {
  selected: AspectRatio;
  onChange: (ratio: AspectRatio) => void;
  disabled: boolean;
}

const ratios = [
  { value: AspectRatio.SQUARE, label: 'Square (1:1)', dim: 'w-8 h-8' },
  { value: AspectRatio.PORTRAIT, label: 'Portrait (3:4)', dim: 'w-6 h-8' },
  { value: AspectRatio.LANDSCAPE, label: 'Landscape (4:3)', dim: 'w-8 h-6' },
  { value: AspectRatio.WIDE_PORTRAIT, label: 'Mobile (9:16)', dim: 'w-5 h-9' },
  { value: AspectRatio.WIDE_LANDSCAPE, label: 'Cinema (16:9)', dim: 'w-9 h-5' },
];

const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selected, onChange, disabled }) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
        <Maximize2 className="w-4 h-4" />
        Target Aspect Ratio
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {ratios.map((ratio) => (
          <button
            key={ratio.value}
            onClick={() => onChange(ratio.value)}
            disabled={disabled}
            className={`
              relative group flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200
              ${selected === ratio.value 
                ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-500/10' 
                : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-slate-600'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className={`
              border-2 rounded-sm mb-3 transition-colors
              ${selected === ratio.value ? 'border-indigo-400 bg-indigo-400/20' : 'border-slate-500 group-hover:border-slate-400'}
              ${ratio.dim}
            `} />
            <span className={`text-xs font-medium ${selected === ratio.value ? 'text-indigo-300' : 'text-slate-400'}`}>
              {ratio.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AspectRatioSelector;