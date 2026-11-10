import React from 'react';
import { X, Scale } from 'lucide-react';

interface AppExplainerModalProps {
  onClose: () => void;
}

export const AppExplainerModal: React.FC<AppExplainerModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-amber-900/10 space-y-4 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#de7b35] flex items-center justify-center text-white shadow-xs">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">What is ResolveIt?</h2>
              <p className="text-[11px] text-[#de7b35] font-semibold">Your AI Consumer Lawyer in India 🇮🇳</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* The Everyday Problem in India */}
        <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <span>😤</span> The Problem Indian Consumers Face:
          </p>
          <p className="text-[11.5px] leading-relaxed text-amber-950">
            Flipkart rejects your damaged return? Swiggy delivers spoiled food and bot says "no refund"? UPI fails and ₹2,000 gets stuck? Companies ignore you because you don't know the exact legal sections to cite.
          </p>
        </div>

        {/* What ResolveIt Does Step-by-Step */}
        <div className="space-y-2.5 text-xs">
          <p className="font-extrabold uppercase tracking-wider text-slate-500 text-[10px]">
            How ResolveIt Gets Your Money Back:
          </p>

          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-[#faede2] text-[#de7b35] font-bold flex items-center justify-center shrink-0 text-[11px]">
              1
            </span>
            <div>
              <p className="font-bold text-slate-800">You just tell what happened</p>
              <p className="text-[11px] text-slate-500">
                In Hindi, English, or Hinglish. Add a photo of the bill or damaged product.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-[#faede2] text-[#de7b35] font-bold flex items-center justify-center shrink-0 text-[11px]">
              2
            </span>
            <div>
              <p className="font-bold text-slate-800">Real AI analyzes Indian Law</p>
              <p className="text-[11px] text-slate-500">
                Finds exact sections violated under Consumer Protection Act 2019, E-Commerce Rules 2020, or RBI circulars.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-[#faede2] text-[#de7b35] font-bold flex items-center justify-center shrink-0 text-[11px]">
              3
            </span>
            <div>
              <p className="font-bold text-slate-800">Drafts formal Grievance Notice</p>
              <p className="text-[11px] text-slate-500">
                Gives you a ready-to-send legal email to the company's Grievance Officer with a strict 48h deadline.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-[#faede2] text-[#de7b35] font-bold flex items-center justify-center shrink-0 text-[11px]">
              4
            </span>
            <div>
              <p className="font-bold text-slate-800">1-Click Govt Escalation</p>
              <p className="text-[11px] text-slate-500">
                Direct WhatsApp / Toll-free access to National Consumer Helpline (1915) & E-Daakhil court.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={onClose}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all shadow-xs"
        >
          Got it! Try an Example Claim →
        </button>
      </div>
    </div>
  );
};
