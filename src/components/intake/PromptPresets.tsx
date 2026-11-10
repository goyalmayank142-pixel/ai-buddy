import React from 'react';
import { Sparkles } from 'lucide-react';

interface PromptPresetsProps {
  onSelectPrompt: (text: string) => void;
}

export const PromptPresets: React.FC<PromptPresetsProps> = ({ onSelectPrompt }) => {
  const presets = [
    {
      label: '🎧 Headphone return delay (12 days)',
      text: 'I returned my noise-cancelling headphones 12 days ago to SoundPro UK, but I haven\'t received my refund of £89.99. Order #SP-88219. Royal Mail tracking shows delivered 9 days ago.'
    },
    {
      label: '📦 Damaged furniture delivery',
      text: 'A coffee table arrived with a deep crack in the wood and smashed glass from OakLiving for £240. Delivered 4 days ago. Merchant says "no refunds on clearance items" which violates my rights.'
    },
    {
      label: '🔄 Gym subscription renewal after cancellation',
      text: 'PureFit Gym charged my card £45.00 on 2 days ago despite me emailing my cancellation notice 30 days prior in accordance with their contract terms. They refuse to refund the recurring charge.'
    },
    {
      label: '✈️ Canceled flight refused cash refund',
      text: 'My flight to Malaga was canceled by SkyAir 6 days ago. The ticket cost £310. SkyAir is only offering a flight voucher valid for 6 months instead of the statutory cash refund I requested.'
    }
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        <span>Try an everyday dispute scenario:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {presets.map((preset, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectPrompt(preset.text)}
            className="text-xs text-left bg-amber-50/70 hover:bg-amber-100/90 text-amber-900 border border-amber-200/80 px-3 py-1.5 rounded-lg transition-all hover:border-amber-300 active:scale-98"
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
};
