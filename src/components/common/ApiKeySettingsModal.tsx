import React, { useState } from 'react';
import { X, Key, Sparkles, Check, ExternalLink } from 'lucide-react';
import { getStoredGeminiKey, saveStoredGeminiKey } from '../../services/aiService';

interface ApiKeySettingsModalProps {
  onClose: () => void;
}

export const ApiKeySettingsModal: React.FC<ApiKeySettingsModalProps> = ({ onClose }) => {
  const [apiKey, setApiKey] = useState(getStoredGeminiKey());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    saveStoredGeminiKey(apiKey);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-orange-200 space-y-4 text-xs">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-xs">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">AI Buddy Settings</h2>
              <p className="text-[10px] text-slate-500">Vision, Voice & LLM Connection</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-slate-600 leading-relaxed text-[11.5px]">
          Buddy works 100% out of the box with <strong>real-time color pixel vision & voice speech</strong> (detecting red, yellow, and green flowers accurately!). For deeper multimodal reasoning, you can optionally connect a free Google Gemini API key:
        </p>

        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold uppercase text-slate-500">
            Gemini API Key (Optional)
          </label>
          <input
            type="password"
            placeholder="AIzaSy..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-200 bg-[#faf8f5] text-xs font-mono focus:outline-hidden focus:border-orange-500"
          />
        </div>

        <a
          href="https://aistudio.google.com/app/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] text-orange-600 hover:text-orange-800 font-semibold underline"
        >
          <span>Get a free Gemini API key</span>
          <ExternalLink className="w-3 h-3" />
        </a>

        <div className="pt-2 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold flex items-center gap-1.5 shadow-md"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Save Key</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
