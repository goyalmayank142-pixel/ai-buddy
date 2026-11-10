import React from 'react';
import { X } from 'lucide-react';

interface MobileHeaderProps {
  currentStep?: number;
  totalSteps?: number;
  onClose?: () => void;
  title?: string;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  currentStep = 1,
  totalSteps = 4,
  onClose,
  title = 'SmartClaim'
}) => {
  return (
    <div className="w-full flex items-center justify-between px-6 py-2.5">
      {/* Brand Title */}
      <span className="text-[13px] font-bold text-slate-800 tracking-tight">
        {title}
      </span>

      {/* Progress Dashes */}
      <div className="flex items-center gap-1.5 flex-1 max-w-[130px] mx-4">
        {Array.from({ length: totalSteps }).map((_, idx) => {
          const stepNum = idx + 1;
          const isActive = stepNum <= currentStep;
          return (
            <div
              key={idx}
              className={`h-[3.5px] flex-1 rounded-full transition-all duration-300 ${
                isActive ? 'bg-[#de7b35]' : 'bg-[#e9decb]'
              }`}
            />
          );
        })}
      </div>

      {/* Close Button */}
      {onClose ? (
        <button
          onClick={onClose}
          type="button"
          className="w-7 h-7 flex items-center justify-center rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4 stroke-[2.2]" />
        </button>
      ) : (
        <div className="w-7" />
      )}
    </div>
  );
};
