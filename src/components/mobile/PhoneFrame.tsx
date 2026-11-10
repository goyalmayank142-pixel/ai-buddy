import React, { useState } from 'react';
import { MobileStatusBar } from './MobileStatusBar';
import { Smartphone, Monitor } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  const [deviceMode, setDeviceMode] = useState<'phone' | 'fluid'>('phone');

  return (
    <div className="min-h-screen bg-[#1c1815] bg-gradient-to-br from-[#1b1714] via-[#2a221b] to-[#120f0d] flex flex-col items-center justify-center p-0 sm:py-8 sm:px-4 font-sans select-none antialiased">
      {/* Top Device Switcher (visible on desktop) */}
      <div className="hidden sm:flex items-center gap-3 mb-4 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/15 text-xs text-white/80 no-print">
        <span className="font-semibold text-amber-200">AI Buddy — Everyday Friend</span>
        <div className="w-[1px] h-3.5 bg-white/20" />
        <button
          onClick={() => setDeviceMode('phone')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all ${
            deviceMode === 'phone'
              ? 'bg-white/20 text-white font-bold'
              : 'hover:text-white hover:bg-white/10'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>iPhone View</span>
        </button>
        <button
          onClick={() => setDeviceMode('fluid')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all ${
            deviceMode === 'fluid'
              ? 'bg-white/20 text-white font-bold'
              : 'hover:text-white hover:bg-white/10'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Wide Mobile</span>
        </button>
      </div>

      {/* Phone Chassis */}
      <div
        className={`w-full transition-all duration-300 flex flex-col ${
          deviceMode === 'phone'
            ? 'sm:w-[390px] sm:h-[844px] sm:max-h-[92vh] sm:rounded-[52px] sm:border-[10px] sm:border-[#2f2721] sm:shadow-[0_25px_70px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.15)] sm:ring-1 sm:ring-black/40 overflow-hidden relative'
            : 'sm:max-w-md sm:h-[844px] sm:max-h-[92vh] sm:rounded-[40px] sm:border-4 sm:border-[#382f28] sm:shadow-2xl overflow-hidden relative'
        } min-h-screen sm:min-h-0 bg-[#fbf8f3]`}
      >
        {/* iOS Dynamic Island (desktop mockup) */}
        <div className="hidden sm:block absolute top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-40 pointer-events-none shadow-xs" />

        {/* Status Bar */}
        <div className="shrink-0 z-30 pt-1">
          <MobileStatusBar />
        </div>

        {/* Inner Phone Screen Content */}
        <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar relative">
          {children}
        </div>
      </div>
    </div>
  );
};
