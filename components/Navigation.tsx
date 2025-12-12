import React from 'react';
import { AppView } from '../types';

interface NavigationProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onChangeView }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-50 bg-slate-900/90 backdrop-blur-lg border-t border-white/10">
      <div className="flex justify-around items-center max-w-md mx-auto">
        <button
          onClick={() => onChangeView('home')}
          className={`flex flex-col items-center p-2 rounded-xl transition-all ${
            currentView === 'home' || currentView === 'details' ? 'text-blue-400 bg-white/5' : 'text-slate-400'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          <span className="text-xs mt-1 font-medium">Foods</span>
        </button>
        
        <button
          onClick={() => onChangeView('camera')}
          className={`flex flex-col items-center p-4 -mt-8 rounded-full shadow-lg border border-white/20 transition-all ${
             currentView === 'camera' 
             ? 'bg-gradient-to-tr from-blue-500 to-purple-600 text-white scale-110 shadow-blue-500/50' 
             : 'bg-slate-800 text-slate-300'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
        </button>

        <button
          onClick={() => alert("Settings not available in this demo.")}
          className={`flex flex-col items-center p-2 rounded-xl transition-all text-slate-400`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          <span className="text-xs mt-1 font-medium">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Navigation;