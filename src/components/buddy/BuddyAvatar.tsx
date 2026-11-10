import React from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { BuddyMood } from '../../types/buddy';

interface BuddyAvatarProps {
  mood?: BuddyMood;
  isSpeaking?: boolean;
  isListening?: boolean;
  voiceEnabled?: boolean;
  onToggleVoice?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showSpeechBubble?: string;
}

export const BuddyAvatar: React.FC<BuddyAvatarProps> = ({
  mood = 'happy',
  isSpeaking = false,
  isListening = false,
  voiceEnabled = true,
  onToggleVoice,
  size = 'md',
  showSpeechBubble,
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
  };

  const moodBadges: Record<BuddyMood, { emoji: string; label: string }> = {
    happy: { emoji: '😊', label: 'Ready to help' },
    thinking: { emoji: '🤔', label: 'Thinking...' },
    excited: { emoji: '✨', label: 'Ooh look!' },
    caring: { emoji: '💖', label: 'Here for you' },
    helpful: { emoji: '🛠️', label: 'Let\'s fix it' },
  };

  return (
    <div className="relative inline-flex flex-col items-center">
      {/* Speech Bubble popup if provided */}
      {showSpeechBubble && (
        <div className="mb-2 max-w-[240px] bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl rounded-bl-xs border border-orange-200/80 shadow-md text-xs font-medium text-slate-800 leading-snug animate-fade-in relative z-10">
          <p>{showSpeechBubble}</p>
          <div className="absolute -bottom-1.5 left-4 w-3 h-3 bg-white border-r border-b border-orange-200/80 rotate-45 transform" />
        </div>
      )}

      <div className="relative">
        {/* Glow Ring when speaking or listening */}
        {(isSpeaking || isListening) && (
          <div
            className={`absolute -inset-1.5 rounded-full blur-xs animate-pulse ${
              isSpeaking
                ? 'bg-gradient-to-r from-orange-400 via-amber-400 to-rose-400'
                : 'bg-gradient-to-r from-blue-400 to-teal-400'
            }`}
          />
        )}

        {/* Avatar Image Container */}
        <div
          className={`${sizeClasses[size]} relative rounded-full overflow-hidden border-2 ${
            isSpeaking ? 'border-orange-500 scale-105' : 'border-white'
          } shadow-md bg-gradient-to-br from-amber-100 to-orange-100 transition-all duration-300 flex items-center justify-center`}
        >
          {/* High-quality 3D companion avatar matching user reference */}
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
            alt="AI Buddy"
            className="w-full h-full object-cover"
          />

          {/* Sound Wave Indicator when Buddy speaks */}
          {isSpeaking && (
            <div className="absolute inset-x-0 bottom-0 bg-black/40 backdrop-blur-xs py-0.5 flex items-center justify-center gap-0.5">
              <span className="w-1 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-3.5 bg-amber-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          )}
        </div>

        {/* Small Mood Badge */}
        <div
          className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-[11px]"
          title={moodBadges[mood].label}
        >
          {moodBadges[mood].emoji}
        </div>

        {/* Toggle Voice Audio Button */}
        {onToggleVoice && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleVoice();
            }}
            className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center shadow-xs text-white text-[10px] transition-all ${
              voiceEnabled ? 'bg-orange-600 hover:bg-orange-700' : 'bg-slate-400 hover:bg-slate-500'
            }`}
            title={voiceEnabled ? 'Voice output on' : 'Voice muted'}
          >
            {voiceEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
          </button>
        )}
      </div>

      {/* Listening Status indicator */}
      {isListening && (
        <span className="mt-1 flex items-center gap-1 text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200 animate-pulse">
          <Sparkles className="w-2.5 h-2.5" />
          Listening to you...
        </span>
      )}
    </div>
  );
};
