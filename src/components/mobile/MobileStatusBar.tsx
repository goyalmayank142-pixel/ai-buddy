import React, { useState, useEffect } from 'react';
import { Wifi } from 'lucide-react';

interface MobileStatusBarProps {
  dark?: boolean;
}

export const MobileStatusBar: React.FC<MobileStatusBarProps> = ({ dark = false }) => {
  const [time, setTime] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours % 12 || 12}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const textColor = dark ? 'text-white' : 'text-slate-900';
  const fillColor = dark ? 'bg-white' : 'bg-slate-900';

  return (
    <div className={`w-full flex items-center justify-between px-7 pt-3 pb-1 select-none text-[13px] font-semibold tracking-tight ${textColor}`}>
      {/* Time */}
      <span className="font-bold">{time}</span>

      {/* Dynamic Island / Speaker cutout space */}
      <div className="w-20 h-4 bg-transparent rounded-full mx-auto" />

      {/* Icons: Cellular, Wifi, Battery */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Cellular bars */}
        <div className="flex items-end gap-[1.5px] h-3 w-4">
          <span className={`w-[2px] h-[30%] ${fillColor} rounded-[0.5px]`} />
          <span className={`w-[2px] h-[50%] ${fillColor} rounded-[0.5px]`} />
          <span className={`w-[2px] h-[75%] ${fillColor} rounded-[0.5px]`} />
          <span className={`w-[2px] h-[100%] ${fillColor} rounded-[0.5px]`} />
        </div>

        {/* Wifi */}
        <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />

        {/* Battery */}
        <div className="flex items-center">
          <div className={`w-5 h-2.5 rounded-[4px] border ${dark ? 'border-white' : 'border-slate-900'} p-[1px] flex items-center`}>
            <div className={`h-full w-[80%] ${fillColor} rounded-[2px]`} />
          </div>
          <div className={`w-[1px] h-1 ${fillColor} rounded-r-[0.5px] -ml-[0.5px]`} />
        </div>
      </div>
    </div>
  );
};
