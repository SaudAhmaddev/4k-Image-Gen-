import React from 'react';
import { GeneratedImage } from '../types';
import { Download } from './Icons';

interface GeneratedGalleryProps {
  images: GeneratedImage[];
}

const GeneratedGallery: React.FC<GeneratedGalleryProps> = ({ images }) => {
  if (images.length === 0) return null;

  return (
    <div className="w-full mt-12 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Generated Results</h2>
        <span className="text-sm text-slate-400">{images.length} images generated in high resolution</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {images.map((img, idx) => (
          <div key={img.id} className="group relative rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 shadow-2xl">
            <img
              src={`data:${img.mimeType};base64,${img.base64}`}
              alt={`Generated result ${idx + 1}`}
              className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-6">
              <span className="text-white font-medium text-sm">Image {idx + 1}</span>
              <a
                href={`data:${img.mimeType};base64,${img.base64}`}
                download={`lumina-4k-image-${idx + 1}.png`}
                className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg text-white transition-colors border border-white/20"
                title="Download Single Image"
              >
                <Download className="w-5 h-5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeneratedGallery;