import React, { useState } from 'react';
import { X, Play, CheckCircle2, AlertTriangle, ArrowRight, Camera } from 'lucide-react';
import { BuddyFixGuide } from '../../data/buddyGuides';

interface BuddyGuideModalProps {
  guide: BuddyFixGuide;
  onClose: () => void;
  onOpenCamera: () => void;
  onAskBuddy: (question: string) => void;
}

export const BuddyGuideModal: React.FC<BuddyGuideModalProps> = ({
  guide,
  onClose,
  onOpenCamera,
  onAskBuddy
}) => {
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const toggleStep = (stepNumber: number) => {
    setCompletedSteps((prev) =>
      prev.includes(stepNumber) ? prev.filter((s) => s !== stepNumber) : [...prev, stepNumber]
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-sm bg-[#fbf8f3] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-[#ede3d5] animate-scale-up">
        {/* Header Bar */}
        <div className="px-4 py-3 bg-white border-b border-[#ede3d5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{guide.icon}</span>
            <div>
              <h3 className="text-xs font-bold text-slate-900 leading-tight">
                {guide.title}
              </h3>
              <span className="text-[10px] font-semibold text-orange-600">{guide.badge}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {/* YouTube Video Section */}
          {guide.youtubeVideo && (
            <div className="rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-xs">
              {isPlayingVideo ? (
                <div className="relative pt-[56.25%] w-full">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${guide.youtubeVideo.videoId}?autoplay=1`}
                    title={guide.youtubeVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div
                  onClick={() => setIsPlayingVideo(true)}
                  className="relative h-36 cursor-pointer group"
                >
                  <img
                    src={guide.youtubeVideo.thumbnailUrl}
                    alt={guide.youtubeVideo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 text-[10px] font-mono font-bold bg-black/80 text-white px-2 py-0.5 rounded">
                    {guide.youtubeVideo.duration}
                  </span>
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-red-600 text-white text-[9px] font-bold">
                    ▶ YouTube Fix Tutorial
                  </div>
                </div>
              )}
              <div className="p-2.5 bg-white">
                <p className="text-[11px] font-bold text-slate-800 line-clamp-1">
                  {guide.youtubeVideo.title}
                </p>
                <p className="text-[10px] text-slate-500">{guide.youtubeVideo.channelName}</p>
              </div>
            </div>
          )}

          {/* Common Symptoms */}
          <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-200/80">
            <h4 className="text-[11px] font-bold text-amber-900 flex items-center gap-1.5 mb-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
              <span>Symptoms To Check:</span>
            </h4>
            <ul className="space-y-1">
              {guide.symptoms.map((sym, idx) => (
                <li key={idx} className="text-[10px] text-amber-950 flex items-start gap-1.5">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{sym}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Steps Checklist */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-black tracking-wider uppercase text-slate-600">
              Step-by-Step Fix Instructions:
            </h4>
            {guide.steps.map((step) => {
              const isDone = completedSteps.includes(step.number);
              return (
                <div
                  key={step.number}
                  onClick={() => toggleStep(step.number)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                    isDone
                      ? 'bg-emerald-50/60 border-emerald-300'
                      : 'bg-white border-[#ede3d5] hover:border-orange-300'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <button className="mt-0.5 shrink-0">
                      <CheckCircle2
                        className={`w-4 h-4 ${
                          isDone ? 'text-emerald-600 fill-emerald-100' : 'text-slate-300'
                        }`}
                      />
                    </button>
                    <div className="space-y-1 flex-1">
                      <p
                        className={`text-xs font-bold ${
                          isDone ? 'line-through text-slate-500' : 'text-slate-900'
                        }`}
                      >
                        {step.number}. {step.title}
                      </p>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {step.description}
                      </p>
                      {step.tip && (
                        <p className="text-[10px] text-orange-700 font-medium bg-orange-50 px-2 py-1 rounded-lg border border-orange-200/50">
                          💡 Tip: {step.tip}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 bg-white border-t border-[#ede3d5] flex items-center justify-between gap-2">
          <button
            onClick={() => {
              onClose();
              onOpenCamera();
            }}
            className="flex-1 py-2 px-3 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 text-xs font-bold flex items-center justify-center gap-1.5 border border-orange-200 transition-colors"
          >
            <Camera className="w-3.5 h-3.5 text-orange-600" />
            <span>Show Camera</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onAskBuddy(`Can you help me fix my ${guide.title}?`);
            }}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-orange-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Ask Buddy</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
