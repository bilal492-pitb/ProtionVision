import React from 'react';
import { FoodItem } from '../types';

interface ComparisonCardProps {
  food: FoodItem;
  onClose: () => void;
  onOpenAR: () => void;
}

const ComparisonCard: React.FC<ComparisonCardProps> = ({ food, onClose, onOpenAR }) => {
  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-slide-up relative">
        
        {/* Header Image Gradient */}
        <div className={`h-32 bg-gradient-to-br ${food.color} relative`}>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white backdrop-blur-md transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
          <div className="absolute bottom-4 left-6">
             <span className="px-2 py-1 bg-black/30 rounded-lg text-xs font-bold tracking-wider uppercase backdrop-blur-md text-white/90 mb-2 inline-block">
               {food.category}
             </span>
             <h2 className="text-3xl font-bold text-white shadow-sm">{food.name}</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          <div className="grid grid-cols-2 gap-4">
             <div className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                <span className="text-slate-400 text-xs font-medium uppercase tracking-wide">Calories</span>
                <span className="text-2xl font-bold text-white">{food.calories}</span>
             </div>
             <div className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                <span className="text-slate-400 text-xs font-medium uppercase tracking-wide">Serving</span>
                <span className="text-2xl font-bold text-white">{food.portionSize}</span>
             </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border-l-4 border-blue-500">
             <h3 className="text-lg font-semibold text-blue-200 mb-1">Visual Cue</h3>
             <div className="flex items-center gap-3">
               <div className={`p-2 rounded-lg bg-gradient-to-br ${food.color} opacity-80`}>
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                   <path d="M2 12h20M12 2v20"/>
                   {food.referenceIcon === 'rect' && <rect x="3" y="3" width="18" height="18" rx="2" />}
                   {food.referenceIcon === 'circle' && <circle cx="12" cy="12" r="10" />}
                   {food.referenceIcon === 'sphere' && <circle cx="12" cy="12" r="10" />}
                   {food.referenceIcon === 'hand' && <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/>}
                 </svg>
               </div>
               <p className="text-xl font-bold text-white">{food.visualReference}</p>
             </div>
             <p className="mt-2 text-slate-300 text-sm leading-relaxed">{food.description}</p>
          </div>

          <button
            onClick={onOpenAR}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-lg shadow-lg shadow-blue-900/50 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
            Visualize with AR Camera
          </button>
        </div>

      </div>
    </div>
  );
};

export default ComparisonCard;