import React from 'react';
import { FOOD_DATA } from '../constants';
import { FoodItem } from '../types';

interface FoodListProps {
  onSelectFood: (food: FoodItem) => void;
}

const FoodList: React.FC<FoodListProps> = ({ onSelectFood }) => {
  return (
    <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-4 pb-24">
      {FOOD_DATA.map((food) => (
        <button
          key={food.id}
          onClick={() => onSelectFood(food)}
          className="glass-panel rounded-2xl p-4 flex flex-col items-start text-left hover:bg-white/10 transition-colors group relative overflow-hidden"
        >
          <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${food.color} opacity-20 blur-xl rounded-full -mr-8 -mt-8 group-hover:opacity-30 transition-opacity`}></div>
          
          <div className={`p-2 rounded-lg bg-gradient-to-br ${food.color} mb-3 shadow-lg`}>
             {/* Simple Icon Representation based on category */}
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                {food.category === 'Protein' && <path d="M12 5l-8 4v8l8 4 8-4V9l-8-4z"/>}
                {food.category === 'Carbs' && <circle cx="12" cy="12" r="8"/>}
                {food.category === 'Produce' && <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"/>}
                {food.category === 'Fats' && <rect x="4" y="4" width="16" height="16" rx="4"/>}
                {['Snacks', 'Sweets', 'Dairy'].includes(food.category) && <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>}
             </svg>
          </div>
          
          <h3 className="font-bold text-white leading-tight mb-1">{food.name}</h3>
          <p className="text-xs text-slate-400">{food.portionSize}</p>
          <div className="mt-3 text-[10px] uppercase tracking-wider font-semibold text-blue-300/80 bg-blue-500/10 px-2 py-1 rounded">
             {food.visualReference}
          </div>
        </button>
      ))}
    </div>
  );
};

export default FoodList;