import React from 'react';
import { Wrench, HelpCircle, MessageCircle } from 'lucide-react';
import { BuddyAnalysisResult } from '../../services/aiBuddyService';

interface VisionResultCardProps {
  analysisResult: BuddyAnalysisResult;
  onSelectFollowUp: (prompt: string) => void;
  onOpenChatWithTopic?: (topic: string) => void;
}

export const VisionResultCard: React.FC<VisionResultCardProps> = ({
  analysisResult,
  onSelectFollowUp,
  onOpenChatWithTopic
}) => {
  return (
    <div className="p-3.5 bg-[#251f1a] border-t border-orange-500/30 text-white space-y-2 z-10 max-h-52 overflow-y-auto no-scrollbar">
      <div className="flex items-start gap-2.5">
        <span className="text-lg">💬</span>
        <div className="flex-1">
          <p className="text-xs font-semibold text-orange-200 leading-relaxed">
            {analysisResult.reply}
          </p>
          {analysisResult.actionTip && (
            <div className="mt-2 p-2 rounded-xl bg-black/40 border border-orange-400/20 text-[11px] text-amber-100 flex items-start gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
              <span><strong>Buddy\'s Tip:</strong> {analysisResult.actionTip}</span>
            </div>
          )}
        </div>
      </div>

      {/* Follow-up suggestions */}
      {analysisResult.followUpSuggestions?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {analysisResult.followUpSuggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => onSelectFollowUp(suggestion)}
              className="text-[10px] bg-white/10 hover:bg-white/20 text-orange-200 px-2 py-1 rounded-full border border-white/10 transition-colors flex items-center gap-1"
            >
              <HelpCircle className="w-2.5 h-2.5 text-orange-400" />
              <span>{suggestion}</span>
            </button>
          ))}
        </div>
      )}

      {/* Transition to Chat */}
      {onOpenChatWithTopic && (
        <button
          onClick={() =>
            onOpenChatWithTopic(
              `Let's talk about what you saw: ${analysisResult.detectedSubject || 'this'}`
            )
          }
          className="w-full mt-2 py-1.5 px-3 rounded-xl bg-orange-600/30 hover:bg-orange-600/50 border border-orange-500/40 text-[11px] font-bold text-orange-200 flex items-center justify-center gap-1.5 transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Chat with Buddy about this</span>
        </button>
      )}
    </div>
  );
};
