import React from 'react';
import { Home, Camera, MessageCircle, Wrench } from 'lucide-react';

export type BuddyTab = 'home' | 'camera' | 'chat' | 'guides';

interface MobileBottomNavProps {
  currentTab: BuddyTab;
  onSelectTab: (tab: BuddyTab) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab
}) => {
  return (
    <div className="shrink-0 bg-white/95 backdrop-blur-md border-t border-[#ede2d2] px-3 pt-2 pb-2.5 z-30 flex items-center justify-around select-none">
      <button
        onClick={() => onSelectTab('home')}
        className={`flex flex-col items-center gap-0.5 transition-all ${
          currentTab === 'home'
            ? 'text-orange-600 font-bold'
            : 'text-slate-400 hover:text-slate-700'
        }`}
      >
        <div className={`p-1 rounded-xl ${currentTab === 'home' ? 'bg-orange-50' : ''}`}>
          <Home className="w-4 h-4" />
        </div>
        <span className="text-[10px]">Buddy</span>
      </button>

      <button
        onClick={() => onSelectTab('camera')}
        className={`flex flex-col items-center gap-0.5 transition-all ${
          currentTab === 'camera'
            ? 'text-orange-600 font-bold'
            : 'text-slate-400 hover:text-slate-700'
        }`}
      >
        <div className={`p-1 rounded-xl relative ${currentTab === 'camera' ? 'bg-orange-50' : ''}`}>
          <Camera className="w-4 h-4" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <span className="text-[10px]">Camera</span>
      </button>

      <button
        onClick={() => onSelectTab('chat')}
        className={`flex flex-col items-center gap-0.5 transition-all ${
          currentTab === 'chat'
            ? 'text-orange-600 font-bold'
            : 'text-slate-400 hover:text-slate-700'
        }`}
      >
        <div className={`p-1 rounded-xl ${currentTab === 'chat' ? 'bg-orange-50' : ''}`}>
          <MessageCircle className="w-4 h-4" />
        </div>
        <span className="text-[10px]">Chat</span>
      </button>

      <button
        onClick={() => onSelectTab('guides')}
        className={`flex flex-col items-center gap-0.5 transition-all ${
          currentTab === 'guides'
            ? 'text-orange-600 font-bold'
            : 'text-slate-400 hover:text-slate-700'
        }`}
      >
        <div className={`p-1 rounded-xl ${currentTab === 'guides' ? 'bg-orange-50' : ''}`}>
          <Wrench className="w-4 h-4" />
        </div>
        <span className="text-[10px]">DIY Fixes</span>
      </button>
    </div>
  );
};
