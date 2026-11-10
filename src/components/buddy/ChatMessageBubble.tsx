import React from 'react';
import { Volume2, Wrench, Sparkles } from 'lucide-react';
import { BuddyMessage } from '../../types/buddy';

interface ChatMessageBubbleProps {
  message: BuddyMessage;
  onPlayVoice: (text: string) => void;
  onSelectFollowUp: (text: string) => void;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({
  message,
  onPlayVoice,
  onSelectFollowUp
}) => {
  const isUser = message.sender === 'user';

  return (
    <div
      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[90%] ${
        isUser ? 'ml-auto' : 'mr-auto'
      }`}
    >
      <div
        className={`p-3.5 rounded-3xl text-xs leading-relaxed shadow-2xs relative ${
          isUser
            ? 'bg-slate-900 text-white rounded-br-xs'
            : 'bg-white text-slate-800 border border-[#ede3d5] rounded-bl-xs'
        }`}
      >
        {message.imageUrl && (
          <div className="mb-2 rounded-2xl overflow-hidden border border-slate-200">
            <img src={message.imageUrl} alt="Attached" className="w-full max-h-48 object-cover" />
          </div>
        )}

        <p>{message.text}</p>

        {message.actionTip && (
          <div className="mt-2.5 p-2 rounded-xl bg-orange-50 border border-orange-200 text-[11px] text-orange-950 flex items-start gap-1.5">
            <Wrench className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
            <span>
              <strong>Action Tip:</strong> {message.actionTip}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 mt-1.5 text-[9px] opacity-60">
          <span>{message.timestamp}</span>
          {!isUser && (
            <button
              onClick={() => onPlayVoice(message.text)}
              className="hover:opacity-100 flex items-center gap-0.5 text-orange-600 font-bold"
            >
              <Volume2 className="w-3 h-3" />
              <span>Speak</span>
            </button>
          )}
        </div>
      </div>

      {message.suggestedFollowUps && message.suggestedFollowUps.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {message.suggestedFollowUps.map((pill, idx) => (
            <button
              key={idx}
              onClick={() => onSelectFollowUp(pill)}
              className="text-[10px] bg-white hover:bg-orange-50 text-slate-700 hover:text-orange-700 px-2.5 py-1 rounded-full border border-[#ede3d5] shadow-2xs transition-all flex items-center gap-1"
            >
              <Sparkles className="w-2.5 h-2.5 text-orange-500" />
              <span>{pill}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
